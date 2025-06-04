import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png'; // Pastikan path ini sesuai
import { postData } from '../api/service';

const HomeSelector = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            const user = await localStorage.getItem('accessTokens');
            if (!user) {
                navigate('/LoginScreen');
            }else{
                navigate('/HomeScreen')
            }
        };
        checkAuth();
    }, [navigate]);

    return (
        <div className="flex flex-col items-center justify-between min-h-screen bg-white">
            <div className="flex-1 flex items-center justify-center">
                <img src={logo} alt="Logo" className="w-40 h-40 object-contain" />
            </div>
        </div>
    );
};

export default HomeSelector;
