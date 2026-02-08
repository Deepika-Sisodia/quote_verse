import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config/apiConfig';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            const storedUser = localStorage.getItem('user');
            if (storedUser) setUser(JSON.parse(storedUser));
            fetchFavorites();
        } else {
            delete axios.defaults.headers.common['Authorization'];
            setUser(null);
            setFavorites([]);
        }
        setLoading(false);
    }, [token]);

    const fetchFavorites = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/profile`);
            setFavorites(res.data.user.favorites.map(f => f._id));
        } catch (err) {
            console.error("Error fetching favorites", err);
        }
    }

    const login = async (email, password) => {
        const res = await axios.post(`${API_BASE_URL}/login`, { email, password });
        setToken(res.data.token);
        setUser(res.data.user);
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
    };

    const signup = async (username, name, email, password) => {
        const res = await axios.post(`${API_BASE_URL}/signup`, { username, name, email, password });
        setToken(res.data.token);
        setUser(res.data.user);
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
    };

    const toggleFavorite = async (id) => {
        if (!token) return;
        try {
            const res = await axios.post(`${API_BASE_URL}/quotes/${id}/favorite`);
            setFavorites(res.data.favorites);
            return true;
        } catch (err) {
            return false;
        }
    }

    const logout = () => {
        setToken(null);
        setUser(null);
        setFavorites([]);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ user, token, favorites, login, signup, logout, loading, toggleFavorite }}>
            {children}
        </AuthContext.Provider>
    );
};
