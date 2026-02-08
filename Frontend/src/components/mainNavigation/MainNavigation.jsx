import React from 'react'
import {Link} from 'react-router-dom'
import styles from './MainNavigation.module.css'

const MainNavigation = () => {
  return (
    <div>
        <nav className={styles.nav} >
            <h2>Quotes App</h2>
            <ul>
                <li> <Link to="/">All Quotes</Link></li>
                <li> <Link to="/new">New Quotes</Link></li>
            </ul>
        </nav>
    </div>
  )
}

export default MainNavigation