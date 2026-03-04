import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, User as UserIcon, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    if (!user) return null;

    return (
        <nav className="border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-40">
            <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
                <div
                    className="flex items-center gap-3 cursor-pointer group"
                    onClick={() => navigate('/dashboard')}
                >
                    <div className="bg-blue-600 w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200 group-hover:rotate-6 transition-transform">
                        <Building2 className="text-white w-5 h-5" />
                    </div>
                    <span className="font-extrabold text-xl tracking-tighter text-slate-900">BankUs</span>
                </div>

                <div className="flex items-center gap-6">
                    <div className="hidden md:flex flex-col items-end">
                        <span className="text-xs font-bold text-slate-400 tracking-widest uppercase">Logged in as</span>
                        <span className="text-sm font-bold text-slate-900">{user.customer_name}</span>
                    </div>

                    <div className="w-px h-8 bg-slate-100 hidden md:block"></div>

                    <button
                        onClick={handleLogout}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-3 rounded-xl transition-all group"
                        title="Logout"
                    >
                        <LogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
