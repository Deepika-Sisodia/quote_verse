import React from 'react';
import { motion } from 'framer-motion';
import styles from '../../components/pages/Profile.module.css';

const ProfileSkeleton = () => {
    const shimmer = {
        initial: { backgroundPosition: '200% center' },
        animate: { backgroundPosition: '0% center' }
    };

    return (
        <motion.div className={styles.container}>
            {/* Header Skeleton */}
            <div className={styles.header}>
                <div className={styles.headerTitle} style={{
                    height: '32px',
                    width: '200px',
                    background: 'linear-gradient(90deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.1) 100%)',
                    backgroundSize: '200% 100%',
                    borderRadius: '8px'
                }} />
            </div>

            {/* User Card Skeleton */}
            <motion.div className={styles.userCard} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                <motion.div
                    className={styles.avatar}
                    variants={shimmer}
                    initial="initial"
                    animate="animate"
                    transition={{ duration: 2, repeat: Infinity }}
                    style={{
                        background: 'linear-gradient(90deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.1) 100%)',
                        backgroundSize: '200% 100%'
                    }}
                />
                <div className={styles.userInfo}>
                    <motion.div
                        style={{
                            height: '24px',
                            width: '160px',
                            background: 'linear-gradient(90deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.1) 100%)',
                            backgroundSize: '200% 100%',
                            borderRadius: '8px',
                            marginBottom: '8px'
                        }}
                        variants={shimmer}
                        initial="initial"
                        animate="animate"
                        transition={{ duration: 2, repeat: Infinity }}
                    />
                    <motion.div
                        style={{
                            height: '16px',
                            width: '120px',
                            background: 'linear-gradient(90deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.1) 100%)',
                            backgroundSize: '200% 100%',
                            borderRadius: '8px',
                            marginBottom: '16px'
                        }}
                        variants={shimmer}
                        initial="initial"
                        animate="animate"
                        transition={{ duration: 2, repeat: Infinity }}
                    />
                    <div className={styles.statsGrid}>
                        {[1, 2, 3].map(i => (
                            <motion.div
                                key={i}
                                className={styles.statItem}
                                style={{
                                    background: 'rgba(255,255,255,0.05)',
                                    borderRadius: '12px',
                                    padding: '12px'
                                }}
                            >
                                <motion.div
                                    style={{
                                        height: '28px',
                                        background: 'linear-gradient(90deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.1) 100%)',
                                        backgroundSize: '200% 100%',
                                        borderRadius: '6px',
                                        marginBottom: '8px'
                                    }}
                                    variants={shimmer}
                                    initial="initial"
                                    animate="animate"
                                    transition={{ duration: 2, repeat: Infinity }}
                                />
                                <motion.div
                                    style={{
                                        height: '12px',
                                        background: 'linear-gradient(90deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.1) 100%)',
                                        backgroundSize: '200% 100%',
                                        borderRadius: '6px'
                                    }}
                                    variants={shimmer}
                                    initial="initial"
                                    animate="animate"
                                    transition={{ duration: 2, repeat: Infinity }}
                                />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* Tabs Skeleton */}
            <div className={styles.tabsContainer}>
                {[1, 2, 3].map(i => (
                    <motion.div
                        key={i}
                        style={{
                            height: '40px',
                            width: '150px',
                            background: 'linear-gradient(90deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.1) 100%)',
                            backgroundSize: '200% 100%',
                            borderRadius: '8px'
                        }}
                        variants={shimmer}
                        initial="initial"
                        animate="animate"
                        transition={{ duration: 2, repeat: Infinity }}
                    />
                ))}
            </div>

            {/* Quotes Grid Skeleton */}
            <motion.div className={styles.grid}>
                {[1, 2, 3, 4, 5, 6].map(i => (
                    <motion.div
                        key={i}
                        className={styles.quoteCard}
                        style={{
                            background: 'rgba(255,255,255,0.05)',
                            padding: '20px',
                            borderRadius: '16px'
                        }}
                    >
                        <motion.div
                            style={{
                                height: '20px',
                                background: 'linear-gradient(90deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.1) 100%)',
                                backgroundSize: '200% 100%',
                                borderRadius: '6px',
                                marginBottom: '12px'
                            }}
                            variants={shimmer}
                            initial="initial"
                            animate="animate"
                            transition={{ duration: 2, repeat: Infinity }}
                        />
                        <motion.div
                            style={{
                                height: '60px',
                                background: 'linear-gradient(90deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.1) 100%)',
                                backgroundSize: '200% 100%',
                                borderRadius: '6px',
                                marginBottom: '12px'
                            }}
                            variants={shimmer}
                            initial="initial"
                            animate="animate"
                            transition={{ duration: 2, repeat: Infinity }}
                        />
                        <motion.div
                            style={{
                                height: '16px',
                                background: 'linear-gradient(90deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.1) 100%)',
                                backgroundSize: '200% 100%',
                                borderRadius: '6px'
                            }}
                            variants={shimmer}
                            initial="initial"
                            animate="animate"
                            transition={{ duration: 2, repeat: Infinity }}
                        />
                    </motion.div>
                ))}
            </motion.div>
        </motion.div>
    );
};

export default ProfileSkeleton;
