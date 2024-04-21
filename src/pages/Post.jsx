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

    return (
        <>
            <h1 className="page-title">Post Page</h1>
            <p className="page-summary" id="home-page-summary"></p>

            <div>
                <p>Posted by {post.username} on {formatDate(post.created_at)} at {formatTime(post.created_at)}</p>
                <h3>{post.title}</h3>
                <p>{post.content}</p>
                {post?.media === "file" && (
                    <img src={`data:image/png;base64,${post.file}`} alt="post card image" className="post-img" />
                )}
                {post?.media === "url" && (
                    <img src={post?.url} alt="post card image" className="post-img" />
                )}
                <p>Upvotes: {post.upvotes}</p>
                <button onClick={() => handleUpvote(post.id)}>Upvote</button>
            </div>
            <div id="post-link-holder">
                <Link className="post-edit-link" id="symptom-back-link" to={`/`}>Back</Link>
                <Link className="post-edit-link" to={`/${id}/${post.title}/edit`}>Edit</Link>
            </div>
        </>
    )
};