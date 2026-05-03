import React, { useEffect, useRef, useState } from 'react';
import { X, Send, User, Shield } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../../../../../services/axios';

const TicketDetailsModal = ({ ticket, isOpen, onClose, onReplySuccess, currentUser }) => {
    const [currentTicket, setCurrentTicket] = useState(ticket); // লোকাল স্টেট
    const [msg, setMsg] = useState("");
    const [sending, setSending] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [currentTicket?.messages]);

    useEffect(() => {
        setCurrentTicket(ticket);
    }, [ticket]);

    if (!isOpen || !ticket) return null;

    const handleSend = async (e) => {
        e.preventDefault();
        if (!msg.trim()) return;

        try {
            setSending(true);
            const { data } = await api.put(`/api/supports/reply/${ticket._id}`, { message: msg });

            toast.success("রিপ্লাই পাঠানো হয়েছে");
            setMsg("");

            // ১. লোকাল স্টেট আপডেট (যাতে সাথে সাথে মেসেজ দেখা যায়)
            setCurrentTicket(data.ticket);

            // ২. মেইন পেজের লিস্ট আপডেট করা
            onReplySuccess();
        } catch (error) {
            console.error(error);
            toast.error("মেসেজ পাঠানো যায়নি");
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[70vh]">
                {/* Modal Header */}
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <div>
                        <h3 className="text-xl font-bold text-slate-800">{ticket.subject}</h3>
                        <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest font-bold">Ticket ID: #{ticket._id.slice(-6)}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                        <X size={24} className="text-slate-500" />
                    </button>
                </div>

                {/* Messages Body */}
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-6  space-y-4 bg-slate-50/50">
                    {currentTicket?.messages?.map((m, i) => {
                        const isMe = m.sender === currentUser?._id || m.sender?._id === currentUser?._id;
                        return (
                            <div key={i} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] p-4 rounded-2xl shadow-sm ${isMe
                                    ? 'bg-blue-600 text-white rounded-tr-none'
                                    : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'
                                    }`}>
                                    <div className="flex items-center gap-2 mb-1 opacity-70">
                                        {isMe ? <Shield size={12} /> : <User size={12} />}
                                        <span className="text-[10px] font-bold uppercase tracking-tighter">
                                            {isMe ? 'You' : (m.sender?.name || 'Support Team')}
                                        </span>
                                    </div>
                                    <p className="text-sm leading-relaxed">{m.message}</p>
                                    <p className={`text-[10px] mt-2 ${isMe ? 'text-blue-100' : 'text-slate-400'}`}>
                                        {new Date(m.createdAt).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Input Area */}
                <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-100 flex gap-3">
                    <input
                        value={msg}
                        onChange={(e) => setMsg(e.target.value)}
                        placeholder="আপনার বার্তা লিখুন..."
                        className="flex-1 bg-slate-50 border border-slate-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                    />
                    <button
                        disabled={sending}
                        type="submit"
                        className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50"
                    >
                        <Send size={20} />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default TicketDetailsModal