import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
    Bell, Send, Trash2, Loader2, User, Globe,
    Inbox, Megaphone, Calendar, Clock, ChevronDown,
    X,
    RefreshCw
} from 'lucide-react';
import toast from 'react-hot-toast';
import moment from 'moment';
import api from '../../../../services/axios';
import { useAuth } from '../../../../context/AuthContext';

const AdminNotifications = () => {
    const { user } = useAuth()
    const [notifications, setNotifications] = useState([]); // Sent by admin
    const [myInbox, setMyInbox] = useState([]); // Received by admin

    const [startDate, SetStartDate] = useState('')
    const [endDate, SetEndDate] = useState('')

    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [activeTab, setActiveTab] = useState('inbox'); // 'center' or 'inbox'

    const [expandedId, setExpandedId] = useState(null);

    const toggleAccordion = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const { register, handleSubmit, reset, watch, formState: { errors } } = useForm({
        defaultValues: {
            title: '',
            message: '',
            type: 'system',
            isGlobal: true,
            targetRole: 'all',
            userId: ''
        }
    });

    const isGlobal = watch("isGlobal");

    const fetchData = async () => {
        try {
            setLoading(true);

            const params = {};

            // শুধুমাত্র যদি ভ্যালু থাকে তখনই অবজেক্টে অ্যাড হবে
            if (startDate) params.startDate = startDate;
            if (endDate) params.endDate = endDate;

            // আমরা দুই ধরণের ডাটাই একসাথে ফেচ করছি
            const [sentRes, inboxRes] = await Promise.all([
                api.get('/api/notifications/sent', { params }),       // অ্যাডমিনের পাঠানো লিস্ট
                api.get('/api/notifications/admin-inbox', { params }) // অ্যাডমিনের নিজের ইনবক্স
            ]);
            setNotifications(sentRes.data.notifications || []);
            setMyInbox(inboxRes.data.notifications || []);
        } catch (err) {
            console.error(err);
            toast.error("নোটিফিকেশন লোড করতে সমস্যা হয়েছে");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // ১. শুরুতে একবার ডাটা ফেচ করবে
        fetchData();

        // ২. ৫ মিনিট (৫ * ৬০ * ১০০০ মিলি-সেকেন্ড) পর পর কল করার জন্য ইন্টারভ্যাল সেট
        const intervalId = setInterval(() => {
            // ট্যাব যদি একটিভ থাকে তবেই ডাটা ফেচ করবে (পারফরম্যান্স অপ্টিমাইজেশন)
            if (!document.hidden) {
                fetchData();
            }
        }, 5 * 60 * 1000);

        // ৩. ক্লিনআপ ফাংশন: কম্পোনেন্ট আনমাউন্ট হলে ইন্টারভ্যাল বন্ধ করে দেবে
        return () => clearInterval(intervalId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [startDate, endDate]); // ডেট ফিল্টার চেঞ্জ হলেও রি-রান করবে

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        try {
            // যদি Global না হয়, তবে userId নিশ্চিত করা
            if (!data.isGlobal && !data.userId) {
                toast.error("নির্দিষ্ট ইউজারের আইডি প্রয়োজন");
                return;
            }

            await api.post('/api/notifications', data);
            toast.success("নোটিফিকেশন সফলভাবে পাঠানো হয়েছে!");
            reset();
            fetchData();
        } catch (err) {
            toast.error(err.response?.data?.message || "পাঠানো ব্যর্থ হয়েছে");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("আপনি কি এটি ডিলিট করতে চান?")) return;
        try {
            await api.delete(`/api/notifications/admin/${id}`);
            toast.success("ডিলিট করা হয়েছে");
            fetchData();
        } catch (err) {
            console.error(err);
            toast.error("ডিলিট করা সম্ভব হয়নি");
        }
    };

    // handleMarkAsRead Function
    const handleMarkAsRead = async (id) => {
        try {
            // ১. API কল করা
            const { data } = await api.patch(`/api/notifications/${id}/read`);

            if (data.success) {
                // ২. লোকাল স্টেট আপডেট করা (Optimistic Update)
                // আমরা filter বা map ব্যবহার করে myInbox স্টেটটি আপডেট করব
                setMyInbox((prevNotifications) =>
                    prevNotifications.map((n) => {
                        if (n._id === id) {
                            if (n.isGlobal) {
                                // গ্লোবাল হলে: readBy অ্যারেতে নিজের আইডি পুশ করা (যদি না থাকে)
                                const updatedReadBy = n.readBy ? [...n.readBy] : [];
                                if (!updatedReadBy.includes(user._id)) {
                                    updatedReadBy.push(user._id);
                                }
                                return { ...n, readBy: updatedReadBy };
                            } else {
                                // পার্সোনাল হলে: শুধু isRead ফ্ল্যাগ ট্রু করা
                                return { ...n, isRead: true };
                            }
                        }
                        return n;
                    })
                );

                // ৩. (ঐচ্ছিক) আনরিড কাউন্ট কমানোর জন্য আলাদা স্টেট থাকলে সেটিও আপডেট করতে পারেন
                // setUnreadCount(prev => Math.max(0, prev - 1));

            }
        } catch (error) {
            console.error("Error marking as read:", error);
            toast.error("Failed to update notification"); // যদি কোনো টোস্ট লাইব্রেরি থাকে
        }
    };

    const handleExpand = (id, isRead) => {
        setExpandedId(expandedId === id ? null : id);
        // যদি নোটিফিকেশনটি আগে পড়া না হয়ে থাকে এবং আমরা এখন এটি খুলছি
        if (!isRead && expandedId !== id) {
            handleMarkAsRead(id);
        }
    };


    return (
        <div className="container mx-auto p-1 space-y-4 bg-gray-50 min-h-screen">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Header Section */}
                <div className='flex-1 p-2'>
                    <h1 className="text-2xl font-black text-black flex items-center gap-2">
                        <Bell className="text-violet-600" /> Notification Panel
                    </h1>
                    <p className="text-gray-500 text-xs font-bold tracking-widest">Manage system alerts and broadcasts</p>
                </div>


                {/* Date Filter Section - Mobile Responsive Fix */}
                <div className="flex-1 flex flex-wrap items-center gap-2 bg-white p-1.5 sm:p-2 rounded-2xl border border-gray-100 shadow-sm w-full lg:w-auto">
                    <div className="flex items-center flex-1 sm:flex-initial gap-2 px-2 sm:px-3 border-r border-gray-100 overflow-x-auto">
                        {/* Start Date */}
                        <div className="flex items-center gap-1">
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => SetStartDate(e.target.value)}
                                className="outline-none text-xs sm:text-sm font-semibold bg-transparent cursor-pointer min-w-25"
                            />
                        </div>


                        {/* End Date */}
                        <div className="flex items-center gap-1">
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => SetEndDate(e.target.value)}
                                className="outline-none text-xs sm:text-sm font-semibold bg-transparent cursor-pointer min-w-25"
                            />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-1 ml-auto">
                        {(startDate || endDate) ? (
                            <button
                                onClick={() => { SetStartDate(''); SetEndDate(''); }}
                                className="p-2 hover:bg-red-50 text-red-500 rounded-xl transition-colors"
                                title="Clear Filters"
                            >
                                <X size={18} />
                            </button>
                        ) : (

                            <button
                                onClick={() => fetchData()}
                                className="p-2 hover:bg-violet-50 text-violet-600 rounded-xl transition-colors"
                                title="Refresh Data"
                            >
                                <RefreshCw size={18} className={loading ? "animate-spin scale-200" : ""} />
                            </button>
                        )
                        }
                    </div>
                </div>
            </div>


            {/* Header & Tabs */}
            <div className="flex justify-between bg-white p-1 rounded-2xl shadow-sm border w-full">
                <button
                    onClick={() => setActiveTab('inbox')}
                    className={`flex-1 justify-center py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'inbox' ? 'bg-black text-white' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                    <Inbox size={14} /> Admin Inbox ({myInbox.length})
                </button>
                <button
                    onClick={() => setActiveTab('center')}
                    className={`flex-1 justify-center py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'center' ? 'bg-black text-white' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                    <Megaphone size={14} /> Send Center
                </button>
            </div>

            {activeTab === 'center' ? (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Form Section */}
                    <div className="lg:col-span-4">
                        <form onSubmit={handleSubmit(onSubmit)} className="bg-white text-black p-6 rounded-4xl border border-gray-100 shadow-xl space-y-4 sticky top-24">
                            <h3 className="font-bold text-gray-800 border-b pb-3 mb-2 flex items-center gap-2">
                                <Send size={18} className="text-violet-600" /> New Broadcast
                            </h3>

                            <div className="space-y-1">
                                <label className="text-[10px] font-bold uppercase text-gray-400 ml-1">Title</label>
                                <input
                                    {...register("title", { required: "Title Required" })}
                                    placeholder="Enter Title..."
                                    className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 ring-violet-500 font-bold"
                                />
                                {errors?.title?.message && <p className='text-red-600'>{errors?.title?.message}</p>}
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-bold uppercase text-gray-400 ml-1">Message</label>
                                <textarea
                                    {...register("message", { required: "Message Required" })}
                                    rows="3"
                                    placeholder="Write your message here..."
                                    className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 ring-violet-500 text-sm"
                                />
                                {errors?.message?.message && <p className='text-red-600'>{errors?.message?.message}</p>}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold uppercase text-gray-400 ml-1">Type</label>
                                    <select {...register("type")} className="w-full p-4 bg-gray-50 rounded-2xl font-bold text-xs outline-none">
                                        <option value="system">System</option>
                                        <option value="marketing">Marketing</option>
                                        <option value="alert">Alert</option>
                                        <option value="payment">Payment</option>
                                        <option value="order">Order</option>

                                    </select>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold uppercase text-gray-400 ml-1">Scope</label>
                                    <select
                                        {...register("isGlobal", { setValueAs: v => v === "true" })}
                                        className="w-full p-4 bg-gray-50 rounded-2xl font-bold text-xs outline-none"
                                    >
                                        <option value="true">Global </option>
                                        <option value="false">Private</option>
                                    </select>
                                </div>

                                {isGlobal ? (
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold uppercase text-gray-400 ml-1">Target</label>
                                        <select {...register("targetRole")} className="w-full p-4 bg-gray-50 rounded-2xl font-bold text-xs outline-none">
                                            <option value="all">All</option>
                                            <option value="user">user</option>
                                            <option value="admin">admin</option>
                                        </select>
                                    </div>

                                ) : (
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold uppercase text-gray-400 ml-1">Target User id</label>
                                        <input
                                            {...register("userId", { required: "User Id Required" })}
                                            placeholder="Paste User ID"
                                            className="w-full p-4 bg-violet-50 border border-violet-100 rounded-2xl outline-none text-xs font-mono"
                                        />
                                        {errors?.userId?.message && <p className='text-red-600'>{errors?.userId?.message}</p>}
                                    </div>
                                )}

                            </div>

                            <button
                                disabled={isSubmitting}
                                className="w-full bg-black text-white p-4 rounded-2xl font-black uppercase tracking-widest hover:bg-violet-600 transition-all flex justify-center items-center gap-2 shadow-lg"
                            >
                                {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : "Send Notification"}
                            </button>
                        </form>
                    </div>

                    {/* History Section */}
                    <div className="lg:col-span-8 space-y-3">
                        <h3 className="font-black text-gray-400 uppercase text-[10px] tracking-widest mb-4 flex items-center gap-2">
                            <Clock size={14} /> Sent History
                        </h3>

                        {notifications.length === 0 ? (
                            <div className="bg-white border-2 border-dashed rounded-4xl p-20 text-center text-gray-400 font-medium">
                                No history found.
                            </div>
                        ) : (
                            notifications.map((n) => {
                                const isExpanded = expandedId === n._id;

                                return (
                                    <div key={n._id} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden transition-all duration-300">
                                        {/* Header: ক্লিক করলে একর্ডিয়ন খুলবে */}
                                        <div
                                            onClick={() => toggleAccordion(n._id)}
                                            className="p-5 cursor-pointer hover:bg-gray-50 transition-colors flex items-start gap-4"
                                        >
                                            <div className={`p-3 rounded-2xl shrink-0 ${n.isGlobal ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'}`}>
                                                {n.isGlobal ? <Globe size={20} /> : <User size={20} />}
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-start">
                                                    <div className="space-y-1">
                                                        <h4 className="font-bold text-gray-800 text-sm capitalize">{n.title}</h4>

                                                        {/* মেটা ডেটা এখন উপরে */}
                                                        <div className="flex items-center flex-wrap gap-1">
                                                            <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded ${n.type === 'marketing' ? 'bg-purple-100 text-purple-700' :
                                                                n.type === 'alert' ? 'bg-amber-100 text-amber-700' :
                                                                    'bg-gray-100 text-gray-600'
                                                                }`}>
                                                                {n.type}
                                                            </span>
                                                            {!n.senderId && (
                                                                <span className="text-[9px] font-bold text-violet-400 italic bg-violet-50 px-2 py-0.5 rounded">
                                                                    Auto
                                                                </span>
                                                            )}
                                                            <span className="flex items-center gap-1 text-[10px] font-bold text-gray-400">
                                                                <Calendar size={10} /> {moment(n.createdAt).fromNow()}
                                                            </span>
                                                            {!n.isGlobal && n.userId && (
                                                                <span className="text-[10px] font-medium text-gray-400">
                                                                    → {n.userId.name || n.userId.email}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-4">
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); handleDelete(n._id); }}
                                                            className="p-2 text-rose-500 bg-rose-50 rounded-xl transition-all"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                        <div className={`text-gray-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                                                            <ChevronDown size={18} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Body: একর্ডিয়ন কন্টেন্ট */}
                                        <div className={`transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
                                            <div className="px-5 pb-5 pt-0 ml-17">
                                                <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100">
                                                    <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line capitalize">
                                                        {n.message}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            ) : (
                /* My Inbox Section */
                <div className="container mx-auto space-y-1">
                    {myInbox.length === 0 ? (
                        <div className="bg-white border-2 border-dashed rounded-4xl p-20 text-center text-gray-400 font-medium">
                            Your inbox is empty.
                        </div>
                    ) : (
                        myInbox.map((n) => {
                            const isRead = n.isGlobal ? n.readBy?.includes(user?._id) : n.isRead;
                            const isExpanded = expandedId === n._id;

                            return (
                                <div
                                    key={n._id}
                                    className={`group rounded-3xl border transition-all duration-300 overflow-hidden ${isRead ? "bg-white border-gray-100 opacity-90" : "bg-white border-violet-200 shadow-md ring-1 ring-violet-100"
                                        }`}
                                >
                                    {/* Header: টাইটেল এবং মেটা ডেটা */}
                                    <div
                                        onClick={() => handleExpand(n._id, isRead)}
                                        className="p-5 cursor-pointer flex items-center gap-4 select-none relative"
                                    >
                                        {/* আনরিড ডট লজিক */}

                                        <div className={`absolute top-2 left-2 w-2.5 h-2.5 rounded-full shrink-0 ${isRead ? 'hidden' : 'bg-violet-600 animate-pulse'
                                            }`} />

                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-2">
                                                    <h3 className={`font-bold transition-all ${isRead ? 'text-gray-600 text-sm' : 'text-violet-900 text-base'
                                                        }`}>
                                                        {n.title}
                                                    </h3>
                                                    {n.isGlobal && (
                                                        <span className="text-[8px] bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded-full font-black uppercase tracking-tighter">
                                                            Global
                                                        </span>
                                                    )}
                                                    <span className="text-[8px] bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded-full font-black uppercase tracking-tighter">
                                                        {n.targetRole}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-[10px] font-bold text-gray-400 uppercase whitespace-nowrap">
                                                        {moment(n.createdAt).format('LT')}
                                                    </span>
                                                    <ChevronDown size={18} className={`text-gray-400 transition-transform duration-300 ${isExpanded ? 'rotate-180 text-violet-600' : ''}`} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Body: নোটিফিকেশন মেসেজ */}
                                    <div className={`transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                        } overflow-hidden`}>
                                        <div className="px-5 pb-5 ml-6">
                                            <div className={`p-4 rounded-2xl border ${isRead ? 'bg-gray-50 border-gray-100 text-gray-600' : 'bg-white border-violet-100 text-violet-800'
                                                }`}>
                                                <p className="text-sm leading-relaxed whitespace-pre-line">
                                                    {n.message}
                                                </p>

                                                {/* ফুটার তথ্য (অপশনাল) */}
                                                <div className="mt-3 flex items-center gap-2 border-t border-dashed border-gray-200 pt-2">
                                                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                                                        Received: {moment(n.createdAt).format('LL')}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            )}
        </div>
    );
};

export default AdminNotifications;