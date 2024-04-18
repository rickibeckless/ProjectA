import { Link, Routes, Route } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { supabase } from '../App';
import axios from 'axios';
import PostCard from '../components/PostCard';
import PostResponseCard from '../components/PostResponseCard';

export function Post () {

    return (
        <>
            <h1 className="page-title">Post Page</h1>
            <p className="page-summary" id="home-page-summary"></p>


        </>
    )
};