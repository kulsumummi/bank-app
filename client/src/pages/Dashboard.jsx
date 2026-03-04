import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Wallet, TrendingUp, ArrowUpRight, History, Loader2 } from 'lucide-react';
import axios from 'axios';

const Dashboard = () => {
    const { user, checkUserStatus } = useAuth();
    const [transactions, setTransactions] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    const fetchTransactions = async () => {
        try {
            const res = await axios.get('/api/user/transactions');
            if (res.data.success) {
                setTransactions(res.data.transactions);
            }
        } catch (err) {
            console.error('Failed to fetch transactions', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkUserStatus();
        fetchTransactions();
    }, []);

    const stats = [
        { label: 'Weekly Income', value: '₹2,450', icon: TrendingUp, color: 'text-emerald-500' },
        { label: 'Weekly Spent', value: '₹840', icon: ArrowUpRight, color: 'text-red-500' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight text-white">Welcome, {user?.name}</h1>
                    <p className="text-slate-400 mt-2">Here's what's happening with your account today.</p>
                </div>
                <div className="px-6 py-2 bg-slate-900/50 backdrop-blur-md rounded-full border border-white/5 shadow-inner">
                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-500">Premium Account</span>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Balance Card */}
                <div className="md:col-span-2 relative overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-700 p-10 rounded-[3rem] shadow-2xl shadow-blue-900/40 group">
                    <div className="relative z-10 flex flex-col justify-between h-full min-h-[220px]">
                        <div className="flex justify-between items-start">
                            <div className="space-y-1">
                                <p className="text-blue-100/70 font-bold uppercase text-[10px] tracking-widest">Available Balance</p>
                                <h2 className="text-6xl font-black text-white tracking-tighter">
                                    ₹{user?.balance?.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                                </h2>
                            </div>
                            <div className="bg-white/10 p-5 rounded-3xl backdrop-blur-md border border-white/20 group-hover:scale-110 transition-transform duration-500">
                                <Wallet className="w-8 h-8 text-white" />
                            </div>
                        </div>

                        <div className="flex items-center gap-4 mt-12">
                            <button className="bg-white text-blue-700 px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-slate-50 transition-all shadow-xl active:scale-95">
                                Add Funds
                            </button>
                            <button className="bg-white/10 text-white border border-white/20 px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-white/20 transition-all backdrop-blur-md active:scale-95">
                                Analyze Flow
                            </button>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    {stats.map((stat, idx) => (
                        <div key={idx} className="bg-slate-900/40 backdrop-blur-xl p-6 rounded-[2rem] border border-white/5 flex items-center gap-5 group hover:border-white/10 transition-all duration-300 shadow-xl">
                            <div className={`${stat.color} bg-white/5 p-4 rounded-2xl group-hover:scale-110 transition-transform duration-500`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <div className="space-y-0.5">
                                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{stat.label}</p>
                                <p className="text-3xl font-black text-white tracking-tight">{stat.value}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <section className="bg-slate-900/40 backdrop-blur-xl rounded-[3rem] border border-white/5 overflow-hidden shadow-2xl">
                <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/5">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/20">
                            <History className="w-5 h-5 text-blue-400" />
                        </div>
                        <h3 className="text-2xl font-black text-white tracking-tight">Financial Timeline</h3>
                    </div>
                    <button className="text-[10px] text-blue-400 hover:text-blue-300 font-black uppercase tracking-widest px-6 py-2.5 bg-white/5 rounded-xl border border-white/5 transition-all">Export Records</button>
                </div>

                <div className="p-4">
                    {loading ? (
                        <div className="py-20 flex justify-center">
                            <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                        </div>
                    ) : transactions.length > 0 ? (
                        <div className="space-y-2">
                            {transactions.map((tx) => {
                                const isOutgoing = tx.sender?._id === user?.id || tx.sender === user?.id;
                                return (
                                    <div key={tx._id} className="group flex items-center justify-between p-6 rounded-[1.5rem] hover:bg-white/5 transition-all duration-300 border border-transparent hover:border-white/5">
                                        <div className="flex items-center gap-5">
                                            <div className={`p-4 rounded-2xl ${isOutgoing ? 'bg-red-500/10 text-red-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                                                {isOutgoing ? <ArrowUpRight className="w-6 h-6" /> : <TrendingUp className="w-6 h-6" />}
                                            </div>
                                            <div>
                                                <p className="text-white font-black tracking-tight text-lg">
                                                    {isOutgoing
                                                        ? `Sent to ${tx.receiver?.name || tx.recipientIdentifier}`
                                                        : `Received from ${tx.sender?.name || 'External Account'}`}
                                                </p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">
                                                        {new Date(tx.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                    </p>
                                                    <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded ${tx.type === 'Internal' ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-500/20 text-slate-400'}`}>
                                                        {tx.type}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={`text-2xl font-black tracking-tighter ${isOutgoing ? 'text-white' : 'text-emerald-400'}`}>
                                            {isOutgoing ? '-' : '+'}₹{tx.amount?.toLocaleString('en-IN')}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="py-24 text-center">
                            <div className="bg-white/5 w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-white/5 shadow-inner">
                                <History className="w-12 h-12 text-slate-700" />
                            </div>
                            <h4 className="text-slate-300 font-black text-xl">No data detected</h4>
                            <p className="text-slate-500 text-sm mt-3 max-w-xs mx-auto font-bold uppercase tracking-widest leading-relaxed">Your historical transactions will materialize here.</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Dashboard;
