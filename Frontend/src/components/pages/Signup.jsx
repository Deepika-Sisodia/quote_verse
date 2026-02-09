import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../store/AuthContext';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { Mail, Lock, User, UserPlus, Eye, EyeOff, Sparkles } from 'lucide-react';
import styles from './Auth.module.css';

const Signup = () => {
    const [formData, setFormData] = useState({
        username: '',
        name: '',
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await signup(formData.username, formData.name, formData.email, formData.password);
            toast.success('Account created successfully! 🎉');
            navigate('/');
        } catch (err) {
            toast.error(err.response?.data?.msg || 'Failed to create account');
        } finally {
            setLoading(false);
        }
    };

    const passwordStrength = () => {
        const pwd = formData.password;
        if (pwd.length === 0) return { label: '', color: '' };
        if (pwd.length < 6) return { label: 'Weak', color: '#ef4444' };
        if (pwd.length < 10) return { label: 'Medium', color: '#f59e0b' };
        return { label: 'Strong', color: '#10b981' };
    };

    const strength = passwordStrength();

    return (
        <div className={styles.authContainer}>
            <motion.div
                className={styles.quoteSection}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
            >
                <Sparkles className={styles.sparkleIcon} size={48} />
                <h2 className={styles.quoteTitle}>Join Our Community</h2>
                <p className={styles.quoteText}>
                    "The future belongs to those who believe in the beauty of their dreams."
                </p>
                <p className={styles.quoteAuthor}>— Eleanor Roosevelt</p>
            </motion.div>

            <motion.div
                className={styles.formSection}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
            >
                <div className={styles.formWrapper}>
                    <h1 className={styles.formTitle}>Create Account</h1>
                    <p className={styles.formSubtitle}>
                        Start your journey of inspiration
                    </p>

                    <form onSubmit={handleSubmit} className={styles.form}>
                        <div className={styles.inputGroup}>
                            <label htmlFor="username" className={styles.label}>
                                <User size={18} />
                                Username
                            </label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="johndoe"
                                className={styles.input}
                                required
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label htmlFor="name" className={styles.label}>
                                <User size={18} />
                                Full Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="John Doe"
                                className={styles.input}
                                required
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label htmlFor="email" className={styles.label}>
                                <Mail size={18} />
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="your@email.com"
                                className={styles.input}
                                required
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label htmlFor="password" className={styles.label}>
                                <Lock size={18} />
                                Password
                            </label>
                            <div className={styles.passwordWrapper}>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className={styles.input}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className={styles.eyeBtn}
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            {formData.password && (
                                <div className={styles.strengthMeter}>
                                    <div
                                        className={styles.strengthBar}
                                        style={{
                                            width: `${(formData.password.length / 12) * 100}%`,
                                            backgroundColor: strength.color
                                        }}
                                    />
                                </div>
                            )}
                            {strength.label && (
                                <p className={styles.strengthLabel} style={{ color: strength.color }}>
                                    {strength.label}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            className={styles.submitBtn}
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className={styles.spinner}></span>
                                    Creating account...
                                </>
                            ) : (
                                <>
                                    <UserPlus size={20} />
                                    Create Account
                                </>
                            )}
                        </button>
                    </form>

                    <p className={styles.switchText}>
                        Already have an account?{' '}
                        <Link to="/login" className={styles.switchLink}>
                            Sign in
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Signup;
