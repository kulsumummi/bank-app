import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, CreditCard, Hash, ShieldCheck, Calendar, IndianRupee } from 'lucide-react';

const Profile = () => {
    const { user } = useAuth();

    const infoItems = [
        { label: 'Full Name', value: user?.name, icon: User },
        { label: 'Email Address', value: user?.email, icon: Mail },
        { label: 'Account Number', value: user?.accountNumber || 'Pending...', icon: Hash },
        { label: 'IFSC Code', value: user?.ifscCode || 'SBIN0001234', icon: CreditCard },
        { label: 'Account Status', value: user?.accountStatus || 'Active', icon: ShieldCheck, isBadge: true },
        {
            label: 'Member Since',
            value: user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            }) : '20 February 2026',
            icon: Calendar
        }
    ];

    return (
        <div className="max-w-4xl mx-auto py-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-white">My Profile</h1>
            </div>

            <div className="grid md:grid-cols-12 gap-8">
                {/* Profile Header Card */}
                <div className="md:col-span-4 bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 flex flex-col items-center justify-center text-center space-y-4 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50"></div>

                    <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-xl shadow-blue-500/20 group-hover:scale-105 transition-transform duration-500">
                        <User className="w-12 h-12 text-white" />
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold text-white uppercase tracking-tight">{user?.name}</h2>
                        <p className="text-slate-400 text-sm">{user?.email}</p>
                    </div>

                    <div className="px-4 py-1 bg-blue-600/20 border border-blue-500/30 rounded-full">
                        <span className="text-blue-400 text-[10px] font-bold uppercase tracking-widest">USER</span>
                    </div>
                </div>

                {/* Account Info Card */}
                <div className="md:col-span-8 bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-10 shadow-2xl space-y-8 relative overflow-hidden">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-bold text-white">Account Information</h3>
                    </div>

                    <div className="grid gap-6">
                        {infoItems.map((item, index) => (
                            <div key={index} className="flex items-center justify-between group">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center group-hover:bg-blue-600/10 transition-colors duration-300">
                                        <item.icon className="w-5 h-5 text-slate-400 group-hover:text-blue-400 transition-colors" />
                                    </div>
                                    <span className="text-slate-400 font-medium">{item.label}</span>
                                </div>

                                {item.isBadge ? (
                                    <span className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider border border-emerald-500/30">
                                        {item.value}
                                    </span>
                                ) : (
                                    <span className="text-white font-bold tracking-tight">{item.value}</span>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="pt-8 border-t border-white/5 flex justify-between items-center">
                        <span className="text-slate-400 font-medium uppercase text-xs tracking-widest">Current Balance</span>
                        <div className="text-2xl font-bold text-white flex items-center gap-1">
                            <span className="text-blue-500 text-3xl">₹</span>
                            <span>{user?.balance?.toLocaleString('en-IN')}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
