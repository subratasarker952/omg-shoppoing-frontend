import { useEffect, useState } from "react";
import {
    Package,
    RefreshCw,
    Search,
    ShoppingBag,
    Trash2,
    X,
} from "lucide-react";
import { Link } from "react-router-dom";
import api from "../../../services/axios";
import toast from "react-hot-toast";
import OrderTimer from "./component/OrderTimer";
import moment from "moment";

const MyOrders = () => {
    const [orders, setOrders] = useState([]);

    const [startDate, SetStartDate] = useState('')
    const [endDate, SetEndDate] = useState('')

    const [loading, setLoading] = useState(true);

    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");

    const fetchOrders = async () => {
        try {
            const params = {};

            // শুধুমাত্র যদি ভ্যালু থাকে তখনই অবজেক্টে অ্যাড হবে
            if (startDate) params.startDate = startDate;
            if (endDate) params.endDate = endDate;

            const res = await api.get("/api/orders/my-orders", { params });
            setOrders(res.data.orders);
        } catch (err) {
            console.error(err);
            toast.error("অর্ডার লিস্ট লোড করতে সমস্যা হয়েছে");
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchOrders();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [startDate, endDate]);

    const filteredOrders = orders.filter(order => {
        const matchesSearch = order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.shippingAddress.phone.includes(searchTerm);
        const matchesStatus = filterStatus === 'all' || order.orderStatus === filterStatus;
        return matchesSearch && matchesStatus;
    });


    // স্ট্যাটাস ডট কালার লজিক (প্রফেশনাল ওয়ে)
    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'pending': return 'bg-amber-400';
            case 'processing': return 'bg-blue-500';
            case 'shipped': return 'bg-violet-500';
            case 'delivered': return 'bg-green-500';
            case 'cancelled': return 'bg-red-500';
            default: return 'bg-gray-400';
        }
    };


    const handlePay = async (order) => {
        const canPay = order.orderStatus !== 'Cancelled';
        if (!canPay) {
            toast.error("Order Expier")
            return;
        }
        try {
            const payload = {
                amount: order.summary.totalAmount,
                gateway: order.paymentMethod, // 'stripe', 'sslcommerz', or 'COD'
                tenantId: order.tenantId,
                orderId: order._id
            };

            const res = await api.post('/api/payments/init', payload);

            if (res.data.success) {
                if (payload.gateway === "COD") {
                    // COD হলে রিডাইরেক্ট করার দরকার নেই, সরাসরি কনফার্মেশন দেখান
                    toast.success("Order Confirmed Successfully!");
                    fetchOrders()
                } else if (res.data.url) {
                    // অনলাইন পেমেন্ট হলে গেটওয়েতে পাঠান
                    window.location.href = res.data.url;
                }
            } else {
                toast.error(res.data.message || "Something went wrong");
            }
        } catch (error) {
            console.error(error);
            toast.error("Process failed. Please try again.");
        }
    };

    const handleDelete = async (orderId) => {
        // ইউজারের থেকে কনফার্মেশন নেওয়া
        const isConfirmed = window.confirm("আপনি কি নিশ্চিতভাবে এই অর্ডারটি ডিলিট করতে চান? এটি আর ফিরে পাওয়া যাবে না।");

        if (!isConfirmed) return;

        try {
            // Axios দিয়ে ডিলিট রিকোয়েস্ট পাঠানো
            const { data } = await api.delete(`/api/orders/${orderId}`);

            if (data.success) {
                toast.success(data.message || "অর্ডারটি সফলভাবে ডিলিট হয়েছে।");
                fetchOrders();
            }
        } catch (error) {
            console.error("Delete Error:", error);
            alert(error.response?.data?.message || "অর্ডার ডিলিট করতে সমস্যা হয়েছে।");
        }
    };


    if (orders?.length === 0) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
                <div className="p-6 bg-slate-200 dark:text-white text-black dark:bg-gray-600 rounded-full">
                    <ShoppingBag size={48} className="text-gray-200" />
                </div>
                <h2 className="text-3xl font-black uppercase tracking-tighter mb-2">No Orders Yet</h2>
                <p className="text-gray-500 mb-8 max-w-xs">You haven't placed any orders yet. Start shopping to see your orders here!</p>
                <Link to="/products" className="btn btn-primary px-8 rounded-xl text-white">
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-1 min-h-screen bg-gray-50 text-black">

            {/* Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Header Section */}
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <ShoppingBag className="text-violet-600" /> My Orders
                    </h1>
                    <p className="text-gray-500 text-sm font-medium">Manage My orders ({orders?.length || 0})</p>
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
                                onClick={() => fetchOrders()}
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

            {/* Filters Section */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 my-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10" size={18} />
                    <input
                        type="text"
                        placeholder="অর্ডার আইডি বা ফোন..."
                        className="input input-bordered pl-10 w-full text-black focus:ring-primary h-11 bg-white rounded-2xl shadow-sm"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <select
                    className="md:flex-1 w-full select select-bordered text-black h-11 bg-white rounded-2xl shadow-sm"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                >
                    <option value="all">সব স্ট্যাটাস</option>
                    {['pending', 'processing', 'packed', 'shipped', 'delivered', 'cancelled'].map(st => (
                        <option key={st} value={st}>{st.toUpperCase()}</option>
                    ))}
                </select>
            </div>

            {/* Orders List */}
            <div className="space-y-6">
                {filteredOrders.map((order) => (
                    <div
                        key={order._id}
                        className="group bg-white border border-gray-200 hover:border-black transition-all duration-300 shadow-sm hover:shadow-md"
                    >
                        {/* Order Header - Minimalist Top Bar */}
                        <div className="bg-gray-50/50 p-4 border-b border-gray-100 flex justify-between items-center gap-2 text-[11px] font-bold uppercase tracking-widest">
                            <div className="flex gap-4 justify-between">
                                <div className="flex flex-col gap-1">
                                    <span className="text-gray-400">Placed</span>
                                    <span className="text-gray-900">{new Date(order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-gray-400">Total</span>
                                    <span className="text-gray-900 font-black">৳{order.summary.totalAmount}</span>
                                </div>
                                <div className="hidden sm:flex flex-col gap-1">
                                    <span className="text-gray-400">Oreder Id</span>
                                    <span className="text-gray-700">{order.orderId}</span>
                                </div>
                            </div>
                            <div>
                                {(() => {
                                    // UTC টাইম ব্যবহার করে ডিফারেন্স বের করা নিরাপদ
                                    const now = moment.utc();
                                    const orderTime = moment.utc(order.createdAt);
                                    const diffInMinutes = now.diff(orderTime, 'minutes');

                                    const isExpired = diffInMinutes >= 30;
                                    const deleteMode = order.orderStatus === 'cancelled' && order.paymentStatus !== "refund_pending";
                                    const timerMode = order.orderStatus === 'pending';

                                    // ১. ডিলিট বাটন দেখানোর কন্ডিশন (যদি ক্যানসেল হয় অথবা পেন্ডিং থাকা অবস্থায় এক্সপায়ার হয়)
                                    if (deleteMode || (isExpired && timerMode)) {
                                        return (
                                            <button
                                                disabled={!deleteMode} // আপনি চাইলে পেন্ডিং এক্সপায়ার হলেও ডিলিট অপশন দিতে পারেন
                                                onClick={() => handleDelete(order._id)}
                                                className={`p-3 border-2 border-gray-100 rounded-2xl text-gray-400 transition-all ${deleteMode
                                                    ? "text-red-600 border-red-100 cursor-pointer"
                                                    : "opacity-50 cursor-not-allowed"
                                                    }`}
                                                title={deleteMode ? "Delete Order" : "Time Expired"}
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        );
                                    }

                                    // ২. যদি পেন্ডিং থাকে এবং এখনো ৩০ মিনিট না পার হয়
                                    if (timerMode && !isExpired) {
                                        return ( // এখানে 'return' অবশ্যই দিতে হবে
                                            <OrderTimer
                                                createdAt={order.createdAt}
                                                onExpire={fetchOrders}
                                            />
                                        );
                                    }

                                    return null;
                                })()}
                            </div>
                        </div>

                        {/* Items Section */}
                        <div className="p-6">
                            <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                                <div className="w-full  space-y-4">
                                    {order.items.map((item) => (
                                        <div key={item._id} className="flex items-center gap-5">
                                            <div className="w-14 h-14 bg-gray-50 shrink-0 border border-gray-100 flex items-center justify-center rounded-lg">
                                                <Package size={20} className="text-gray-300" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className=" font-bold text-gray-900 uppercase tracking-tight">{item.name}</h4>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">
                                                    Qty: {item.quantity} • {item.variant?.size && `Size: ${item.variant.size}`} {item.variant?.color && `• Color: ${item.variant.color}`}
                                                </p>

                                                <div className="mt-2 flex items-center gap-2">
                                                    <div className={`w-2 h-2 rounded-full ${getStatusColor(order.orderStatus)}`} />
                                                    <span className="text-[10px] font-black uppercase tracking-tighter text-gray-600">
                                                        {order.orderStatus}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Dynamic Action Buttons */}
                                <div className="shrink-0 w-full md:w-48 space-y-2">
                                    {/* কন্ডিশন আপডেট: পেমেন্ট পেন্ডিং এবং অর্ডার এখনো প্রসেসিং এ যায়নি */}
                                    {order.paymentStatus === 'pending' && order.orderStatus === 'pending' && (
                                        <button
                                            onClick={() => handlePay(order)}
                                            className="w-full py-3 bg-black text-white text-[10px] font-bold uppercase tracking-widest hover:bg-gray-800 transition-all active:scale-95"
                                        >
                                            {order.paymentMethod === 'COD' ? "Confirm Order" : "Pay Now"}
                                        </button>
                                    )}

                                    {/* Track Order বাটন সব সময় দেখাবে যদি অর্ডার প্লেস হয়ে যায় */}
                                    <Link
                                        to={`/dashboard/my-orders/${order._id}`}
                                        className="block w-full py-3 border border-gray-900 text-gray-900 text-[10px] font-black uppercase tracking-widest text-center hover:bg-black hover:text-white transition-all group-hover:bg-gray-50 group-hover:border-black"
                                    >
                                        Order Details
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyOrders;