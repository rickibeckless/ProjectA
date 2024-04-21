import { Link, Routes, Route, useLocation } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { supabase } from '../App';
import axios from 'axios';

export function Home() {

    const [post, setPost] = useState([]);
    const [sortBy, setSortBy] = useState('sort_date');

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
                } else {
                    query = query.order('upvotes', { ascending: false });
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

            <div className="post-card-holder">
                <div>
                    <label htmlFor="sort-list">Sort by: </label>
                    <select id="sort-list" value={sortBy} onChange={handleSortChange}>
                        <option value="sort_date">post date</option>
                        <option value="sort_votes">vote count</option>
                    </select>
                </div>
                {post.slice().map(post => (
                    <div className="post-card" key={post.id}>
                        <div className="post-card-heading">
                            <p className="post-user">{post?.username}</p>
                            <p className="date-posted">{formatDate(post.created_at)}</p>
                            <p className="time-posted">{formatTime(post.created_at)}</p>
                        </div>
                        <div className="post-content">
                            <Link key={post.id} to={`/${post.id}/${encodeURIComponent(post.title)}`}>
                                <h3 className="post-title">{post.title}</h3>
                            </Link>

                            {post?.media === "file" && (
                                <img src={`data:image/png;base64,${post.file}`} alt="post card image" className="post-img" />
                            )}
                            {post?.media === "url" && (
                                <img src={post?.url} alt="post card image" className="post-img" />
                            )}

                            <p className="post-text">{post.content}</p>
                        </div>
                        <div className="post-votes">
                            <p>Upvotes: {post.upvotes}</p>
                            <button className="upvote-btn" onClick={() => handleUpvote(post.id)}>Upvote</button>
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
};