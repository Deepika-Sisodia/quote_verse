import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import styles from './Breadcrumbs.module.css';

const Breadcrumbs = () => {
    const location = useLocation();
    const pathnames = location.pathname.split('/').filter((x) => x);

    if (pathnames.length === 0) return null;

    return (
        <nav className={styles.breadcrumbs}>
            <Link to="/" className={styles.homeLink}>
                <Home size={16} />
            </Link>
            {pathnames.map((value, index) => {
                const last = index === pathnames.length - 1;
                const to = `/${pathnames.slice(0, index + 1).join('/')}`;

                // Prettify common paths
                let displayName = value;
                if (value === 'new') displayName = 'New Quote';
                if (value === 'profile') displayName = 'My Profile';
                if (value === 'quotes') displayName = 'Details';
                if (value === 'author') displayName = 'Author';

                // Handle IDs (very simple check, can be improved)
                if (value.length > 20) displayName = 'Quote';

                return (
                    <React.Fragment key={to}>
                        <ChevronRight size={14} className={styles.separator} />
                        {last || value === 'quotes' ? (
                            <span className={styles.current}>{decodeURIComponent(displayName)}</span>
                        ) : (
                            <Link to={to} className={styles.link}>
                                {decodeURIComponent(displayName)}
                            </Link>
                        )}
                    </React.Fragment>
                );
            })}
        </nav>
    );
};

export default Breadcrumbs;
