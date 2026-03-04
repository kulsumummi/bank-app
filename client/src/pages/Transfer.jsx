import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Send, Mail, Loader2, CheckCircle2, AlertCircle, Search, UserCheck, Landmark } from 'lucide-react';
import axios from 'axios';

const Transfer = () => {
    const [recipientIdentifier, setRecipientIdentifier] = useState('');
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [searching, setSearching] = useState(false);
    const [recipientInfo, setRecipientInfo] = useState(null);
    const [success, setSuccess] = useState(null);
    const { transfer, error } = useAuth();

    // Debounced recipient search
    useEffect(() => {
        const search = async () => {
            if (recipientIdentifier.length < 3) {
                setRecipientInfo(null);
                setSearching(false);
                return;
            }

            setSearching(true);
            try {
                const res = await axios.get(`/api/user/search-recipient?identifier=${recipientIdentifier}`);
                if (res.data.success) {
                    setRecipientInfo(res.data.user);
                }
            } catch (err) {
                console.error('Search error', err);
            } finally {
                setSearching(false);
            }
        };

        const timer = setTimeout(search, 500);
        return () => clearTimeout(timer);
    }, [recipientIdentifier]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSuccess(null);

        const result = await transfer(recipientIdentifier, amount);

        if (result.success) {
            setSuccess(result.message);
            setRecipientIdentifier('');
            setAmount('');
            setRecipientInfo(null);
        }
        setLoading(false);
    };

    return (
        <div className="max-w-2xl mx-auto py-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Transfer Money</h1>
                <p className="text-slate-400 mt-2">Send money instantly using a Recipient's Email or Account Number.</p>
            </div>

            <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden">
                {/* Decor */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-600/5 rounded-full -ml-24 -mb-24 blur-3xl"></div>

                {success && (
                    <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-5 rounded-[1.5rem] mb-8 flex items-center gap-4 animate-bounce-subtle">
                        <CheckCircle2 className="shrink-0 w-6 h-6" />
                        <span className="font-bold tracking-tight text-lg">{success}</span>
                    </div>
                )}

                {error && (
                    <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-5 rounded-[1.5rem] mb-8 flex items-center gap-4">
                        <AlertCircle className="shrink-0 w-6 h-6" />
                        <span className="font-bold tracking-tight">{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                    <div className="space-y-3">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Recipient Identifier</label>
                        <div className="relative group">
                            <div className="absolute left-5 top-1/2 -translate-y-1/2 flex items-center gap-3">
                                <Mail className={`w-5 h-5 transition-colors ${recipientIdentifier ? 'text-blue-500' : 'text-slate-600'}`} />
                            </div>
                            <input
                                type="text"
                                value={recipientIdentifier}
                                onChange={(e) => setRecipientIdentifier(e.target.value)}
                                className="w-full bg-slate-950/50 border border-white/5 rounded-2xl py-5 pl-14 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 transition-all text-xl font-medium tracking-tight"
                                placeholder="Email or Account Number"
                                required
                            />
                            {searching && (
                                <div className="absolute right-5 top-1/2 -translate-y-1/2">
                                    <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                                </div>
                            )}
                        </div>

                        {/* Live Recipient Feedback Badge */}
                        <div className="min-h-[32px] animate-fade-in">
                            {recipientInfo ? (
                                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full">
                                    <UserCheck className="w-4 h-4 text-blue-400" />
                                    <span className="text-sm font-bold text-blue-300">Sending to: {recipientInfo.name}</span>
                                    <span className="text-[10px] bg-blue-500/20 px-2 py-0.5 rounded-md font-black uppercase text-blue-400 ml-1">Internal User</span>
                                </div>
                            ) : recipientIdentifier.length >= 8 && !searching ? (
                                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-slate-500/10 border border-white/10 rounded-full">
                                    <Landmark className="w-4 h-4 text-slate-400" />
                                    <span className="text-sm font-bold text-slate-300">External Global Transfer</span>
                                    <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-md font-black uppercase text-slate-400 ml-1">Interactive Gate</span>
                                </div>
                            ) : null}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Amount (₹)</label>
                        <div className="relative group">
                            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-2xl font-black text-slate-600 group-focus-within:text-emerald-500 transition-colors">₹</span>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full bg-slate-950/50 border border-white/5 rounded-2xl py-5 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 transition-all text-2xl font-black tracking-tight"
                                placeholder="0"
                                min="1"
                                step="1"
                                required
                            />
                        </div>
                        <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-slate-600 px-1">
                            <span>Transaction Fee: ₹0</span>
                            <span>Limit: ₹5,00,000</span>
                        </div>
                    </div>

                    <div className="pt-6">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-5 rounded-2xl font-black text-lg tracking-widest uppercase transition-all duration-500 flex items-center justify-center gap-4 relative overflow-hidden group
                                ${recipientInfo
                                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 shadow-xl shadow-blue-900/40 hover:scale-[1.02] active:scale-[0.98]'
                                    : 'bg-gradient-to-r from-slate-700 to-slate-800 shadow-xl shadow-black/40 hover:scale-[1.01] active:scale-[0.99]'}
                            `}
                        >
                            <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                            {loading ? (
                                <Loader2 className="animate-spin w-6 h-6" />
                            ) : (
                                <>
                                    <Send className="w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                    <span>Process Instant Transfer</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>

                <div className="mt-10 pt-8 border-t border-white/5 text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-3">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-lg shadow-emerald-500/50"></div>
                    Secured by BankUs Quantum-Link Protocol
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-blue-600/5 border border-blue-500/10 p-8 rounded-[2rem] hover:bg-blue-600/10 transition-colors">
                    <h4 className="font-bold text-blue-400 mb-3 flex items-center gap-2">
                        <Landmark className="w-5 h-5" />
                        External Ready
                    </h4>
                    <p className="text-sm text-slate-400 leading-relaxed font-medium">
                        Our interactive gateway automatically detects if an account is internal or external. External transfers are processed via our universal dummy clearing bridge.
                    </p>
                </div>
                <div className="bg-emerald-600/5 border border-emerald-500/10 p-8 rounded-[2rem] hover:bg-emerald-600/10 transition-colors">
                    <h4 className="font-bold text-emerald-400 mb-3 flex items-center gap-2">
                        <Landmark className="w-5 h-5" />
                        Zero Latency
                    </h4>
                    <p className="text-sm text-slate-400 leading-relaxed font-medium">
                        Transactions are broadcasted in real-time. Receivers get notified instantly within the BankUs network.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Transfer;
