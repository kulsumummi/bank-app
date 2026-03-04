import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [socket, setSocket] = useState(null);
    const [notification, setNotification] = useState(null);

    // Set axios defaults for cookies
    axios.defaults.withCredentials = true;

    // Initialize socket connection
    useEffect(() => {
        const newSocket = io('http://localhost:5000', {
            withCredentials: true,
            autoConnect: false
        });
        setSocket(newSocket);

        return () => newSocket.close();
    }, []);

    // Socket listeners
    useEffect(() => {
        if (socket && user) {
            socket.connect();
            socket.emit('join', user.id);

            socket.on('balanceUpdate', (newBalance) => {
                setUser(prev => ({ ...prev, balance: newBalance }));
            });

            socket.on('transferReceived', (data) => {
                setUser(prev => ({ ...prev, balance: data.newBalance }));
                setNotification(`✨ Received ₹${data.amount} from ${data.senderName}!`);
                setTimeout(() => setNotification(null), 5000);
            });

            return () => {
                socket.off('balanceUpdate');
                socket.off('transferReceived');
                socket.disconnect();
            };
        }
    }, [socket, user]);

    const checkUserStatus = async () => {
        try {
            const res = await axios.get('/api/auth/me');
            if (res.data.success) {
                setUser(res.data.user);
            }
        } catch (err) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkUserStatus();
    }, []);

    const login = async (email, password) => {
        setError(null);
        try {
            const res = await axios.post('/api/auth/login', { email, password });
            if (res.data.success) {
                setUser(res.data.user);
                return true;
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed');
            return false;
        }
    };

    const signup = async (name, email, password) => {
        setError(null);
        try {
            const res = await axios.post('/api/auth/signup', { name, email, password });
            if (res.data.success) {
                setUser(res.data.user);
                return true;
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Signup failed');
            return false;
        }
    };

    const logout = async () => {
        try {
            await axios.post('/api/auth/logout');
            setUser(null);
            if (socket) socket.disconnect();
        } catch (err) {
            console.error('Logout failed', err);
        }
    };

    const transfer = async (recipientIdentifier, amount) => {
        setError(null);
        try {
            const res = await axios.post('/api/user/transfer', { recipientIdentifier, amount: Number(amount) });
            if (res.data.success) {
                // The balance will also be updated via socket, but we update locally for immediate feedback
                setUser(prev => ({ ...prev, balance: res.data.newBalance }));
                return { success: true, message: res.data.message };
            }
        } catch (err) {
            const msg = err.response?.data?.error || 'Transfer failed';
            setError(msg);
            return { success: false, message: msg };
        }
    };

    const deposit = async (amount) => {
        setError(null);
        try {
            const res = await axios.post('/api/user/deposit', { amount: Number(amount) });
            if (res.data.success) {
                setUser(prev => ({ ...prev, balance: res.data.newBalance }));
                return { success: true, message: res.data.message };
            }
        } catch (err) {
            const msg = err.response?.data?.error || 'Deposit failed';
            setError(msg);
            return { success: false, message: msg };
        }
    };

    const withdraw = async (amount) => {
        setError(null);
        try {
            const res = await axios.post('/api/user/withdraw', { amount: Number(amount) });
            if (res.data.success) {
                setUser(prev => ({ ...prev, balance: res.data.newBalance }));
                return { success: true, message: res.data.message };
            }
        } catch (err) {
            const msg = err.response?.data?.error || 'Withdraw failed';
            setError(msg);
            return { success: false, message: msg };
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, error, notification, login, signup, logout, transfer, deposit, withdraw, checkUserStatus }}>
            {children}
            {notification && (
                <div className="fixed top-20 right-4 z-[100] animate-in slide-in-from-right-full duration-500">
                    <div className="bg-emerald-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-emerald-400/30 backdrop-blur-md">
                        <div className="bg-white/20 p-2 rounded-full">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <span className="font-bold tracking-tight">{notification}</span>
                    </div>
                </div>
            )}
        </AuthContext.Provider>
    );
};
