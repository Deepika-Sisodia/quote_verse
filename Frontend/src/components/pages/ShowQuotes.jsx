import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Share2, Copy, ArrowLeft, Check } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '../../store/AuthContext';
import API_BASE_URL from '../../config/apiConfig';
import Quote from '../Quote/Quote';
import styles from './ShowQuotes.module.css';

const ShowQuotes = () => {
    const params = useParams();
    const navigate = useNavigate();
    const { user, favorites, toggleFavorite } = useAuth();
    const [quote, setQuote] = useState(null);
    const [relatedQuotes, setRelatedQuotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);

    async function fetchQuote() {
        try {
            const res = await axios.get(`${API_BASE_URL}/quotes/${params.id}`);
            setQuote(res.data);

            // Fetch related quotes by same author
            const allQuotesRes = await axios.get(`${API_BASE_URL}/allquotes`);
            const related = allQuotesRes.data.quotes
                .filter(q => q.author === res.data.author && q._id !== res.data._id)
                .slice(0, 3);
            setRelatedQuotes(related);
        } catch (err) {
            toast.error('Failed to load quote');
            navigate('/');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchQuote();
    }, [params.id]);

    const handleCopy = () => {
        if (quote) {
            navigator.clipboard.writeText(`"${quote.text}" — ${quote.author}`);
            setCopied(true);
            toast.success('Quote copied to clipboard!');
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleShare = () => {
        if (navigator.share && quote) {
            navigator.share({
                title: `Quote by ${quote.author}`,
                text: `"${quote.text}" — ${quote.author}`,
                url: window.location.href
            });
        } else {
            handleCopy();
        }
    };

    const handleFavorite = async () => {
        if (!user) {
            toast.error('Please login to favorite quotes');
            navigate('/login');
            return;
        }
        await toggleFavorite(quote._id);
    };

    const isFavorited = favorites.includes(quote?._id);

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.skeleton}></div>
            </div>
        );
    }

    if (!quote) return null;

    return (
        <motion.div
            className={styles.container}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <button onClick={() => navigate('/')} className={styles.backBtn}>
                <ArrowLeft size={20} />
                Back to Quotes
            </button>

            <motion.div
                className={styles.hero}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <span className={styles.category}>{quote.category || 'Wisdom'}</span>
                <h1 className={styles.quoteText}>"{quote.text}"</h1>
                <p className={styles.author}>— {quote.author}</p>

                <div className={styles.actions}>
                    <button
                        onClick={handleFavorite}
                        className={`${styles.actionBtn} ${isFavorited ? styles.favorited : ''}`}
                    >
                        <Heart size={20} fill={isFavorited ? 'currentColor' : 'none'} />
                        {isFavorited ? 'Favorited' : 'Favorite'}
                    </button>

                    <button onClick={handleShare} className={styles.actionBtn}>
                        <Share2 size={20} />
                        Share
                    </button>

                    <button onClick={handleCopy} className={styles.actionBtn}>
                        {copied ? <Check size={20} /> : <Copy size={20} />}
                        {copied ? 'Copied!' : 'Copy'}
                    </button>
                </div>
            </motion.div>

            {/* Author Section */}
            <motion.div
                className={styles.authorSection}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
            >
                <h2 className={styles.sectionTitle}>About {quote.author}</h2>
                <Link
                    to={`/author/${quote.author}`}
                    className={styles.authorLink}
                >
                    View all quotes by {quote.author} →
                </Link>
            </motion.div>

            {/* Related Quotes */}
            {relatedQuotes.length > 0 && (
                <motion.div
                    className={styles.relatedSection}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                >
                    <h2 className={styles.sectionTitle}>More from {quote.author}</h2>
                    <div className={styles.relatedGrid}>
                        {relatedQuotes.map(q => (
                            <Quote
                                key={q._id}
                                id={q._id}
                                author={q.author}
                                text={q.text}
                                category={q.category}
                                likes={q.likes || []}
                            />
                        ))}
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
};

export default ShowQuotes;