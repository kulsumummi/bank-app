import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ArrowUpCircle, Loader2, CheckCircle2, AlertCircle, Landmark, CreditCard } from 'lucide-react';

const Withdraw = () => {
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(null);
    const { withdraw, error, user } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSuccess(null);

        const result = await withdraw(amount);

        if (result.success) {
            setSuccess(result.message);
            setAmount('');
        }
        setLoading(false);
    };

    return (
        <div className="max-w-2xl mx-auto py-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div>
                <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-4">
                    <div className="w-12 h-12 bg-red-600/10 rounded-2xl flex items-center justify-center border border-red-500/20">
                        <ArrowUpCircle className="w-6 h-6 text-red-500" />
                    </div>
                    Withdraw Liquidity
                </h1>
                <p className="text-slate-400 mt-2 font-medium">Extract funds to your external accounts or hardware wallets.</p>
            </div>

            <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-[3rem] p-12 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/10 rounded-full -mr-40 -mt-40 blur-3xl"></div>

                {success && (
                    <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-6 rounded-[2rem] mb-8 flex items-center gap-4 animate-bounce-subtle">
                        <CheckCircle2 className="shrink-0 w-6 h-6" />
                        <span className="font-black tracking-tight text-lg uppercase tracking-wider">{success}</span>
                    </div>
                )}

                {error && (
                    <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-6 rounded-[2rem] mb-8 flex items-center gap-4">
                        <AlertCircle className="shrink-0 w-6 h-6" />
                        <span className="font-black tracking-tight uppercase tracking-wider">{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-10 relative z-10">
                    <div className="space-y-4">
                        <div className="flex justify-between items-end px-2">
                            <label className="text-xs font-black text-slate-500 uppercase tracking-[0.3em]">Withdraw Amount (₹)</label>
                            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest whitespace-nowrap">Max: ₹{user?.balance?.toLocaleString()}</span>
                        </div>
                        <div className="relative group">
                            <span className="absolute left-8 top-1/2 -translate-y-1/2 text-4xl font-black text-slate-700 group-focus-within:text-red-500 transition-colors">₹</span>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full bg-slate-950/50 border-2 border-white/5 rounded-[2rem] py-8 pl-18 pr-8 focus:outline-none focus:border-red-500/50 transition-all text-5xl font-black tracking-tighter text-white shadow-inner"
                                placeholder="0"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-7 bg-gradient-to-r from-red-600 to-rose-700 rounded-[2rem] font-black text-lg tracking-[0.3em] uppercase text-white shadow-2xl shadow-red-900/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-4 group overflow-hidden relative"
                    >
                        <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                        {loading ? <Loader2 className="w-8 h-8 animate-spin" /> :
                            <>
                                <CreditCard className="w-6 h-6 group-hover:-rotate-12 transition-transform" />
                                Confirm Liquidity Extraction
                            </>}
                    </button>
                </form>

                <div className="mt-12 flex justify-center items-center gap-4 text-slate-500">
                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                        <div className="w-2/3 h-full bg-red-500/50 rounded-full animate-pulse"></div>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping"></div>
                        Secured Extraction Protocol
                    </span>
                </div>
            </div>

            <div className="bg-red-900/10 border border-red-500/10 p-8 rounded-[2.5rem]">
                <h4 className="font-black text-red-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Landmark className="w-5 h-5" />
                    Verified Destination Only
                </h4>
                <p className="text-sm text-slate-400 font-medium leading-relaxed">
                    Withdrawals are processed through the BankUs Quantum-Link. Ensure your external destination identifier is verified within your security console to avoid extraction delays.
                </p>
            </div>
        </div>
    );
};

export default Withdraw;
