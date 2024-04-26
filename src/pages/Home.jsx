import { Link, Routes, Route, useLocation, useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { supabase } from '../App';
import axios from 'axios';
import PostResponseCard from '../components/PostResponseCard';

export function Home() {

    const { id } = useParams();
    const [post, setPost] = useState([]);
    const [comment, setComment] = useState([]);
    const [sortBy, setSortBy] = useState('sort_date');
    const [viewStyle, setViewStyle] = useState('default-view');

    const location = useLocation();
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        const newSearchResults = location.state ? location.state.searchResults : [];
        setSearchResults(newSearchResults);
    }, [location.state]);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                let query = supabase.from('Posts').select('*');
                
                if (sortBy === 'sort_date') {
                    query = query.order('created_at', { ascending: false });
                } else if (sortBy === 'sort_votes') {
                    query = query.order('upvotes', { ascending: false });
                } else if (sortBy === 'sort_comments') {
                    const postsWithCommentCount = await Promise.all(
                        (await query).data.map(async post => {
                            const commentCount = (await supabase.from('Comments').select('id').eq('post_id', post.id)).data.length;
                            return { ...post, commentCount };
                        })
                    );
        
                    postsWithCommentCount.sort((a, b) => b.commentCount - a.commentCount);
        
                    setPost(postsWithCommentCount);
                    
                    return;
                }
                
                const { data, error } = await query;
                
                if (error) {
                    throw error;
                }
                setPost(data);
            } catch (error) {
                console.error("Error fetching posts:", error.message);
            }  
        };

        const fetchComment = async () => {
            try {
                const { data: commentData, error: commentError } = await supabase
                    .from('Comments')
                    .select('*')
                if (commentError) {
                    throw commentError;
                }
                setComment(commentData);
            } catch (error) {
                console.error("Error fetching posts:", error.message);
            }
        };

        fetchComment();
        fetchPost();
    }, [supabase, sortBy]);

    const formatDate = (isoDate) => {
        const date = new Date(isoDate);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric',  });
    };

    const formatTime = (isoDate) => {
        const date = new Date(isoDate);
        return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    };

    const handleUpvote = async (id) => {
        try {
            const updatedUpvotes = post.find(p => p.id === id).upvotes + 1;
            const { data, error } = await supabase
                .from('Posts')
                .update({ upvotes: updatedUpvotes })
                .eq('id', id);
            if (error) {
                throw error;
            }
            setPost(prevState => prevState.map(p => (p.id === id ? { ...p, upvotes: updatedUpvotes } : p)));
        } catch (error) {
            console.error("Error upvoting post:", error.message);
        }
    };

    const handleSortChange = (e) => {
        setSortBy(e.target.value);
    };

    const handleViewChange = (e) => {
        setViewStyle(e.target.value);
    };

    const handleCommentUpdate = async () => {
        try {
            const { data: commentData, error: commentError } = await supabase
                .from('Comments')
                .select('*')
            if (commentError) {
                throw commentError;
            }
            setComment(commentData);
        } catch (error) {
            console.error("Error fetching posts:", error.message);
        }
    };

    const handlePostImageClick = (e) => {
        e.currentTarget.classList.toggle('expanded');
    };

    return (
        <>
            <h1 className="page-title">Project A</h1>
            <p className="page-summary" id="home-page-summary"></p>

            {searchResults.length > 0 && (
                <div className="search-result-holder">
                    {searchResults.map(result => (
                        <div key={result.id}>
                            <h3>{result.title}</h3>
                            <p>{result.content}</p>
                        </div>
                    ))}
                </div>
            )}

            <div>
                <label htmlFor="sort-list">Sort by: </label>
                <select id="sort-list" value={sortBy} onChange={handleSortChange}>
                    <option value="sort_date">post date</option>
                    <option value="sort_votes">vote count</option>
                    <option value="sort_comments">comment count</option>
                </select>

                <label htmlFor="view-style">View: </label>
                <select id="view-style" value={viewStyle} onChange={handleViewChange}>
                    <option value="default-view">Default View</option>
                    <option value="expanded-view">Expanded View</option>
                </select>
            </div>

            {viewStyle === 'default-view' ? (
                <div className="post-card-holder">
                    {post.slice().map(post => (
                        <div key={post.id} className="post-comment-holder default">
                            <Link to={`/${post.id}/${encodeURIComponent(post.title)}`}>
                                <div className="post-card" key={post.id}>
                                    <div className="post-card-heading">
                                        <p className="date-posted">{formatDate(post.created_at)}</p>
                                        <p className="time-posted">{formatTime(post.created_at)}</p>
                                    </div>
                                    <div className="post-content">
                                        <h3 className="post-title">{post.title}</h3>
                                    </div>
                                    <div className="post-votes">
                                        <p>Upvotes: {post.upvotes}</p>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="post-card-holder">
                    {post.slice().map(post => (
                        <div key={post.id} className="post-comment-holder">
                            <div className="post-card" key={post.id}>
                                <div className="post-card-heading">
                                    <h2 className="post-user">{post?.username}</h2>
                                    <div className="post-created-stats">
                                        <p className="date-posted">{formatDate(post.created_at)}</p>
                                        <p className="time-posted">{formatTime(post.created_at)}</p>
                                    </div>
                                </div>

                                {post?.media && (
                                    <div className="post-img-holder" onClick={handlePostImageClick}>
                                        {post?.media === "file" && (
                                            <img src={`data:image/png;base64,${post.file}`} alt="post card image" className="post-img" />
                                        )}
                                        {post?.media === "url" && (
                                            <img src={post?.url} alt="post card image" className="post-img" />
                                        )}
                                    </div>
                                )}

                                <div className="post-content">
                                    <Link to={`/${post.id}/${encodeURIComponent(post.title)}`}>
                                        <h3 className="post-title">{post.title}</h3>
                                        <p className="post-text">{post.content}</p>
                                    </Link>
                                </div>

                                <div className="post-response-stats">
                                    <div className="post-votes">
                                        <p>Upvotes: {post.upvotes}</p>
                                    </div>
                                    <p>Comments: {comment.filter(c => c.post_id === post.id).length}</p>                                        
                                </div>
                            </div>
                            <div className="post-comment-display">
                                {comment.filter(c => c.post_id === post.id).reverse().map(index => (
                                    <div key={index.id} className="comment">
                                        <h4 className="comment-user">{index.comment_username}</h4>
                                        <p className="comment-content">
                                            {index.comment_content}
                                            <span className="comment-created">{formatTime(index.created_at)}</span>
                                        </p>
                                    </div>
                                ))}

                                <div className="post-response-card-holder">
                                    <PostResponseCard postId={post.id} onUpdate={handleCommentUpdate} handleUpvote={handleUpvote} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>                
            )}
        </>
    )
};