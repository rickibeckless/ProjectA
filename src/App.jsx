import { Link, Routes, Route } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import { Home } from './pages/Home';
import { NotFound } from './pages/NotFound';
import './App.css'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
export const supabase = createClient(supabaseUrl, supabaseKey);

function App() {

    return (
        <>
            <nav id="main-navbar">
                <ul>
                    <li><Link to="/" className="navbar-links">Home</Link></li>
                </ul>
            </nav>

            <div id="main-body">
                <Routes>
                    <Route path="/" element={<Home />} /> 
                    <Route path="*" element={<NotFound />} />
                </Routes>                
            </div>
        </>
    )
}

export default App
