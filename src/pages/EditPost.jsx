import { Link, Routes, Route } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { supabase } from '../App';
import axios from 'axios';

export function EditPost () {

    return (
        <>
            <h1 className="page-title">Edit Post</h1>
            <p className="page-summary" id="home-page-summary"></p>

            <div className="posts-holder">
            </div>
        </>
    )
};