import React, { useState, useEffect } from 'react';
import { Link, Routes, Route, useParams } from 'react-router-dom';
import { supabase } from '../App';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const SearchBar = () => {

    const { id } = useParams();
    let [searchInput, setSearchInput] = useState('');
    const navigate = useNavigate();

    useEffect(() => {        
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
                } else {
                    let data = [];
                    navigate('/', { state: { searchResults: data } });
                }
                console.log(data);
            } catch (error) {
                console.error("Error fetching posts:", error.message);
            }  
        };
    
        const debounceSearch = setTimeout(searchPost, 300);

        return () => clearTimeout(debounceSearch);
    }, [supabase, searchInput, id]);

    const handleSearch = (e) => {
        setSearchInput(e.target.value);
        console.log(searchInput);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(searchInput);
        navigate(`/${id}/${searchInput}`);
    };

    return (
        <>

            <form id="search-form" onSubmit={handleSubmit}>
                <label htmlFor="search-input" id="search-label">Search for a post</label>
                <input type="search" id="search-input" placeholder="Search for a post..." onChange={handleSearch} />
                <button type="submit" id="search-button">Go</button>
            </form>

        </>
    );
};

export default SearchBar;