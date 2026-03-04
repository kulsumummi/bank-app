import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    ArrowDownCircle,
    ArrowUpCircle,
    Send,
    History,
    User,
    LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
    const { logout } = useAuth();

    const navItems = [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
        { name: 'Deposit', icon: ArrowDownCircle, path: '/deposit' },
        { name: 'Withdraw', icon: ArrowUpCircle, path: '/withdraw' },
        { name: 'Transfer', icon: Send, path: '/transfer' },
        { name: 'Transaction', icon: History, path: '/transactions' },
        { name: 'Profile', icon: User, path: '/profile' }
    ];

    return (
        <aside className="w-64 h-screen fixed left-0 top-0 bg-slate-900/30 backdrop-blur-xl border-r border-white/5 flex flex-col pt-8 z-40">
            <div className="px-6 mb-12">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                        <span className="text-white font-bold text-xl">B</span>
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-white tracking-tight">BankUs</h1>
                        <p className="text-[10px] text-blue-400 font-medium uppercase tracking-widest">Digital Banking</p>
                    </div>
                </div>
            </div>

            <nav className="flex-1 px-4 space-y-2">
                {navItems.map((item) => (
                    <NavLink
                        key={item.name}
                        to={item.path}
                        className={({ isActive }) => `
                            flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group
                            ${isActive
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                                : 'text-slate-400 hover:bg-white/5 hover:text-white'}
                        `}
                    >
                        <item.icon className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110`} />
                        <span className="font-medium">{item.name}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 mt-auto">
                <button
                    onClick={logout}
                    className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-red-400 hover:bg-red-500/10 transition-all duration-300 group"
                >
                    <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
