import { Link, Routes, Route } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import { Home } from './pages/Home';
import { CreatePost } from './pages/CreatePost';
import SearchBar from './components/SearchBar';
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
                <Link to="/create-post" className="navbar-links">Create Post</Link>
            </nav>

            <div id="main-body">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/create-post" element={<CreatePost />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>                
            </div>
        </>
    )
}

export default App
