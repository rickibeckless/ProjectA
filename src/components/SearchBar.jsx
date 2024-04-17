import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SearchBar = () => {


    return (
        <>
        
            <form id="search-form" action="">
                <label htmlFor="search-input" id="search-label">Search for a post</label>
                <input type="search" id="search-input" placeholder="Search for a post..." />
                <button type="submit" id="search-button">Go</button>
            </form>

        </>
    );
};

export default SearchBar;