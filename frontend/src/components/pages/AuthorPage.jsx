import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../../config/apiConfig';
import Quote from '../Quote/Quote';
import QuoteSkeleton from '../Quote/QuoteSkeleton';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

const AuthorPage = () => {
    const { authorName } = useParams();
    const [quotes, setQuotes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAuthorQuotes();
    }, [authorName]);

    const fetchAuthorQuotes = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/allquotes`);
            const authorQuotes = res.data.quotes.filter(q => q.author === authorName);
            setQuotes(authorQuotes);
        } catch (err) {
            toast.error('Failed to load author quotes');
        } finally {
            setLoading(false);
        }
    };

    const formatAuthor = (name) => {
        if (!name) return "Unknown";
        return name
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    if (loading) {
        return (
            <div>
                <h1>Loading...</h1>
                {[1, 2, 3].map(i => <QuoteSkeleton key={i} />)}
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
        >
            <h1>Quotes by {formatAuthor(authorName)}</h1>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
                {quotes.length} {quotes.length === 1 ? 'quote' : 'quotes'} found
            </p>

            {quotes.length === 0 ? (
                <p style={{ color: 'var(--text-muted)' }}>No quotes found by this author.</p>
            ) : (
                <ul>
                    {quotes.map((quote) => (
                        <Quote
                            key={quote._id}
                            id={quote._id}
                            author={quote.author}
                            text={quote.text}
                            category={quote.category}
                            likes={quote.likes || []}
                        />
                    ))}
                </ul>
            )}
        </motion.div>
    );
};

export default AuthorPage;
