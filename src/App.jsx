import { Link, Routes, Route } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import { Home } from './pages/Home';
import { CreatePost } from './pages/CreatePost';
import SearchBar from './components/SearchBar';
import { Post } from './pages/Post';
import { EditPost } from './pages/EditPost';
import { NotFound } from './pages/NotFound';
import './App.css'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
export const supabase = createClient(supabaseUrl, supabaseKey);

function App() {

    return (
        <>
            <nav id="main-navbar">
                <Link to="/" className="navbar-links" id="main-home-link">Project A</Link>
                <SearchBar />
                <Link to="/new" className="navbar-links">Create Post</Link>
            </nav>

            <div id="main-body">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/:id/*" element={<Post />} />
                    <Route path="/new" element={<CreatePost />} />
                    <Route path="/:id/edit" element={<EditPost />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>                
            </div>
        </>
    )
}

export default App
