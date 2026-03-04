import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TrendingUp, RefreshCcw, Loader2 } from 'lucide-react';

const CurrencyRates = () => {
    const [rates, setRates] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchRates = async () => {
        setLoading(true);
        setError(null);
        try {
            // Fetching rates for INR against USD, EUR, GBP from Frankfurter API
            const response = await axios.get('https://api.frankfurter.app/latest?from=INR&to=USD,EUR,GBP');
            setRates(response.data.rates);
        } catch (err) {
            console.error('Failed to fetch exchange rates:', err);
            setError('Hardware connection to market lost.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRates();
    }, []);

    const formatRate = (rate) => {
        // Convert from 1 INR = X Currency to 1 Currency = X INR for better readability
        return (1 / rate).toFixed(2);
    };

    return (
        <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm font-medium">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-slate-900 font-bold flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                    Market Exchange (INR)
                </h3>
                <button
                    onClick={fetchRates}
                    disabled={loading}
                    className="p-2 hover:bg-slate-100 rounded-xl transition-all disabled:opacity-50"
                >
                    <RefreshCcw className={`w-4 h-4 text-slate-400 ${loading ? 'animate-spin' : ''}`} />
                </button>
            </div>

            {loading && !rates ? (
                <div className="flex justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-blue-100" />
                </div>
            ) : error ? (
                <p className="text-xs text-red-500 text-center py-4">{error}</p>
            ) : (
                <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 hover:bg-slate-50 rounded-2xl transition-all">
                        <div className="flex items-center gap-3">
                            <span className="text-xl">🇺🇸</span>
                            <span className="text-sm font-bold text-slate-700">USD/INR</span>
                        </div>
                        <span className="text-sm font-black text-slate-900 text-right">₹{formatRate(rates.USD)}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 hover:bg-slate-50 rounded-2xl transition-all">
                        <div className="flex items-center gap-3">
                            <span className="text-xl">🇪🇺</span>
                            <span className="text-sm font-bold text-slate-700">EUR/INR</span>
                        </div>
                        <span className="text-sm font-black text-slate-900 text-right">₹{formatRate(rates.EUR)}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 hover:bg-slate-50 rounded-2xl transition-all">
                        <div className="flex items-center gap-3">
                            <span className="text-xl">🇬🇧</span>
                            <span className="text-sm font-bold text-slate-700">GBP/INR</span>
                        </div>
                        <span className="text-sm font-black text-slate-900 text-right">₹{formatRate(rates.GBP)}</span>
                    </div>
                </div>
            )}

            <p className="mt-4 text-[10px] text-slate-400 text-center uppercase tracking-widest font-bold">
                Live Data via Frankfurter.app
            </p>
        </div>
    );
};

export default CurrencyRates;
