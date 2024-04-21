import { Link, Routes, Route, useParams, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from 'react';
import { supabase } from '../App';
import axios from 'axios';

export function EditPost () {

    const { id } = useParams();
    const [post, setPost] = useState([]);
    const [PassCode, setPassCode] = useState(false);

    const navigate = useNavigate();

    const [editedTitle, setEditedTitle] = useState('');
    const [editedContent, setEditedContent] = useState('');
    const [editedMedia, setEditedMedia] = useState('');
    const [editedFile, setEditedFile] = useState(null);
    const [editedUrl, setEditedUrl] = useState('');

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

            if (!editedTitle) setEditedTitle(data?.title || '');
            if (!editedContent) setEditedContent(data?.content || '');
            if (!editedMedia) setEditedMedia(data?.media || '');
            if (!editedFile) setEditedFile(data?.file || null);
            if (!editedUrl) setEditedUrl(data?.url || '');
        } catch (error) {
            console.error("Error fetching posts:", error.message);
        }
    };

    useEffect(() => {
        fetchPost();
    }, [supabase, id]);

    useEffect(() => {
        document.title = `Project A | Edit ${post.title}`;

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

    const handlePassCode = (e) => {
        if (e.target.value === post.passcode) {
            setPassCode(true);
        } else {
            setPassCode(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const { data, error } = await supabase.from('Posts').update({
                title: editedTitle,
                content: editedContent,
                media: editedMedia,
                file: editedFile,
                url: editedUrl
            }).eq('id', id);

            if (error) {
                throw error;
            }

            await fetchPost();
            console.log("Post updated successfully");
            navigate(`/${post.id}/${encodeURIComponent(post.title)}`);
        } catch (error) {
            console.log("Error updating post:", error.message);
        }
    };

    const handleDelete = async () => {
        try {
            const { error } = await supabase.from('Posts').delete().eq('id', id);
            if (error) {
                throw error;
            }
            navigate('/');
        } catch (error) {
            console.error("Error deleting post:", error.message);
        }
    };

    return (
        <>
            <h1 className="page-title">Edit {post.title}</h1>
            <p className="page-summary" id="home-page-summary"></p>

            <div className="posts-holder">
                <p>Posted by {post.username} on {formatDate(post.created_at)} at {formatTime(post.created_at)}</p>
                
                <h3>{post.title}</h3>

                <p>{post.content}</p>

                {post?.media === "file" && (
                    <img src={`data:image/png;base64,${post.file}`} alt="post card image" className="post-img" />
                )}
                {post?.media === "url" && (
                    <img src={post?.url} alt="post card image" className="post-img" />
                )}
            </div>

            <label htmlFor="edit-passcode" id="edit-passcode-label">Enter passcode to edit post</label>
            <input type="password" id="edit-passcode" name="edit-passcode" pattern="\d{4}" maxLength="4" placeholder="Enter passcode" onChange={handlePassCode} />

            <form id="edit-post-form" className={`${PassCode ? '' : 'no-passcode'}`}>
                <label htmlFor="edit-title" id="edit-title-label">Title</label>
                <input type="text" id="edit-title" name="edit-title" onChange={(e) => setEditedTitle(e.target.value)} />

                <label htmlFor="edit-content" id="edit-content-label">Content</label>
                <textarea id="edit-content" name="edit-content" onChange={(e) => setEditedContent(e.target.value)}></textarea>

                <button type="submit" id="edit-post-button" onClick={handleUpdate}>Update Post</button>
                <button type="button" id="delete-post-button" onClick={handleDelete}>Delete Post</button>
            </form>
        </>
    )
};