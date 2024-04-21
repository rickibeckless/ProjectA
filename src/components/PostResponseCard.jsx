import { Link, Routes, Route, useParams } from "react-router-dom";
import React, { useEffect, useState } from 'react';
import { supabase } from '../App';
import axios from 'axios';

const PostResponseCard = () => {

    const { id } = useParams();
    const [post, setPost] = useState([]);
    const [comment, setComment] = useState([]);
    const [comment_username, setCommentUsername] = useState('');
    const [comment_content, setCommentContent] = useState('');
    const [relation_id, setRelationId] = useState('');

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
                setRelationId(id);
            } catch (error) {
                console.error("Error fetching posts:", error.message);
            }  
        };

        fetchPost();

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
    }, [supabase, id]);

    const formatDate = (isoDate) => {
        const date = new Date(isoDate);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric',  });
    };

    const formatTime = (isoDate) => {
        const date = new Date(isoDate);
        return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data, error }= await supabase.from('Comments').insert([{
                comment_username,
                comment_content,
                post_id: relation_id
            }]);

            if (error) {
                throw error;
            }
            setCommentUsername('');
            setCommentContent('');
            console.log("Comment created successfully");
        } catch (error) {
            console.error("Error creating comment:", error.message);
        }
    };

    return (
        <>
            <div className="post-response-card">
                <div className="post-new-comment">
                    <form onSubmit={handleCommentSubmit}>
                        <input type="text" id="new-comment-username" placeholder="Username" value={comment_username} onChange={(e) => setCommentUsername(e.target.value)} />
                        <input type="text" id="new-comment-input" placeholder="Write a comment..." value={comment_content} onChange={(e) => setCommentContent(e.target.value)} />
                        <button className="new-comment-btn">Post Comment</button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default PostResponseCard;