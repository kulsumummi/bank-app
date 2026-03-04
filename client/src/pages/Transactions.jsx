import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
    History,
    Search,
    Filter,
    ArrowUpRight,
    TrendingUp,
    ArrowDownCircle,
    ArrowUpCircle,
    Download,
    Loader2,
    Calendar,
    Tag
} from 'lucide-react';
import axios from 'axios';

const Transactions = () => {
    const { user } = useAuth();
    const [transactions, setTransactions] = useState([]);
    const [filteredTransactions, setFilteredTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');

    const fetchTransactions = async () => {
        try {
            const res = await axios.get('/api/user/transactions');
            if (res.data.success) {
                setTransactions(res.data.transactions);
                setFilteredTransactions(res.data.transactions);
            }
        } catch (err) {
            console.error('Failed to fetch transactions', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    useEffect(() => {
        let result = transactions;

        if (filter !== 'All') {
            result = result.filter(tx => tx.type === filter);
        }

        if (searchTerm) {
            const search = searchTerm.toLowerCase();
            result = result.filter(tx =>
                (tx.sender?.name?.toLowerCase().includes(search)) ||
                (tx.receiver?.name?.toLowerCase().includes(search)) ||
                (tx.recipientIdentifier?.toLowerCase().includes(search)) ||
                (tx.amount?.toString().includes(search))
            );
        }

        setFilteredTransactions(result);
    }, [filter, searchTerm, transactions]);

    const filterOptions = ['All', 'Internal', 'External', 'Deposit', 'Withdraw'];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-white flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-600/10 rounded-2xl flex items-center justify-center border border-blue-500/20">
                            <History className="w-6 h-6 text-blue-500" />
                        </div>
                        Transaction Ledger
                    </h1>
                    <p className="text-slate-400 mt-2 font-medium">A comprehensive audit trail of your financial activities.</p>
                </div>
                <button className="bg-white/5 border border-white/10 text-white px-6 py-3 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-white/10 transition-all flex items-center gap-3">
                    <Download className="w-4 h-4" />
                    Archive History
                </button>
            </header>

            {/* Filter Bar */}
            <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 p-4 rounded-[2rem] shadow-2xl flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input
                        type="text"
                        placeholder="Search by recipient, identifier, amount..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-slate-950/50 border border-white/5 rounded-2xl py-4 pl-14 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 transition-all text-sm font-bold tracking-tight text-white shadow-inner"
                    />
                </div>
                <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto no-scrollbar pb-2 md:pb-0">
                    <div className="px-3 text-slate-500 uppercase text-[10px] font-black tracking-[0.2em] whitespace-nowrap">Filter By</div>
                    {filterOptions.map((opt) => (
                        <button
                            key={opt}
                            onClick={() => setFilter(opt)}
                            className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap
                                ${filter === opt
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40'
                                    : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-white/5'}
                            `}
                        >
                            {opt}
                        </button>
                    ))}
                </div>
            </div>

            <section className="bg-slate-900/40 backdrop-blur-xl rounded-[3rem] border border-white/5 overflow-hidden shadow-2xl relative">
                {/* Stats Header */}
                <div className="grid grid-cols-2 md:grid-cols-4 border-b border-white/5 bg-white/5">
                    <div className="p-6 border-r border-white/5">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Total Volume</p>
                        <p className="text-xl font-black text-white">₹{filteredTransactions.reduce((acc, tx) => acc + tx.amount, 0).toLocaleString()}</p>
                    </div>
                    <div className="p-6 border-r border-white/5">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Entries</p>
                        <p className="text-xl font-black text-white">{filteredTransactions.length}</p>
                    </div>
                    <div className="p-6 border-r border-white/5 hidden md:block">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Reporting Period</p>
                        <p className="text-xl font-black text-white">Last 30 Days</p>
                    </div>
                    <div className="p-6 hidden md:block">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Active Status</p>
                        <div className="flex items-center gap-2 mt-1">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                            <span className="text-xs font-black text-emerald-400 uppercase tracking-widest">Verified</span>
                        </div>
                    </div>
                </div>

                <div className="p-6 overflow-x-auto">
                    {loading ? (
                        <div className="py-24 flex justify-center items-center gap-4 text-blue-500">
                            <Loader2 className="w-8 h-8 animate-spin" />
                            <span className="font-black uppercase tracking-widest text-sm">Syncing Ledger...</span>
                        </div>
                    ) : filteredTransactions.length > 0 ? (
                        <table className="w-full text-left border-collapse min-w-[800px]">
                            <thead>
                                <tr className="border-b border-white/5">
                                    <th className="py-4 px-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Description</th>
                                    <th className="py-4 px-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Type</th>
                                    <th className="py-4 px-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Timestamp</th>
                                    <th className="py-4 px-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Identifier</th>
                                    <th className="py-4 px-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Magnitude</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 font-medium">
                                {filteredTransactions.map((tx) => {
                                    const isOutgoing = (tx.sender?._id === user?.id || tx.sender === user?.id) && tx.type !== 'Deposit';
                                    const isDeposit = tx.type === 'Deposit';
                                    const isWithdraw = tx.type === 'Withdraw';

                                    return (
                                        <tr key={tx._id} className="group hover:bg-white/[0.02] transition-colors">
                                            <td className="py-6 px-4">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-transform group-hover:scale-110
                                                        ${isDeposit ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                                                            isWithdraw ? 'bg-red-500/10 border-red-500/20 text-red-400' :
                                                                isOutgoing ? 'bg-slate-500/10 border-white/10 text-white' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'}
                                                    `}>
                                                        {isDeposit ? <ArrowDownCircle className="w-5 h-5" /> :
                                                            isWithdraw ? <ArrowUpCircle className="w-5 h-5" /> :
                                                                isOutgoing ? <ArrowUpRight className="w-5 h-5" /> : <TrendingUp className="w-5 h-5" />}
                                                    </div>
                                                    <div>
                                                        <p className="text-white font-black tracking-tight">
                                                            {tx.type === 'Deposit' ? 'Vault Funding' :
                                                                tx.type === 'Withdraw' ? 'Liquidity Withdrawal' :
                                                                    isOutgoing ? `Transfer to ${tx.receiver?.name || 'External'}` : `Receipt from ${tx.sender?.name || 'Sender'}`}
                                                        </p>
                                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">
                                                            {tx.type === 'Internal' ? 'BankUs Intranet' : 'Global Network'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-6 px-4">
                                                <span className={`text-[8px] font-black uppercase px-2 py-1 rounded-md tracking-widest border
                                                    ${tx.type === 'Internal' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                                        tx.type === 'External' ? 'bg-slate-500/10 text-slate-400 border-white/10' :
                                                            tx.type === 'Deposit' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                                'bg-red-500/10 text-red-400 border-red-500/20'}
                                                `}>
                                                    {tx.type}
                                                </span>
                                            </td>
                                            <td className="py-6 px-4">
                                                <div className="flex items-center gap-2 text-slate-400">
                                                    <Calendar className="w-3 h-3" />
                                                    <span className="text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">
                                                        {new Date(tx.timestamp).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="py-6 px-4">
                                                <div className="flex items-center gap-2 text-slate-500 max-w-[150px] truncate">
                                                    <Tag className="w-3 h-3 shrink-0" />
                                                    <span className="text-[10px] font-black tracking-widest truncate">{tx.recipientIdentifier}</span>
                                                </div>
                                            </td>
                                            <td className="py-6 px-4 text-right">
                                                <p className={`text-xl font-black tracking-tighter ${isDeposit || (!isOutgoing && !isWithdraw) ? 'text-emerald-400' : 'text-white'}`}>
                                                    {isDeposit || (!isOutgoing && !isWithdraw) ? '+' : '-'}₹{tx.amount?.toLocaleString()}
                                                </p>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    ) : (
                        <div className="py-32 text-center">
                            <div className="bg-white/5 w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-white/5 shadow-inner">
                                <History className="w-12 h-12 text-slate-700" />
                            </div>
                            <h4 className="text-slate-200 font-black text-2xl tracking-tight">No matching transactions found</h4>
                            <p className="text-slate-500 text-sm mt-3 max-w-xs mx-auto font-bold uppercase tracking-[0.2em]">Adjust your filters or initiate a new transfer.</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Transactions;
