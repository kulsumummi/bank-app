import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Bot, Sparkles, User as UserIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ChatBot = () => {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'bot', text: `Hi ${user?.customer_name || 'there'}! I'm your BankUs smart assistant. How can I help with your account today?` }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const getBotResponse = (query) => {
        const q = query.toLowerCase();
        if (q.includes('balance')) return `Your current balance is ₹${user?.balance?.toLocaleString() || '10,000'}. Re-syncing with the vault now...`;
        if (q.includes('transfer') || q.includes('send')) return "To transfer money, just enter the recipient's email and the amount in the 'Instant Transfer' form on your dashboard. It's atomic and secure!";
        if (q.includes('rate') || q.includes('usd') || q.includes('eur')) return "Check the 'Market Exchange' card on your dashboard for live INR conversion rates. We use Frankfurter API for accuracy!";
        if (q.includes('hello') || q.includes('hi')) return `Hello ${user?.customer_name}! Hope you're having a great day. Anything financial I can help with?`;
        if (q.includes('security') || q.includes('safe')) return "We use bank-grade JWT encryption and HTTP-only cookies. Your data is stored in our local MongoDB fort.";

        return "I'm still learning the ropes! You can ask about your 'balance', 'transfers', 'security', or 'market rates'.";
    };

    const handleSend = (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = { role: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        // Simulate intelligent thinking
        setTimeout(() => {
            const botMsg = { role: 'bot', text: getBotResponse(input) };
            setMessages(prev => [...prev, botMsg]);
            setIsTyping(false);
        }, 800);
    };

    return (
        <div className="fixed bottom-8 right-8 z-50">
            {isOpen ? (
                <div className="bg-white w-85 h-[32rem] rounded-[2.5rem] shadow-2xl border border-slate-100 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
                                <Bot className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="font-black text-sm tracking-tight leading-none mb-1">BankUs AI</h4>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                                    <span className="text-[10px] font-bold text-blue-100 uppercase tracking-widest">Online Assistant</span>
                                </div>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-2 rounded-xl transition-all">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div ref={scrollRef} className="flex-1 p-6 overflow-y-auto space-y-6 bg-slate-50/30">
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                                    <div className={`p-4 rounded-3xl text-sm font-medium leading-relaxed shadow-sm ${msg.role === 'user'
                                            ? 'bg-blue-600 text-white rounded-tr-none'
                                            : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'
                                        }`}>
                                        {msg.text}
                                    </div>
                                    <span className="text-[10px] text-slate-300 font-bold mt-2 uppercase tracking-tighter">
                                        {msg.role === 'user' ? 'Sent' : 'Assistant'}
                                    </span>
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="bg-white p-4 rounded-3xl rounded-tl-none border border-slate-100 shadow-sm flex gap-1">
                                    <div className="w-1.5 h-1.5 bg-slate-200 rounded-full animate-bounce"></div>
                                    <div className="w-1.5 h-1.5 bg-slate-200 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                                    <div className="w-1.5 h-1.5 bg-slate-200 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-50 flex gap-3">
                        <div className="flex-1 relative">
                            <input
                                type="text"
                                placeholder="Ask about your balance..."
                                className="w-full bg-slate-100 text-sm font-medium py-4 px-5 pr-12 rounded-[1.5rem] focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                <Sparkles className="w-4 h-4 text-slate-300" />
                            </div>
                        </div>
                        <button type="submit" className="bg-blue-600 w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all hover:scale-105 active:scale-95">
                            <Send className="w-5 h-5" />
                        </button>
                    </form>
                </div>
            ) : (
                <button
                    onClick={() => setIsOpen(true)}
                    className="group relative bg-blue-600 w-16 h-16 rounded-[2rem] flex items-center justify-center text-white shadow-2xl shadow-blue-300 hover:scale-110 active:scale-95 transition-all duration-300"
                >
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-4 border-slate-50"></div>
                    <MessageSquare className="w-7 h-7 group-hover:rotate-12 transition-transform" />
                </button>
            )}
        </div>
    );
};

export default ChatBot;
