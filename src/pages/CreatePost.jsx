import { useState } from 'react';
import { supabase } from '../App';
import { useNavigate } from "react-router-dom";

export function CreatePost() {
    
    const [username, setUsername] = useState('');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [media, setMedia] = useState('');
    const [file, setFile] = useState(null);
    const [url, setUrl] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [passcode, setPasscode] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let fileData = null;
            if (file) {
                fileData = await convertFileToBase64(file);
            }

            const { data, error } = await supabase.from('Posts').insert([{ 
                username, 
                title, 
                content, 
                media, 
                file: fileData, 
                url, 
                passcode 
            }]);

            if (error) {
                throw error;
            }
            setUsername('');
            setTitle('');
            setContent('');
            setMedia('');
            setFile(null);
            setUrl('');
            setImageUrl('');
            setPasscode('');
        } catch (error) {
            console.error("Error creating post:", error.message);
        }

        navigate('/');
    };

    const convertFileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                resolve(reader.result.split(',')[1]);
            };
            reader.onerror = (error) => {
                reject(error);
            };
        });
    };    

    const handleMediaChange = (e) => {
        if (media != "null") {
            removeImage();
        }
        setMedia(e.target.value);
    };

    const removeImage = () => {
        setFile(null);
        setUrl('');
        setImageUrl('');
        setMedia('');
    };

    return (
        <>
            <div>
                <h1 className="page-title">Post</h1>
                <p className="page-summary">This is where you'll create a new post</p>                
            </div>
            <div id="create-post-form-holder">
                <form id="create-post-form" onSubmit={handleSubmit}>
                    <label htmlFor="post-author">Username</label>
                    <input type="text" id="post-author" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username..." required />

                    <label htmlFor="post-title">Post Title</label>
                    <input type="text" id="post-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Post Title" required />

                    <label htmlFor="post-content">Post Content</label>
                    <textarea id="post-content" value={content} onChange={(e) => setContent(e.target.value)} placeholder="Post Content" required></textarea>

                    <div>
                        <select id="media-type" value={media} onChange={handleMediaChange}>
                            <option value="" disabled selected>Select Media Type</option>
                            <option value="file">File</option>
                            <option value="url">URL</option>
                        </select>
                    </div>

                    <div>
                        {media === 'file' && (
                            <div>
                                <label htmlFor="post-image">Post Image</label>
                                <input type="file" accept="image/*" id="post-image" className="post-img" onChange={(e) => {
                                    setFile(e.target.files[0]);
                                    const reader = new FileReader();
                                    reader.onload = () => {
                                        setImageUrl(reader.result);
                                    };
                                    reader.readAsDataURL(e.target.files[0]);
                                }} />
                            </div>
                        )}
                        {media === 'url' && (
                            <div>
                                <label htmlFor="post-url">Post URL</label>
                                <input type="url" id="post-url" className="post-img" value={url} onChange={(e) => {
                                    setUrl(e.target.value);
                                    setImageUrl(e.target.value);
                                }} placeholder="Image URL" />
                            </div>
                        )}

                        <button type="button" onClick={removeImage}>Remove Image</button>
                    </div>

                    {imageUrl && (
                        <img src={imageUrl} alt="Post Image" style={{ maxWidth: '300px', maxHeight: '300px' }} />
                    )}

                    <label htmlFor="post-passcode">Passcode (4 digits)</label>
                    <input type="password" id="post-passcode" value={passcode} onChange={(e) => setPasscode(e.target.value)} pattern="\d{4}" required />

                    <button type="submit" id="create-post-btn">Create Post</button>
                </form>                
            </div>
        </>
    );
};
