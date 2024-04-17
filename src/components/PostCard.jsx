import { Link, Routes, Route, useParams } from "react-router-dom";
import React, { useEffect, useState } from 'react';
import { supabase } from '../App';
import axios from 'axios';

const PostCard = () => {


    return (
        <>
        
            <div className="post-card">
                <div className="post-card-heading">
                    <p className="post-author">Author Name</p>
                    <p className="date-posted">Mon. Day, Year</p>
                </div>
                <div className="post-content">
                    <h3 className="post-title">Post Title</h3>
                    <img src="" alt="post card image" className="post-img" />
                    <p className="post-text">This post is about...</p>
                </div>
                <div className="post-edit-btns">
                    <button className="edit-btn">Edit</button>
                    <button className="delete-btn">Delete</button>
                </div>
            </div>
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

export default PostCard;