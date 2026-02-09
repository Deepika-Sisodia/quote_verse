import React, { useRef, useState, useEffect } from 'react';
import styles from './NewQuote.module.css';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../store/AuthContext';
import API_BASE_URL from '../../config/apiConfig';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { Sparkles, User, Quote as QuoteIcon, Edit } from 'lucide-react';

const NewQuotes = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, token } = useAuth();

  const [author, setAuthor] = useState('');
  const [text, setText] = useState('');
  const [category, setCategory] = useState('Inspirational');
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [quoteId, setQuoteId] = useState(null);

  const categories = ['Inspirational', 'Life', 'Success', 'Funny', 'Wisdom', 'Other'];

  // Helper to create auth headers
  const getAuthHeaders = () => ({
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  useEffect(() => {
    if (location.state && location.state.quoteData) {
      const { _id, author, text, category } = location.state.quoteData;
      setAuthor(author);
      setText(text);
      setCategory(category);
      setQuoteId(_id);
      setIsEditMode(true);
    }
  }, [location.state]);

  const addQuoteHandler = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error('Please login to add quotes');
      navigate('/login');
      return;
    }

    if (!text.trim() || !author.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      if (isEditMode) {
        await axios.patch(`${API_BASE_URL}/quotes/${quoteId}`, { author, text, category }, getAuthHeaders());
        toast.success('Quote updated successfully! ✨');
      } else {
        await axios.post(`${API_BASE_URL}/addquotes`, { author, text, category }, getAuthHeaders());
        toast.success('Quote added successfully! 🎉');
      }

      setAuthor('');
      setText('');
      setCategory('Inspirational');
      setTimeout(() => navigate(isEditMode ? -1 : '/'), 1000); // Go back if editing
    } catch (err) {
      toast.error(err.response?.data?.msg || "Can't save quote at this moment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
    >
      <div className={styles.header}>
        {isEditMode ? <Edit className={styles.headerIcon} size={40} /> : <Sparkles className={styles.headerIcon} size={40} />}
        <h1 className={styles.title}>{isEditMode ? 'Edit Quote' : 'Share Your Wisdom'}</h1>
        <p className={styles.subtitle}>
          {isEditMode ? 'Refine your masterpiece' : 'Inspire others with a meaningful quote'}
        </p>
      </div>

      <div className={styles.formWrapper}>
        <form onSubmit={addQuoteHandler} className={styles.form}>
          {/* Author Input */}
          <div className={styles.inputGroup}>
            <label htmlFor='author' className={styles.label}>
              <User size={18} />
              Author Name
            </label>
            <input
              type="text"
              id='author'
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="e.g., Albert Einstein"
              className={styles.input}
              required
            />
          </div>

          {/* Quote Input */}
          <div className={styles.inputGroup}>
            <label htmlFor='quote' className={styles.label}>
              <QuoteIcon size={18} />
              Quote Text
            </label>
            <textarea
              id='quote'
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter the quote..."
              className={styles.textarea}
              rows={6}
              required
            />
            <div className={styles.charCount}>
              {text.length} characters
            </div>
          </div>

          {/* Category Selector */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>Category</label>
            <div className={styles.categoryGrid}>
              {categories.map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`${styles.categoryBtn} ${category === cat ? styles.active : ''}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={styles.submitBtn}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className={styles.spinner}></span>
                {isEditMode ? 'Updating...' : 'Adding...'}
              </>
            ) : (
              <>
                {isEditMode ? <Edit size={20} /> : <Sparkles size={20} />}
                {isEditMode ? 'Update Quote' : 'Add Quote'}
              </>
            )}
          </button>
        </form>

        {/* Preview Card */}
        {text && (
          <motion.div
            className={styles.preview}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <h3 className={styles.previewTitle}>Preview</h3>
            <div className={styles.previewCard}>
              <span className={styles.previewCategory}>{category}</span>
              <p className={styles.previewText}>"{text}"</p>
              <p className={styles.previewAuthor}>— {author || 'Author Name'}</p>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default NewQuotes;