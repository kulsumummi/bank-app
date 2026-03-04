import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Landmark, LogOut, User as UserIcon, Send } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <nav className="bg-slate-900/50 backdrop-blur-md sticky top-0 z-50 border-b border-slate-800">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link to="/" className="flex items-center space-x-2 group">
                    <div className="bg-blue-600 p-2 rounded-lg group-hover:bg-blue-500 transition-colors">
                        <Landmark className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                        BankUs
                    </span>
                </Link>

                {user ? (
                    <div className="flex items-center space-x-6">
                        <Link to="/dashboard" className="flex items-center space-x-1 text-slate-400 hover:text-white transition-colors">
                            <UserIcon className="w-4 h-4" />
                            <span>Dashboard</span>
                        </Link>
                        <Link to="/transfer" className="flex items-center space-x-1 text-slate-400 hover:text-white transition-colors">
                            <Send className="w-4 h-4" />
                            <span>Transfer</span>
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="flex items-center space-x-1 text-red-400 hover:text-red-300 transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            <span>Logout</span>
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center space-x-4">
                        <Link to="/login" className="text-slate-400 hover:text-white transition-colors">Login</Link>
                        <Link
                            to="/signup"
                            className="bg-blue-600 px-4 py-2 rounded-lg text-white font-medium hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/20 active:scale-95"
                        >
                            Get Started
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
