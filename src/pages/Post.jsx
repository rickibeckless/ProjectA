import { Link, Routes, Route, useParams } from "react-router-dom";
import React, { useEffect, useState } from 'react';
import { supabase } from '../App';
import axios from 'axios';

export function Post () {

    const { id } = useParams();
    const [post, setPost] = useState([]);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const { data, error } = await supabase
                    .from('Posts')
                    .select('*')
                    .eq('id', id)
                    .single();
                if (error) {
                    throw error;
                }
                setPost(data);
            } catch (error) {
                console.error("Error fetching posts:", error.message);
            }  
        };

        fetchPost();
    }, [supabase, id]);

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

    return (
        <>
            <h1 className="page-title">Post Page</h1>
            <p className="page-summary" id="home-page-summary"></p>

            <div>
                <p>Posted by {post.username} on {formatDate(post.created_at)} at {formatTime(post.created_at)}</p>
                <h3>{post.title}</h3>
                <p>{post.content}</p>
                <p>Upvotes: {post.upvotes}</p>
                <button onClick={() => handleUpvote(post.id)}>Upvote</button>
            </div>
            <div className="post-edit-btns">
                <button className="edit-btn">Edit</button>
            </div>
            
        </>
    )
};