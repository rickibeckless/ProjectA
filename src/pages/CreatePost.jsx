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
        <div id="create-post-form-holder">
            <form id="create-post-form" onSubmit={handleSubmit}>
                <div className="form-input-holder">
                    <label htmlFor="post-author">Username</label>
                    <input className="form-input-field" type="text" id="post-author" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username..." required />                    
                </div>

                <div className="form-input-holder">
                    <label htmlFor="post-title">Post Title</label>
                    <input className="form-input-field" type="text" id="post-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Post Title" required />                    
                </div>

                <div className="form-input-holder">
                    <label htmlFor="post-content">Post Content</label>
                    <textarea className="form-input-field" id="post-content" value={content} onChange={(e) => setContent(e.target.value)} placeholder="Post Content" required></textarea>                    
                </div>

                {!media && (
                    <div className="form-input-holder">
                        <select id="media-type" value={media} onChange={handleMediaChange}>
                            <option value="" disabled selected>Select Media Type</option>
                            <option value="file">File</option>
                            <option value="url">URL</option>
                        </select>
                    </div>                    
                )}

                {media === 'file' && (
                    <div className="form-input-holder">
                        <label htmlFor="post-media-image">Select Image File</label>
                        <input type="file" accept="image/*" id="post-media-image" className="form-input-field create-post-media-img" onChange={(e) => {
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
                    <div className="form-input-holder">
                        <label htmlFor="post-media-url">Enter Image URL</label>
                        <input type="url" id="post-media-url" className="form-input-field create-post-media-img" value={url} onChange={(e) => {
                            setUrl(e.target.value);
                            setImageUrl(e.target.value);
                        }} placeholder="Image URL" />
                    </div>
                )}

                {imageUrl && (
                    <div className="form-img-holder">
                        <img id="create-post-img" src={imageUrl} alt="Post Image" />
                        <button type="button" onClick={removeImage}>Remove Image</button>
                    </div>
                )}

                <div className="form-passcode-holder">
                    <p>One last thing so you can edit your post later...</p>
                    <div className="form-input-holder">
                        <label htmlFor="post-passcode">Create Passcode (4 digits)</label>
                        <input className="form-input-field" type="password" id="post-passcode" pattern="\d{4}" maxLength="4" value={passcode} onChange={(e) => setPasscode(e.target.value)} pattern="\d{4}" required />
                    </div>
                </div>

                <div className="create-post-btn-holder">
                    <button type="submit" id="create-post-btn">Create Post</button>
                </div>
            </form>
        </div>
    );
};
