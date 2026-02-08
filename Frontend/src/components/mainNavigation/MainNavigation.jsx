import React from 'react'
import { NavLink, Link } from 'react-router-dom'
import styles from './MainNavigation.module.css'
import { useAuth } from '../../store/AuthContext'
import { Home, PlusSquare, User, LogOut, Quote as QuoteIcon } from 'lucide-react'

const MainNavigation = () => {
  const { user, logout } = useAuth();

  return (
    <nav className={styles.nav}>
      <Link to="/" className={styles.logo}>
        <QuoteIcon size={28} className={styles.logoIcon} />
        <h2>QuoteVerse</h2>
      </Link>
      <ul>
        <li>
          <NavLink to="/" className={({ isActive }) => isActive ? styles.active : ''}>
            <Home size={20} /> <span>All Quotes</span>
          </NavLink>
        </li>
        {user && (
          <li>
            <NavLink to="/new" className={({ isActive }) => isActive ? styles.active : ''}>
              <PlusSquare size={20} /> <span>New Quote</span>
            </NavLink>
          </li>
        )}

        {!user ? (
          <>
            <li>
              <NavLink to="/login" className={({ isActive }) => isActive ? styles.active : ''}>
                Login
              </NavLink>
            </li>
            <li>
              <NavLink to="/signup" className={({ isActive }) => isActive ? styles.active : ''}>
                Signup
              </NavLink>
            </li>
          </>
        ) : (
          <>
            <li>
              <NavLink to="/profile" className={({ isActive }) => isActive ? styles.active : ''}>
                <User size={20} /> <span>Profile</span>
              </NavLink>
            </li>
            <li className={styles.userDetails}>
              <span className={styles.username}>Hi, {user.name || user.username}</span>
            </li>
            <li>
              <button onClick={logout} className={styles.logoutBtn}>
                <LogOut size={18} /> <span>Logout</span>
              </button>
            </li>
          </>
        )}
      </ul>
    </nav>
  )
}

export default MainNavigation