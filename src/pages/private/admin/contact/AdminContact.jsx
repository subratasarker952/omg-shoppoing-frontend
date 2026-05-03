import React, { useState, useEffect } from 'react';
import {
    Mail, Search, Eye, X, Clock, Inbox, Send,
    StickyNote, CheckCircle2, RefreshCw, AlertCircle, Calendar
} from "lucide-react";
import toast from 'react-hot-toast';
import api from '../../../../services/axios';

const AdminContact = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const [replyText, setReplyText] = useState('');
    const [adminNote, setAdminNote] = useState('');
    const [isReplying, setIsReplying] = useState(false);

    // Modal State
    const [selectedMsg, setSelectedMsg] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchMessages = async () => {
        setLoading(true);
        try {
            const params = {};
            if (startDate) params.startDate = startDate;
            if (endDate) params.endDate = endDate;

            const res = await api.get('/api/contacts', { params });
            setMessages(res.data.data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load messages");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [startDate, endDate]);

    const handleViewMessage = async (msg) => {
        setSelectedMsg(msg);
        setIsModalOpen(true);

        if (!msg.isRead) {
            try {
                await api.patch(`/api/contacts/${msg._id}/read`, {});
                setMessages(prev => prev.map(m => m._id === msg._id ? { ...m, isRead: true } : m));
            } catch (error) {
                console.error(error);
            }
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setReplyText('');
        setAdminNote(''); // Bug fix: Clear admin note on close
        setTimeout(() => setSelectedMsg(null), 200); // Smooth unmount
    };

    const handleSendReply = async () => {
        if (!replyText.trim()) return toast.error("Please write a message");

        setIsReplying(true);
        try {
            await api.post(`/api/contacts/${selectedMsg._id}/reply`, {
                replyMessage: replyText,
                subject: selectedMsg.subject,
                userEmail: selectedMsg.email,
                adminNote
            });

            toast.success("Reply sent successfully!");
            handleCloseModal();
            fetchMessages();
        } catch (error) {
            console.error(error);
            toast.error("Failed to send reply");
        } finally {
            setIsReplying(false);
        }
    };

    const filteredMessages = messages.filter(msg =>
        msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.subject.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-2 w-full min-h-screen bg-gray-50 ">
            <div className="container mx-auto space-y-4">

                {/* Header Section */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Header Section */}
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                            <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                                <Inbox size={24} />
                            </div>
                            Inbox Inquiries
                        </h1>
                        <p className="text-slate-500 text-sm font-medium">
                            Manage and respond to contact messages.
                        </p>
                    </div>


                    {/* Date Filter Section - Mobile Responsive Fix */}
                    <div className="flex flex-wrap items-center gap-2 bg-white p-1.5 sm:p-2 rounded-2xl border border-gray-100 shadow-sm w-full lg:w-auto">
                        <div className="flex items-center flex-1 sm:flex-initial gap-2 px-2 sm:px-3 border-r border-gray-100 overflow-x-auto">
                            {/* Start Date */}
                            <div className="flex items-center gap-1">
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="text-black outline-none text-xs sm:text-sm font-semibold bg-transparent cursor-pointer min-w-25"
                                />
                            </div>

                            {/* End Date */}
                            <div className="flex items-center gap-1">
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="text-black outline-none text-xs sm:text-sm font-semibold bg-transparent cursor-pointer min-w-25"
                                />
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-1 ml-auto">
                            {(startDate || endDate) ? (
                                <button
                                    onClick={() => { setStartDate(''); setEndDate(''); }}
                                    className="p-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-colors border border-red-100"
                                    title="Clear Filters"
                                >
                                    <X size={18} />
                                </button>
                            ) : (

                                <button
                                    onClick={() => fetchMessages()}
                                    className="p-2.5 bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 rounded-xl transition-colors shadow-sm"
                                    title="Refresh Data"
                                >
                                    <RefreshCw size={18} className={loading ? "animate-spin scale-200" : ""} /> 
                                </button>
                            )
                            }
                        </div>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search messages..."
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow text-slate-800 placeholder-slate-400"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Message List */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    {loading ? (
                        // Skeleton Loader
                        <div className="divide-y divide-slate-100">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="p-4 flex gap-4 animate-pulse">
                                    <div className="w-10 h-10 bg-slate-100 rounded-full shrink-0"></div>
                                    <div className="flex-1 space-y-3 py-1">
                                        <div className="h-4 bg-slate-100 rounded w-1/4"></div>
                                        <div className="h-3 bg-slate-50 rounded w-3/4"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : filteredMessages.length === 0 ? (
                        // Empty State
                        <div className="py-20 text-center flex flex-col items-center">
                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                                <Mail size={28} className="text-slate-300" />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-800">No messages found</h3>
                            <p className="text-sm text-slate-500 mt-1 max-w-sm">We couldn't find any inquiries matching your current filters. Try adjusting your search criteria.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-100">
                            {filteredMessages.map((msg) => (
                                <div
                                    key={msg._id}
                                    onClick={() => handleViewMessage(msg)}
                                    className={`group flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors cursor-pointer ${!msg.isRead ? 'bg-indigo-50/30' : ''}`}
                                >
                                    {/* Unread Dot & Avatar */}
                                    <div className="flex items-center gap-3 shrink-0">
                                        <div className={`w-2 h-2 rounded-full ${!msg.isRead ? 'bg-indigo-600' : 'bg-transparent'}`}></div>
                                        <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 font-bold flex items-center justify-center uppercase text-sm border border-slate-200">
                                            {msg.name.charAt(0)}
                                        </div>
                                    </div>

                                    {/* Content Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-4 mb-1">
                                            <h4 className={`text-sm truncate ${!msg.isRead ? 'font-bold text-slate-900' : 'font-medium text-slate-700'}`}>
                                                {msg.name}
                                            </h4>
                                            <span className="text-xs text-slate-400 font-medium whitespace-nowrap shrink-0 flex items-center gap-1">
                                                <Clock size={12} />
                                                {new Date(msg.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <p className={`text-sm truncate max-w-md ${!msg.isRead ? 'font-semibold text-slate-800' : 'text-slate-500'}`}>
                                                {msg.subject} <span className="text-slate-300 font-normal mx-1">|</span> <span className="font-normal text-slate-400">{msg.message.substring(0, 50)}...</span>
                                            </p>
                                        </div>
                                    </div>

                                    {/* Badges (Status & Notes) */}
                                    <div className="hidden md:flex items-center gap-2 shrink-0 ml-4">
                                        {msg.adminNote && (
                                            <div className="text-amber-500 bg-amber-50 p-1.5 rounded-lg" title="Has Internal Note">
                                                <StickyNote size={14} />
                                            </div>
                                        )}
                                        <span className={`px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide rounded-md border 
                                            ${msg.status === 'replied' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                                            {msg.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* View/Reply Modal */}
                {isModalOpen && selectedMsg && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={handleCloseModal}></div>

                        <div className="relative bg-white rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">

                            {/* Modal Header */}
                            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white shrink-0">
                                <div className="flex items-center gap-3">
                                    <h2 className="text-lg font-bold text-slate-800">Support Ticket</h2>
                                    <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md border 
                                        ${selectedMsg.status === 'replied' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                                        {selectedMsg.status}
                                    </span>
                                </div>
                                <button onClick={handleCloseModal} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Modal Scrollable Content */}
                            <div className="p-6 overflow-y-auto flex-1 bg-slate-50/50 space-y-6">

                                {/* Customer Info Card */}
                                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                                    <div className="flex justify-between items-start gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 font-bold flex items-center justify-center text-xl uppercase">
                                                {selectedMsg.name.charAt(0)}
                                            </div>
                                            <div>
                                                <h3 className="text-base font-bold text-slate-900">{selectedMsg.name}</h3>
                                                <p className="text-sm text-slate-500 font-medium">{selectedMsg.email}</p>
                                            </div>
                                        </div>
                                        <div className="text-right text-sm text-slate-500">
                                            <p className="font-medium text-slate-700">{new Date(selectedMsg.createdAt).toLocaleDateString()}</p>
                                            <p>{new Date(selectedMsg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                        </div>
                                    </div>

                                    <div className="mt-5 pt-5 border-t border-slate-100">
                                        <h4 className="text-sm font-bold text-slate-900 mb-2">Subject: {selectedMsg.subject}</h4>
                                        <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">
                                            {selectedMsg.message}
                                        </p>
                                    </div>
                                </div>

                                {/* Previous Reply / Notes */}
                                {selectedMsg.status === 'replied' && (
                                    <div className="space-y-4 pl-6 border-l-2 border-indigo-100">
                                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                                            <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                                                <CheckCircle2 size={14} /> Official Response Sent
                                            </p>
                                            <p className="text-slate-700 text-sm leading-relaxed">
                                                {selectedMsg.replyMessage || 'Replied directly via external email client.'}
                                            </p>
                                        </div>

                                        {selectedMsg.adminNote && (
                                            <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-100/50">
                                                <p className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                                                    <StickyNote size={14} /> Private Note
                                                </p>
                                                <p className="text-slate-600 text-sm italic">{selectedMsg.adminNote}</p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Reply Section (If Pending) */}
                                {selectedMsg.status === 'pending' && (
                                    <div className="bg-white p-5 rounded-xl border border-indigo-100 shadow-sm space-y-5">
                                        <div>
                                            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                                                <AlertCircle size={16} className="text-indigo-500" />
                                                Reply to Customer
                                            </label>
                                            <textarea
                                                className="w-full p-3 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm min-h-30 resize-y placeholder-slate-400"
                                                placeholder="Write your professional response here. This will be sent directly to the customer's email..."
                                                value={replyText}
                                                onChange={(e) => setReplyText(e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                                                <StickyNote size={16} className="text-amber-500" />
                                                Internal Note <span className="text-slate-400 font-normal text-xs">(Only visible to admins)</span>
                                            </label>
                                            <input
                                                type="text"
                                                className="w-full p-3 rounded-lg border border-slate-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all text-sm placeholder-slate-400 bg-slate-50"
                                                placeholder="E.g., Promised a 10% discount on next order..."
                                                value={adminNote}
                                                onChange={(e) => setAdminNote(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Modal Footer */}
                            <div className="px-6 py-4 border-t border-slate-100 bg-white flex justify-end gap-3 shrink-0">
                                <button
                                    onClick={handleCloseModal}
                                    className="px-5 py-2.5 rounded-lg font-medium text-slate-600 hover:bg-slate-100 transition-colors text-sm"
                                >
                                    Close
                                </button>
                                {selectedMsg.status === 'pending' && (
                                    <button
                                        onClick={handleSendReply}
                                        disabled={isReplying || !replyText.trim()}
                                        className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm shadow-sm"
                                    >
                                        {isReplying ? (
                                            <>
                                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                                Sending...
                                            </>
                                        ) : (
                                            <>
                                                <Send size={16} />
                                                Send Reply
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminContact;