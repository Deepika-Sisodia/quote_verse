import React, { Fragment } from 'react'
import MainNavigation from './components/mainNavigation/MainNavigation'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './store/AuthContext'

import AllQuotes from './components/pages/AllQuotes'
import NewQuotes from './components/pages/NewQuotes'
import ShowQuotes from './components/pages/ShowQuotes'
import Login from './components/pages/Login'
import Signup from './components/pages/Signup'
import Profile from './components/pages/Profile'
import AuthorPage from './components/pages/AuthorPage'

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion, AnimatePresence } from 'framer-motion';

const App = () => {
  return (
    <AuthProvider>
      <MainNavigation />
      <ToastContainer position="top-right" autoClose={3000} theme="light" />
      <main style={{ padding: '2rem' }}>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path='/' element={<AllQuotes />} />
            <Route path='/new' element={<NewQuotes />} />
            <Route path='/quotes/:id' element={<ShowQuotes />} />
            <Route path='/login' element={<Login />} />
            <Route path='/signup' element={<Signup />} />
            <Route path='/profile' element={<Profile />} />
            <Route path='/author/:authorName' element={<AuthorPage />} />
          </Routes>
        </AnimatePresence>
      </main>
    </AuthProvider>
  )
}

export default App