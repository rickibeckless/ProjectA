import { Link, Routes, Route } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { supabase } from '../App';
import axios from 'axios';
import PostCard from '../components/PostCard';

export function Home() {

    return (
        <>
            <h1 className="page-title">Project A</h1>
            <p className="page-summary" id="home-page-summary"></p>

            <div className="posts-holder">
                <PostCard />
            </div>
        </>
    )
};