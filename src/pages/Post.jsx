import { Link, Routes, Route, useParams } from "react-router-dom";
import React, { useEffect, useState } from 'react';
import { supabase } from '../App';
import axios from 'axios';
import PostResponseCard from "../components/PostResponseCard";

export function Post () {

    const { id } = useParams();
    const [post, setPost] = useState([]);
    const [comment, setComment] = useState([]);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const { data: postData, error: postError } = await supabase
                    .from('Posts')
                    .select('*')
                    .eq('id', id)
                    .single();
                if (postError) {
                    throw postError;
                }
                setPost(postData);
            } catch (error) {
                console.error("Error fetching posts:", error.message);
            }  
        };

        const fetchComment = async () => {
            try {
                const { data: commentData, error: commentError } = await supabase
                    .from('Comments')
                    .select('*')
                    .eq('post_id', id);
                if (commentError) {
                    throw commentError;
                }
                setComment(commentData);
            } catch (error) {
                console.error("Error fetching posts:", error.message);
            }
        };

        fetchPost();
        fetchComment();
    }, [supabase, id]);

    useEffect(() => {
        document.title = `Project A | ${post.title}`;

        return () => {
            document.title = 'Project A';
        };
    }, [post.title]);

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
            const { data: postData, error: postError } = await supabase
                .from('Posts')
                .select('upvotes')
                .eq('id', id)
                .single();
            if (postError) {
                throw postError;
            }

            const updatedUpvotes = postData.upvotes + 1;

            const { data, error } = await supabase
                .from('Posts')
                .update({ upvotes: updatedUpvotes })
                .eq('id', id);
            if (error) {
                throw error;
            }

            setPost(prevState => ({ ...prevState, upvotes: updatedUpvotes }));
        } catch (error) {
            console.error("Error upvoting post:", error.message);
        }
    };

    const handleCommentUpdate = async () => {
        try {
            const { data: commentData, error: commentError } = await supabase
                .from('Comments')
                .select('*')
                .eq('post_id', id);
            if (commentError) {
                throw commentError;
            }
            setComment(commentData);
        } catch (error) {
            console.error("Error fetching posts:", error.message);
        }
    };

    return (
        <>
            <div id="post-page-header">
                <h1 id="post-page-title">{post.title}</h1>
                <p id="post-page-stats">
                    Posted by <span>{post.username} </span>
                    on <span>{formatDate(post.created_at)} </span> 
                    at <span>{formatTime(post.created_at)}</span> 
                </p>
            </div>
           
            <div id="post-page-contents">
                <div className="post-page-post">
                    <div className="post-page-response-stats">
                        <p className="vote-count">Upvotes: {post.upvotes}</p>
                        <p className="comment-count">Comments: {comment?.length}</p>
                    </div>
                    
                    <p className="post-page-content">{post.content}</p>

                    {post?.media && (
                        <div className="post-page-img-holder">
                            {post?.media === "file" && (
                                <img src={`data:image/png;base64,${post.file}`} alt="post card image" className="post-page-img" />
                            )}
                            {post?.media === "url" && (
                                <img src={post?.url} alt="post card image" className="post-page-img" />
                            )}                            
                        </div>
                    )}

                    {post?.updated_at != null && post.updated_at !== post.created_at && (
                        <p id="post-page-updated">Last Updated: {formatDate(post.updated_at)} at {formatTime(post.updated_at)}</p>
                    )}
                </div>

                <div className="post-comments">
                    {comment?.map(index => (
                        <div key={index.id} className="comment">
                            <h4 className="comment-user">{index.comment_username}</h4>
                            <p className="comment-content">{index.comment_content}</p>
                        </div>
                    ))}
                </div>

                <PostResponseCard postId={post.id} onUpdate={handleCommentUpdate} handleUpvote={handleUpvote} />
            </div>
            <div id="post-link-holder">
                <Link className="post-link" id="symptom-back-link" to={`/`}>Back</Link>
                <Link className="post-link" to={`/${id}/${post.title}/edit`}>Edit</Link>
            </div>
        </>
    )
};