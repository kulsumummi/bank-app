import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, Loader2, AlertCircle } from 'lucide-react';

const Signup = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const { signup, error } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const success = await signup(formData.name, formData.email, formData.password);
        if (success) {
            navigate('/dashboard');
        }
        setLoading(false);
    };

    return (
        <div className="flex justify-center items-center min-h-screen relative p-6">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-900/20 to-blue-600/10 pointer-events-none"></div>

            <div className="w-full max-w-md bg-slate-900/40 backdrop-blur-2xl p-10 rounded-[2.5rem] border border-white/10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50"></div>

                <div className="flex justify-center mb-8">
                    <div className="bg-blue-600 w-16 h-16 rounded-[1.25rem] flex items-center justify-center shadow-xl shadow-blue-500/20 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                        <span className="text-white font-bold text-3xl">B</span>
                    </div>
                </div>

                <h2 className="text-3xl font-bold text-center text-white mb-2 tracking-tight">Create Account</h2>
                <p className="text-slate-400 text-center mb-10 text-sm font-medium">Join the next generation of digital banking</p>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-2xl mb-8 flex items-center gap-3 animate-shake">
                        <AlertCircle className="shrink-0 w-5 h-5" />
                        <span className="text-sm font-medium">{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
                        <div className="relative group">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full bg-slate-950/50 border border-white/5 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all text-white placeholder:text-slate-600"
                                placeholder="John Doe"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full bg-slate-950/50 border border-white/5 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all text-white placeholder:text-slate-600"
                                placeholder="name@domain.com"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Access Key (Password)</label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                            <input
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="w-full bg-slate-950/50 border border-white/5 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all text-white placeholder:text-slate-600"
                                placeholder="••••••••••••"
                                minLength={6}
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl hover:bg-blue-500 transition-all shadow-xl shadow-blue-900/20 flex items-center justify-center gap-3 group disabled:opacity-70 active:scale-[0.98] mt-4"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : (
                            <>
                                <span>Initialize My Account</span>
                            </>
                        )}
                    </button>
                </form>

                <p className="text-center text-slate-500 mt-10 text-sm font-medium">
                    Already have an account?{' '}
                    <Link to="/login" className="text-blue-500 hover:text-blue-400 font-bold transition-colors">
                        Log in here
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;
