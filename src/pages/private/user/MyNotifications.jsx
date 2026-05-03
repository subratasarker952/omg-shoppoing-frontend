import { useEffect, useState, useCallback } from "react";
import api from "../../../services/axios";
import { Bell, BellOff, CheckCheck, Loader2, ChevronDown, Globe, User, RefreshCw, X } from "lucide-react";
import toast from "react-hot-toast";
import moment from "moment";
import { useAuth } from "../../../context/AuthContext";

const MyNotifications = () => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    const [startDate, SetStartDate] = useState('')
    const [endDate, SetEndDate] = useState('')

    const [loading, setLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const [expandedId, setExpandedId] = useState(null);

    // ১. নোটিফিকেশনটি পড়া হয়েছে কিনা তা চেক করার হেল্পার ফাংশন
    const checkReadStatus = useCallback((n) => {
        if (n.isGlobal) {
            // গ্লোবাল হলে চেক করবে readBy অ্যারেতে ইউজারের আইডি আছে কিনা
            return n.readBy?.includes(user?._id);
        }
        // পার্সোনাল হলে শুধু isRead ফ্ল্যাগ দেখবে
        return n.isRead;
    }, [user?._id]);

    // ২. ডাটা ফেচিং
    const initData = useCallback(async () => {
        try {
            setLoading(true);
            const params = {};

            // শুধুমাত্র যদি ভ্যালু থাকে তখনই অবজেক্টে অ্যাড হবে
            if (startDate) params.startDate = startDate;
            if (endDate) params.endDate = endDate;

            const [notifRes, countRes] = await Promise.all([
                api.get("/api/notifications", { params }),
                api.get("/api/notifications/unread-count")
            ]);

            if (notifRes.data.success) {
                setNotifications(notifRes.data.notifications);
                setUnreadCount(countRes.data.count);
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to sync notifications");
        } finally {
            setLoading(false);
        }
    }, [endDate, startDate]);

    useEffect(() => {
        if (user?._id) initData();
    }, [initData, user?._id,]);

    // ৩. সিঙ্গেল নোটিফিকেশন রিড মার্ক করা
    const handleMarkAsRead = async (notification) => {
        const id = notification._id;
        try {
            await api.patch(`/api/notifications/${id}/read`);

            // UI Update: লোকাল স্টেট আপডেট
            setNotifications(prev => prev.map(n => {
                if (n._id === id) {
                    if (n.isGlobal) {
                        // গ্লোবাল হলে readBy অ্যারেতে আইডি পুশ করি (যাতে UI রিফ্রেশ ছাড়াই আপডেট হয়)
                        const updatedReadBy = n.readBy ? [...n.readBy, user._id] : [user._id];
                        return { ...n, readBy: updatedReadBy };
                    }
                    return { ...n, isRead: true };
                }
                return n;
            }));

            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error("Mark as read failed", error);
        }
    };

    // ৪. একর্ডিয়ন টগল এবং অটো-রিড লজিক
    const toggleAccordion = (notification) => {
        const isRead = checkReadStatus(notification);
        const id = notification._id;

        setExpandedId(expandedId === id ? null : id);

        // যদি নোটিফিকেশনটি আনরিড হয় এবং আমরা ওপেন করছি
        if (!isRead && expandedId !== id) {
            handleMarkAsRead(notification);
        }
    };

    // ৫. সব নোটিফিকেশন রিড মার্ক করা
    const markAllRead = async () => {
        if (unreadCount === 0) return;
        try {
            setIsProcessing(true);
            await api.patch("/api/notifications/read-all");

            // সবগুলোকে রিড হিসেবে স্টেট আপডেট করা
            setNotifications(prev => prev.map(n => {
                if (n.isGlobal) {
                    if (!n.readBy.includes(user._id)) {
                        return { ...n, readBy: [...n.readBy, user._id] };
                    }
                    return n;
                }
                return { ...n, isRead: true };
            }));

            setUnreadCount(0);
            toast.success("All caught up!");
        } catch (error) {
            console.error(error);
            toast.error("Update failed");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="p-2 container mx-auto min-h-screen bg-gray-50 space-y-4">
            {/* Header */}

            {/* Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2">
                {/* Header Section */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <Bell className={unreadCount > 0 ? "text-green-600" : "text-violet-600"} />
                        Notifications
                    </h2>
                    <p className="text-sm text-violet-500 font-medium">
                        {unreadCount > 0 ? <button
                            onClick={markAllRead}
                            disabled={isProcessing}
                            className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-violet-600 hover:text-violet-800 disabled:opacity-50 transition-all bg-violet-50 px-3 py-2 rounded-xl"
                        >
                            {isProcessing ? <Loader2 size={14} className="animate-spin" /> : <CheckCheck size={16} />}
                            Mark all as read
                        </button> : "Your inbox is empty"}
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
                                onClick={() => initData()}
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


            {/* List Section */}
            {notifications.length === 0 ? (
                <div className="bg-white border-2 border-dashed border-gray-100 rounded-4xl py-20 flex flex-col items-center justify-center text-center">
                    <div className="bg-gray-50 p-4 rounded-full mb-4">
                        <BellOff className="text-gray-200" size={48} />
                    </div>
                    <p className="text-gray-400 font-bold">No notifications found</p>
                </div>
            ) : (
                <div className="space-y-1">
                    {notifications.map((n) => {
                        const isRead = checkReadStatus(n);
                        const isExpanded = expandedId === n._id;

                        return (
                            <div
                                key={n._id}
                                className={`group rounded-3xl border transition-all duration-300 overflow-hidden ${isRead ? "bg-white border-gray-100 opacity-90" : "bg-white border-violet-200 shadow-md ring-1 ring-violet-100"
                                    }`}
                            >
                                {/* Item Header */}
                                <div
                                    onClick={() => toggleAccordion(n)}
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
                                                {n.isGlobal ? (
                                                    <span className="text-[8px] bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded-full font-black uppercase tracking-tighter">
                                                        Global
                                                    </span>
                                                ) : (
                                                    <span className="text-[8px] bg-blue-100 text-violet-600 px-1.5 py-0.5 rounded-full font-black uppercase tracking-tighter">
                                                        Private
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

                                {/* Item Body */}
                                <div className={`transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
                                    <div className="px-5 pb-5 ml-14">
                                        <div className={`p-4 rounded-2xl border ${isRead ? 'bg-gray-50 border-gray-100' : 'bg-violet-50/30 border-violet-100'}`}>
                                            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                                                {n.message}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default MyNotifications;