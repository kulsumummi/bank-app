import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Transfer from './pages/Transfer';
import Deposit from './pages/Deposit';
import Withdraw from './pages/Withdraw';
import Transactions from './pages/Transactions';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen bg-slate-950 text-white">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );

    if (!user) return <Navigate to="/login" />;

    return children;
};

function AppContent() {
    const { user } = useAuth();

    return (
        <div className={`min-h-screen ${user ? 'flex' : ''} text-slate-100 selection:bg-blue-500/30`}>
            {user && <Sidebar />}

            <main className={`flex-1 ${user ? 'ml-64 p-8' : ''}`}>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/dashboard" element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    } />
                    <Route path="/profile" element={
                        <ProtectedRoute>
                            <Profile />
                        </ProtectedRoute>
                    } />
                    <Route path="/transfer" element={
                        <ProtectedRoute>
                            <Transfer />
                        </ProtectedRoute>
                    } />
                    <Route path="/deposit" element={
                        <ProtectedRoute>
                            <Deposit />
                        </ProtectedRoute>
                    } />
                    <Route path="/withdraw" element={
                        <ProtectedRoute>
                            <Withdraw />
                        </ProtectedRoute>
                    } />
                    <Route path="/transactions" element={
                        <ProtectedRoute>
                            <Transactions />
                        </ProtectedRoute>
                    } />
                    <Route path="/" element={<Navigate to="/dashboard" />} />
                </Routes>
            </main>
        </div>
    );
}

function App() {
    return (
        <Router>
            <AuthProvider>
                <AppContent />
            </AuthProvider>
        </Router>
    );
}

export default App;
