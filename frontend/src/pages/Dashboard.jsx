import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Wallet, Send, History, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import CurrencyRates from '../components/CurrencyRates';

const Dashboard = () => {
    const { user } = useAuth();
    const [balance, setBalance] = useState(null);
    const [balanceLoading, setBalanceLoading] = useState(false);

    const [transferData, setTransferData] = useState({ receiver_email: '', amount: '' });
    const [transferLoading, setTransferLoading] = useState(false);
    const [transferStatus, setTransferStatus] = useState({ type: null, message: '' });

    const fetchBalance = async () => {
        setBalanceLoading(true);
        try {
            const res = await axios.get('/api/balance');
            if (res.data.success) {
                setBalance(res.data.balance);
            }
        } catch (err) {
            console.error('Balance fetch failed', err);
        } finally {
            setBalanceLoading(false);
        }
    };

    const handleTransfer = async (e) => {
        e.preventDefault();
        setTransferLoading(true);
        setTransferStatus({ type: null, message: '' });

        try {
            const res = await axios.post('/api/transfer', {
                receiver_email: transferData.receiver_email,
                amount: parseFloat(transferData.amount)
            });

            if (res.data.success) {
                setTransferStatus({ type: 'success', message: res.data.message });
                setBalance(res.data.newBalance);
                setTransferData({ receiver_email: '', amount: '' });
            }
        } catch (err) {
            setTransferStatus({ type: 'error', message: err.response?.data?.message || 'Transfer failed' });
        } finally {
            setTransferLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto py-12 px-6">
            <div className="flex flex-col md:flex-row gap-8 items-start">

                {/* Left Sidebar: Balance & Market */}
                <div className="w-full md:w-1/3 space-y-6">
                    <div className="bg-blue-600 rounded-[2rem] p-8 text-white shadow-2xl shadow-blue-200">
                        <div className="flex justify-between items-start mb-12">
                            <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md">
                                <Wallet className="w-6 h-6" />
                            </div>
                            <span className="text-xs font-bold uppercase tracking-widest opacity-80">Primary Savings</span>
                        </div>
                        <p className="text-blue-100 text-sm font-medium mb-1">Total Available Balance</p>
                        <h2 className="text-4xl font-black tracking-tight flex items-center gap-3">
                            {balanceLoading ? <Loader2 className="w-8 h-8 animate-spin" /> : `₹${parseFloat(balance || user?.balance).toLocaleString()}`}
                        </h2>

                        <button
                            onClick={fetchBalance}
                            className="mt-8 w-full bg-white/10 hover:bg-white/20 border border-white/20 py-3 rounded-xl font-bold text-sm transition-all"
                        >
                            Refresh Balance
                        </button>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm font-medium">
                            <h3 className="text-slate-900 font-bold mb-4 flex items-center gap-2">
                                <History className="w-4 h-4 text-blue-600" />
                                Quick Status
                            </h3>
                            <div className="p-4 bg-slate-50 rounded-2xl">
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Account Holder</p>
                                <p className="text-sm font-black text-slate-900">{user?.customer_name}</p>
                            </div>
                        </div>

                        <CurrencyRates />
                    </div>
                </div>

                {/* Right Content: Transfer & History */}
                <div className="flex-1 w-full space-y-8">
                    <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-xl shadow-slate-100">
                        <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
                                <Send className="w-5 h-5 text-indigo-600" />
                            </div>
                            Instant Transfer
                        </h2>

                        {transferStatus.message && (
                            <div className={`flex items-center gap-3 p-4 rounded-2xl mb-8 border ${transferStatus.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-red-50 border-red-100 text-red-700'
                                }`}>
                                {transferStatus.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                                <span className="font-bold text-sm tracking-tight">{transferStatus.message}</span>
                            </div>
                        )}

                        <form onSubmit={handleTransfer} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Recipient Email</label>
                                <input
                                    type="email"
                                    className="input-field"
                                    placeholder="john@example.com"
                                    value={transferData.receiver_email}
                                    onChange={(e) => setTransferData({ ...transferData, receiver_email: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Amount (₹)</label>
                                <input
                                    type="number"
                                    className="input-field"
                                    placeholder="0.00"
                                    value={transferData.amount}
                                    onChange={(e) => setTransferData({ ...transferData, amount: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="md:col-span-2 pt-4">
                                <button type="submit" disabled={transferLoading} className="btn-primary w-full flex justify-center items-center gap-3 text-lg py-4">
                                    {transferLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                                        <>
                                            <Send className="w-5 h-5" />
                                            Confirm Transfer
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="p-8 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-[2rem] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-blue-100">
                        <div className="flex items-center gap-4">
                            <div className="bg-white/20 p-4 rounded-2xl">
                                <History className="w-8 h-8" />
                            </div>
                            <div>
                                <h4 className="text-xl font-bold">Transaction Ledger</h4>
                                <p className="text-blue-100 text-sm">Full history is currently being synchronized.</p>
                            </div>
                        </div>
                        <button className="bg-white text-blue-600 font-bold px-8 py-3 rounded-xl hover:bg-blue-50 transition-all whitespace-nowrap">
                            View Ledger
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Dashboard;
