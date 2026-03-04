import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Loader2 } from 'lucide-react';

const Signup = () => {
    const [formData, setFormData] = useState({ customer_name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await register(formData.customer_name, formData.email, formData.password);
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 border border-slate-100">
                <div className="flex justify-center mb-8">
                    <div className="bg-blue-600 w-12 h-12 rounded-xl flex items-center justify-center">
                        <span className="text-white font-black text-2xl tracking-tighter">B</span>
                    </div>
                </div>

                <h1 className="text-2xl font-bold text-center text-slate-900 mb-2">Create Account</h1>
                <p className="text-slate-500 text-center mb-8">Join BankUs Secure Network</p>

                {error && (
                    <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm font-medium">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="text"
                                className="input-field pl-12"
                                placeholder="John Doe"
                                value={formData.customer_name}
                                onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="email"
                                className="input-field pl-12"
                                placeholder="name@domain.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="password"
                                className="input-field pl-12"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" disabled={loading} className="btn-primary w-full flex justify-center items-center gap-2">
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Register My Account'}
                    </button>
                </form>

                <p className="text-center mt-8 text-slate-500 text-sm font-medium">
                    Already have an account? <Link to="/login" className="text-blue-600 hover:text-blue-700 font-bold underline underline-offset-4">Log in here</Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;
