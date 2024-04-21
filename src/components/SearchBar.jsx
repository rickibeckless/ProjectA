import React, { useState, useEffect } from 'react';
import { Link, Routes, Route, useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../App';
import axios from 'axios';

const SearchBar = () => {

    const { id } = useParams();
    let [searchInput, setSearchInput] = useState('');
    let [postResults, setPostResults] = useState([]);
    const navigate = useNavigate();
    const [searchPerformed, setSearchPerformed] = useState(false);

    useEffect(() => {
        if (!searchPerformed) return;

        const searchPost = async () => {
            try {
                if (searchInput && searchInput.length >= 1) {
                    let { data, error } = await supabase
                        .from('Posts')
                        .select('*')
                        .ilike('title', `%${searchInput}%`);
                    if (error) {
                        throw error;
                    }
                    
                    navigate('/', { state: { searchResults: data } });
                    setPostResults(data);
                } else {
                    let data = [];
                    navigate('/', { state: { searchResults: data } });
                    setPostResults([]);
                }
            } catch (error) {
                console.error("Error fetching posts:", error.message);
            }  
        };
    
        const debounceSearch = setTimeout(searchPost, 300);

        return () => clearTimeout(debounceSearch);
    }, [supabase, searchInput, id, searchPerformed]);

    const handleSearch = (e) => {
        setSearchInput(e.target.value);
        setSearchPerformed(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (postResults.length > 0) {
            const firstResultId = postResults[0].id;
            const firstResultTitle = postResults[0].title;
            navigate(`/${firstResultId}/${firstResultTitle}`);
        } else {
            console.log("No results found");
        }
    };

    return (
        <>

            <form id="search-form" onSubmit={handleSubmit}>
                <label htmlFor="search-input" id="search-label">Search for post</label>
                <input type="search" id="search-input" placeholder="Search for post..." onChange={handleSearch} />
                <button type="submit" id="search-button">Go</button>
            </form>

        </>
    );
};

export default SearchBar;