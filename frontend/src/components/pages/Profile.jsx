import React, { useEffect, useState } from 'react';
import { useAuth } from '../../store/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../../config/apiConfig';
import Quote from '../Quote/Quote';
import ProfileSkeleton from '../UI/ProfileSkeleton';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { LogOut, LayoutGrid, Heart, Star, Calendar, TrendingUp } from 'lucide-react';
import styles from './Profile.module.css';

const Profile = () => {
    const { user, logout, token } = useAuth();
    const navigate = useNavigate();
    
    const [profileData, setProfileData] = useState(null);
    const [activeTab, setActiveTab] = useState('my-quotes');
    const [tabData, setTabData] = useState({
        'my-quotes': { quotes: [], loading: false, page: 1, hasMore: true, pagination: { total: 0, pages: 0 } },
        'favorites': { quotes: [], loading: false, page: 1, hasMore: true, pagination: { total: 0, pages: 0 } },
        'liked': { quotes: [], loading: false, page: 1, hasMore: true, pagination: { total: 0, pages: 0 } }
    });

    // Create axios config with token
    const getAuthHeaders = () => ({
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    // Fetch profile summary on mount
    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        if (!token) {
            console.warn('No token available');
            return;
        }
        fetchProfileData();
    }, [user, token, navigate]);

    // Fetch tab data when tab changes
    useEffect(() => {
        if (!tabData[activeTab].loading && tabData[activeTab].quotes.length === 0) {
            fetchTabData(activeTab, 1);
        }
    }, [activeTab]);

    const fetchProfileData = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/profile`, getAuthHeaders());
            setProfileData(res.data.user);
        } catch (err) {
            console.error('Failed to load profile:', err);
            toast.error('Failed to load profile');
        }
    };

    const fetchTabData = async (tab, pageNum) => {
        try {
            setTabData(prev => ({
                ...prev,
                [tab]: { ...prev[tab], loading: true }
            }));

            let endpoint = '';
            if (tab === 'my-quotes') endpoint = `${API_BASE_URL}/quotes/my`;
            else if (tab === 'favorites') endpoint = `${API_BASE_URL}/users/favorites`;
            else if (tab === 'liked') endpoint = `${API_BASE_URL}/users/liked`;

            const res = await axios.get(endpoint, { 
                params: { page: pageNum, limit: 10 },
                ...getAuthHeaders()
            });
            
            setTabData(prev => ({
                ...prev,
                [tab]: {
                    quotes: pageNum === 1 ? res.data.quotes : [...prev[tab].quotes, ...res.data.quotes],
                    loading: false,
                    page: pageNum,
                    hasMore: res.data.pagination.pages > pageNum,
                    pagination: res.data.pagination
                }
            }));
        } catch (err) {
            console.error(`Failed to load ${tab}:`, err);
            toast.error(`Failed to load ${tab.replace('-', ' ')}`);
            setTabData(prev => ({
                ...prev,
                [tab]: { ...prev[tab], loading: false }
            }));
        }
    };

    const handleLogout = () => {
        logout();
        toast.success('Logged out successfully');
        navigate('/');
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this quote?')) return;

        try {
            await axios.delete(`${API_BASE_URL}/quotes/${id}`, getAuthHeaders());
            toast.success('Quote deleted successfully');
            
            // Update all tabs
            setTabData(prev => {
                const newData = { ...prev };
                Object.keys(newData).forEach(tab => {
                    newData[tab].quotes = newData[tab].quotes.filter(q => q._id !== id);
                });
                return newData;
            });

            // Update profile stats
            if (profileData) {
                setProfileData(prev => ({
                    ...prev,
                    totalQuotes: prev.totalQuotes - 1
                }));
            }
        } catch (err) {
            toast.error('Failed to delete quote');
        }
    };

    const handleEdit = (id) => {
        const quote = tabData[activeTab].quotes.find(q => q._id === id);
        if (quote) {
            navigate('/new', { state: { quoteData: quote } });
        }
    };

    const handleLoadMore = () => {
        const nextPage = tabData[activeTab].page + 1;
        fetchTabData(activeTab, nextPage);
    };

    if (!profileData || !tabData) {
        return <ProfileSkeleton />;
    }

    const currentTabData = tabData[activeTab];
    const tabConfigs = [
        { id: 'my-quotes', label: 'My Quotes', icon: LayoutGrid, color: '#3B82F6' },
        { id: 'favorites', label: 'Favorites', icon: Star, color: '#F59E0B' },
        { id: 'liked', label: 'Liked', icon: Heart, color: '#EF4444' }
    ];

    const getStatFromTab = (tab) => {
        switch(tab) {
            case 'my-quotes': return profileData.totalQuotes;
            case 'favorites': return profileData.totalFavorites;
            case 'liked': return tabData['liked'].pagination ? tabData['liked'].pagination.total : 0;
            default: return 0;
        }
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.2 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
    };

    return (
        <motion.div
            className={styles.container}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            {/* Header */}
            <motion.div 
                className={styles.header}
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
            >
                <h1 className={styles.title}>My Profile</h1>
                <button onClick={handleLogout} className={styles.logoutBtn}>
                    <LogOut size={18} />
                    Logout
                </button>
            </motion.div>

            {/* User Card - Premium Glassmorphism */}
            <motion.div
                className={styles.userCard}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
            >
                <div className={styles.userCardContent}>
                    {/* Avatar */}
                    <motion.div
                        className={styles.avatar}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <span>{profileData.username.charAt(0).toUpperCase()}</span>
                    </motion.div>

                    {/* User Info */}
                    <div className={styles.userInfo}>
                        <div className={styles.nameSection}>
                            <h2 className={styles.userName}>{profileData.name}</h2>
                            <p className={styles.userHandle}>@{profileData.username}</p>
                        </div>
                        <div className={styles.metaInfo}>
                            <span className={styles.metaItem}>
                                <Calendar size={14} />
                                Joined {formatDate(profileData.createdAt)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className={styles.statsGrid}>
                    <motion.div
                        className={styles.statCard}
                        whileHover={{ y: -4 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                    >
                        <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)' }}>
                            <LayoutGrid size={20} />
                        </div>
                        <div className={styles.statContent}>
                            <p className={styles.statValue}>{profileData.totalQuotes}</p>
                            <p className={styles.statLabel}>Quotes Created</p>
                        </div>
                    </motion.div>

                    <motion.div
                        className={styles.statCard}
                        whileHover={{ y: -4 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                    >
                        <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, #EF4444, #DC2626)' }}>
                            <TrendingUp size={20} />
                        </div>
                        <div className={styles.statContent}>
                            <p className={styles.statValue}>{profileData.totalLikes}</p>
                            <p className={styles.statLabel}>Likes Received</p>
                        </div>
                    </motion.div>

                    <motion.div
                        className={styles.statCard}
                        whileHover={{ y: -4 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                    >
                        <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)' }}>
                            <Star size={20} />
                        </div>
                        <div className={styles.statContent}>
                            <p className={styles.statValue}>{profileData.totalFavorites}</p>
                            <p className={styles.statLabel}>Favorites</p>
                        </div>
                    </motion.div>
                </div>
            </motion.div>

            {/* Segmented Tabs Control */}
            <motion.div
                className={styles.tabsContainer}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
            >
                <div className={styles.tabsContent}>
                    {tabConfigs.map(tab => (
                        <motion.button
                            key={tab.id}
                            className={`${styles.tabBtn} ${activeTab === tab.id ? styles.active : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <tab.icon size={18} />
                            <span>{tab.label}</span>
                            <span className={styles.tabCount}>{getStatFromTab(tab.id)}</span>
                        </motion.button>
                    ))}
                </div>
                {activeTab === 'my-quotes' && (
                    <motion.button
                        className={styles.createBtn}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate('/new')}
                    >
                        + Create Quote
                    </motion.button>
                )}
            </motion.div>

            {/* Content Area */}
            <div className={styles.contentArea}>
                {currentTabData.loading && currentTabData.quotes.length === 0 ? (
                    // Loading skeleton
                    <div className={styles.grid}>
                        {[1, 2, 3, 4].map(i => (
                            <motion.div
                                key={i}
                                className={styles.skeletonCard}
                                animate={{
                                    background: ['rgba(255,255,255,0.05)', 'rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']
                                }}
                                transition={{ duration: 2, repeat: Infinity }}
                            />
                        ))}
                    </div>
                ) : currentTabData.quotes.length === 0 ? (
                    // Empty state
                    <motion.div
                        className={styles.emptyState}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        <div className={styles.emptyIcon}>
                            {activeTab === 'my-quotes' && <LayoutGrid size={48} />}
                            {activeTab === 'favorites' && <Star size={48} />}
                            {activeTab === 'liked' && <Heart size={48} />}
                        </div>
                        <h3 className={styles.emptyTitle}>
                            {activeTab === 'my-quotes' && "No quotes yet"}
                            {activeTab === 'favorites' && "No favorite quotes"}
                            {activeTab === 'liked' && "No liked quotes"}
                        </h3>
                        <p className={styles.emptyDescription}>
                            {activeTab === 'my-quotes' && "Start sharing your wisdom by creating your first quote!"}
                            {activeTab === 'favorites' && "Save your favorite quotes to access them later."}
                            {activeTab === 'liked' && "Like quotes to see them here."}
                        </p>
                        {activeTab === 'my-quotes' && (
                            <motion.button
                                className={styles.emptyAction}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate('/new')}
                            >
                                Create Your First Quote
                            </motion.button>
                        )}
                    </motion.div>
                ) : (
                    // Quotes Grid
                    <>
                        <motion.ul
                            className={styles.grid}
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            <AnimatePresence mode='popLayout'>
                                {currentTabData.quotes.map((quote) => (
                                    <motion.div
                                        key={quote._id}
                                        layout
                                        variants={itemVariants}
                                    >
                                        <Quote
                                            id={quote._id}
                                            author={quote.author}
                                            text={quote.text}
                                            category={quote.category}
                                            likes={quote.likes || []}
                                            owner={quote.owner}
                                            onDelete={activeTab === 'my-quotes' ? handleDelete : null}
                                            onEdit={activeTab === 'my-quotes' ? handleEdit : null}
                                        />
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </motion.ul>

                        {/* Load More Button */}
                        {currentTabData.hasMore && (
                            <motion.div
                                className={styles.loadMoreContainer}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                            >
                                <motion.button
                                    className={styles.loadMoreBtn}
                                    onClick={handleLoadMore}
                                    disabled={currentTabData.loading}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    {currentTabData.loading ? (
                                        <>
                                            <span className={styles.spinner} /> Loading...
                                        </>
                                    ) : (
                                        'Load More'
                                    )}
                                </motion.button>
                            </motion.div>
                        )}
                    </>
                )}
            </div>
        </motion.div>
    );
};

export default Profile;
