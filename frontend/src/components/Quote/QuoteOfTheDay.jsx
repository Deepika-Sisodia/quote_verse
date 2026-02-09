import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Copy, Share2, Heart, Quote as QuoteIcon } from 'lucide-react';
import { toast } from 'react-toastify';
import API_BASE_URL from '../../config/apiConfig';
import styles from './QuoteOfTheDay.module.css';

const QuoteOfTheDay = () => {
    const [quote, setQuote] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchQOD = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/quote-of-the-day`);
                setQuote(res.data);
            } catch (err) {
                console.error("Error fetching QOD:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchQOD();
    }, []);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(`"${quote.text}" — ${quote.author}`);
        toast.success("Quote copied to clipboard!");
    };

    const shareQuote = () => {
        const text = encodeURIComponent(`"${quote.text}" — ${quote.author}`);
        window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
    };

    if (loading || !quote) return null; // Or a skeleton

    return (
        <motion.div
            className={styles.container}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
        >
            <div className={styles.blob} style={{ top: '-100px', left: '-100px' }} />
            <div className={styles.blob} style={{ bottom: '-100px', right: '-100px' }} />

            <div className={styles.content}>
                <div className={styles.heading}>
                    <QuoteIcon size={16} style={{ display: 'inline', marginRight: '8px' }} />
                    Quote of the Day
                </div>

                <h1 className={styles.quote}>"{quote.text}"</h1>
                <p className={styles.author}>— {quote.author}</p>

                <div className={styles.actions}>
                    <button className={styles.actionBtn} onClick={copyToClipboard}>
                        <Copy size={18} /> Copy
                    </button>
                    <button className={styles.actionBtn} onClick={shareQuote}>
                        <Share2 size={18} /> Share
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default QuoteOfTheDay;
