import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import Quote from '../Quote/Quote';
import QuoteSkeleton from '../Quote/QuoteSkeleton';
import QuoteOfTheDay from '../Quote/QuoteOfTheDay';
import API_BASE_URL from '../../config/apiConfig';
import { useAuth } from '../../store/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, X, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import styles from './AllQuotes.module.css';

const AllQuotes = () => {
    const navigate = useNavigate();
    const { token } = useAuth();
    const [quotes, setQuotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const categories = ['All', 'Inspirational', 'Life', 'Success', 'Funny', 'Wisdom', 'Other'];
    const ITEMS_PER_PAGE = 12;

    // Helper to create auth headers
    const getAuthHeaders = () => ({
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    const fetchQuotes = useCallback(async (pageNum, isNewFilter = false) => {
        try {
            if (pageNum === 1) setLoading(true);
            else setLoadingMore(true);

            let url = `${API_BASE_URL}/allquotes?page=${pageNum}&limit=${ITEMS_PER_PAGE}`;

            if (searchTerm) {
                url += `&search=${encodeURIComponent(searchTerm)}`;
            }
            if (selectedCategory !== 'All') {
                url += `&category=${encodeURIComponent(selectedCategory)}`;
            }

            const res = await axios.get(url);
            // Backend returns { quotes: [...], pagination: {...} }
            const newQuotes = res.data.quotes || [];

            if (isNewFilter || pageNum === 1) {
                setQuotes(newQuotes);
            } else {
                setQuotes(prev => [...prev, ...newQuotes]);
            }

            setHasMore(newQuotes.length === ITEMS_PER_PAGE);

        } catch (err) {
            console.error("Error fetching quotes:", err);
            if (pageNum === 1) setQuotes([]);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, [searchTerm, selectedCategory]);

    // Reset and fetch when filters change
    useEffect(() => {
        setPage(1);
        setHasMore(true);
        const delayDebounceFn = setTimeout(() => {
            fetchQuotes(1, true);
        }, 500); // Debounce search

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, selectedCategory, fetchQuotes]);

    // Load more handler
    const loadMoreHandler = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchQuotes(nextPage, false);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this quote?")) return;
        try {
            await axios.delete(`${API_BASE_URL}/quotes/${id}`, getAuthHeaders());
            toast.success("Quote deleted");
            setQuotes(prev => prev.filter(q => q._id !== id));
            // Also refresh Quote of the Day if needed? 
            // Minimal impact.
        } catch (err) {
            toast.error("Failed to delete quote");
        }
    };

    const handleEdit = (id) => {
        const quote = quotes.find(q => q._id === id);
        if (quote) navigate('/new', { state: { quoteData: quote } });
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <motion.div
            className={styles.container}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <QuoteOfTheDay />

            <div className={styles.header}>
                <h2 className={styles.title}>All Quotes</h2>
                <p className={styles.subtitle}>Curated wisdom for every moment</p>
            </div>

            {/* Search & Filter Bar */}
            <div className={styles.controls}>
                <div className={styles.searchContainer}>
                    <Search className={styles.searchIcon} size={20} />
                    <input
                        type="text"
                        placeholder="Search quotes or authors..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={styles.searchInput}
                    />
                    {searchTerm && (
                        <button onClick={() => setSearchTerm('')} className={styles.clearBtn}>
                            <X size={18} />
                        </button>
                    )}
                </div>

                <div className={styles.filterContainer}>
                    <div className={styles.categories}>
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`${styles.categoryChip} ${selectedCategory === cat ? styles.active : ''}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Results */}
            {loading && page === 1 ? (
                <div className={styles.grid}>
                    {[1, 2, 3, 4, 5, 6].map(i => <QuoteSkeleton key={i} />)}
                </div>
            ) : quotes.length === 0 ? (
                <motion.div className={styles.emptyState}>
                    <div className={styles.emptyIcon}>🔍</div>
                    <h2>No quotes found</h2>
                    <p>Try adjusting your search or filters</p>
                </motion.div>
            ) : (
                <>
                    <motion.ul
                        className={styles.grid}
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <AnimatePresence mode='popLayout'>
                            {quotes.map((quote) => (
                                <motion.div
                                    key={quote._id}
                                    variants={itemVariants}
                                    layout
                                >
                                    <Quote
                                        id={quote._id}
                                        author={quote.author}
                                        text={quote.text}
                                        category={quote.category}
                                        likes={quote.likes || []}
                                        owner={quote.owner}
                                        variants={itemVariants}
                                        onDelete={handleDelete}
                                        onEdit={handleEdit}
                                    />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.ul>

                    {hasMore && (
                        <div className={styles.loadMoreContainer}>
                            <button
                                className={styles.loadMoreBtn}
                                onClick={loadMoreHandler}
                                disabled={loadingMore}
                            >
                                {loadingMore ? 'Loading...' : (
                                    <>Load More <ChevronDown size={18} /></>
                                )}
                            </button>
                        </div>
                    )}
                </>
            )}
        </motion.div>
    );
};

export default AllQuotes;