import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import styles from './Quote.module.css';

const QuoteSkeleton = () => {
    return (
        <div className={styles.quoteCard} style={{ cursor: 'default' }}>
            <div className={styles.header}>
                <Skeleton width={80} height={20} borderRadius={10} />
                <Skeleton circle width={30} height={30} />
            </div>
            <div style={{ marginBottom: '1rem' }}>
                <Skeleton count={2} height={25} />
            </div>
            <Skeleton width={120} height={20} />
            <div className={styles.footer} style={{ marginTop: '2rem' }}>
                <Skeleton width={60} height={30} borderRadius={50} />
                <Skeleton width={60} height={30} borderRadius={10} />
            </div>
        </div>
    );
};

export default QuoteSkeleton;
