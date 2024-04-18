import { Link, Routes, Route, useParams } from "react-router-dom";
import React, { useEffect, useState } from 'react';
import { supabase } from '../App';
import axios from 'axios';

const PostResponseCard = () => {

    const [comment, setComment] = useState([]);

    useEffect(() => {
        const fetchComment = async () => {
            try {
                const { data, error } = await supabase
                    .from('Comments')
                    .select('*')
                if (error) {
                    throw error;
                }
                setComment(data);
            } catch (error) {
                console.error("Error fetching posts:", error.message);
            }  
        };

        fetchComment();
    }, [supabase]);

    const formatDate = (isoDate) => {
        const date = new Date(isoDate);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric',  });
    };

    const formatTime = (isoDate) => {
        const date = new Date(isoDate);
        return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    };

    return (
        <>
            <div className="post-response-card">
                <div className="post-votes">
                    <button className="upvote-btn">Upvote</button>
                    <p className="vote-count">0</p>
                    <button className="downvote-btn">Downvote</button>
                </div>
                <div className="post-comments">
                    <p className="comment-count">0 comments</p>
                    <div className="comment-holder">
                        <p className="comment-author">Author Name</p>
                        <p className="comment-text">This is a comment...</p>
                    </div>
                </div>
                <div className="post-new-comment">
                    <input type="text" id="new-comment-input" placeholder="Write a comment..." />
                    <button className="new-comment-btn">Post Comment</button>
                </div>
            </div>
        </>
    );
};

export default PostResponseCard;