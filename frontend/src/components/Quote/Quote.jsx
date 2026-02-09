import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { Copy, Share2, Heart, Star, Link as LinkIcon, Trash2, Edit } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../store/AuthContext';
import styles from './Quote.module.css';
import API_BASE_URL from '../../config/apiConfig';

const Quote = (props) => {
  const { user, token, favorites, toggleFavorite } = useAuth();
  const navigate = useNavigate();

  // Ownership check - safely compare IDs
  const ownerId = props.owner ? (typeof props.owner === 'object' ? props.owner._id : props.owner) : null;
  const isOwner = user && ownerId && (String(user.id) === String(ownerId) || String(user._id) === String(ownerId));

  // Local state for optimistic updates
  const [likes, setLikes] = useState(props.likes.length);
  const [isLiked, setIsLiked] = useState(user ? props.likes.includes(user.id || user._id) : false);
  const [isFavorite, setIsFavorite] = useState(favorites.includes(props.id));

  // Helper to create auth headers
  const getAuthHeaders = () => ({
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  // Keep favorite state in sync with context
  useEffect(() => {
    setIsFavorite(favorites.includes(props.id));
  }, [favorites, props.id]);

  // Helper to format author name
  const formatAuthor = (name) => {
    if (!name) return "Unknown";
    return name
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  const copyToClipboard = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`"${props.text}" — ${props.author}`);
    toast.success("Quote copied to clipboard!");
  }

  const shareQuote = (e) => {
    e.stopPropagation();
    const text = encodeURIComponent(`"${props.text}" — ${props.author}`);
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
  }

  const copyLink = (e) => {
    e.stopPropagation();
    const url = `${window.location.origin}/quotes/${props.id}`;
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard!");
  }

  const likeHandler = async (e) => {
    e.stopPropagation();
    if (!user) {
      toast.info("Please login to like quotes");
      navigate('/login');
      return;
    }

    const prevIsLiked = isLiked;
    const prevLikes = likes;

    setIsLiked(!prevIsLiked);
    setLikes(prevIsLiked ? prevLikes - 1 : prevLikes + 1);

    try {
      const res = await axios.post(`${API_BASE_URL}/quotes/${props.id}/like`, {}, getAuthHeaders());
      setLikes(res.data.likesCount);
    } catch (err) {
      setIsLiked(prevIsLiked);
      setLikes(prevLikes);
      toast.error("Error liking quote");
    }
  }

  const favoriteHandler = async (e) => {
    e.stopPropagation();
    if (!user) {
      toast.info("Please login to favorite quotes");
      navigate('/login');
      return;
    }

    const prevIsFav = isFavorite;
    setIsFavorite(!prevIsFav);

    const success = await toggleFavorite(props.id);
    if (success) {
      toast.success(prevIsFav ? "Removed from favorites" : "Added to favorites");
    } else {
      setIsFavorite(prevIsFav);
      toast.error("Error updating favorites");
    }
  }

  return (
    <motion.li
      layout
      variants={props.variants}
      className={styles.quoteCard}
    >
      <div className={styles.header}>
        <span className={styles.category}>{props.category}</span>
        {isOwner && (
          <div className={styles.ownerActions}>
            <button
              className={`${styles.iconBtn} ${styles.editBtn}`}
              onClick={(e) => { e.stopPropagation(); props.onEdit && props.onEdit(props.id); }}
              title="Edit Quote"
            >
              <Edit size={16} />
            </button>
            <button
              className={`${styles.iconBtn} ${styles.deleteBtn}`}
              onClick={(e) => { e.stopPropagation(); props.onDelete && props.onDelete(props.id); }}
              title="Delete Quote"
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </div>

      <p className={styles.text}>"{props.text}"</p>

      <h3 className={styles.author}>
        — <Link to={`/author/${props.author}`} onClick={(e) => e.stopPropagation()}>{formatAuthor(props.author)}</Link>
      </h3>

      <div className={styles.footer}>
        <button
          className={`${styles.likeBtn} ${isLiked ? styles.liked : ''}`}
          onClick={likeHandler}
        >
          <Heart size={16} fill={isLiked ? "#e11d48" : "none"} /> {likes}
        </button>

        <div className={styles.actionsBar}>
          <button 
            className={styles.actionBtn}
            onClick={copyToClipboard} 
            title="Copy Text"
          >
            <Copy size={16} />
          </button>
          <button 
            className={styles.actionBtn}
            onClick={copyLink} 
            title="Copy Link"
          >
            <LinkIcon size={16} />
          </button>
          <button 
            className={styles.actionBtn}
            onClick={shareQuote} 
            title="Share on X"
          >
            <Share2 size={16} />
          </button>
          <button
            className={`${styles.actionBtn} ${styles.favBtn} ${isFavorite ? styles.favorited : ''}`}
            onClick={favoriteHandler}
            title={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Star size={16} fill={isFavorite ? "currentColor" : "none"} />
          </button>
        </div>

        <button
          className={styles.readMoreBtn}
          onClick={(e) => { e.stopPropagation(); navigate(`/quotes/${props.id}`); }}
        >
          Read More
        </button>
      </div>
    </motion.li>
  );
}

export default Quote;