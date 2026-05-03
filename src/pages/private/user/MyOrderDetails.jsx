import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
    Package,
    Truck,
    CheckCircle2,
    Clock,
    MapPin,
    CreditCard,
    ArrowLeft,
    Phone,
    User,
    Download,
    Gpu
} from "lucide-react";
import api from "../../../services/axios";
import toast from "react-hot-toast";
import ReviewForm from "./component/ReviewForm";
import { Modal } from "../../../components/ui/Modal";

const MyOrderDetails = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [productId, setProductId] = useState(null);

    const handleReviewModal = (id) => {
        setProductId(id)
        setShowReviewModal(true)
    }
    const handleCloseReviewModal = () => {
        setProductId(null)
        setShowReviewModal(false)
    }


    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const res = await api.get(`/api/orders/${id}`);
                setOrder(res.data.order);
            } catch (err) {
                console.error(err);
                toast.error("অর্ডার ডিটেইলস লোড করা সম্ভব হয়নি");
            } finally {
                setLoading(false);
            }
        };
        fetchOrderDetails();
    }, [id]);

    const downloadInvoice = async (orderId) => {
        try {
            const response = await api.get(`/api/orders/invoice/${orderId}`, {
                responseType: 'blob', // ফাইল ডাউনলোডের জন্য blob জরুরি
            });

            // ব্রাউজারে ফাইল ডাউনলোড ট্রিগার করা
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Invoice_${orderId}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error("Download error:", error);
        }
    };

    const getOrderStatusStyle = (status) => {
        const styles = {
            pending: "bg-amber-100 text-amber-700",
            processing: "bg-blue-100 text-blue-700",
            packed: "bg-yellow-100 text-yellow-700",
            shipped: "bg-purple-100 text-purple-700",
            delivered: "bg-emerald-100 text-emerald-700",
            cancelled: "bg-rose-100 text-rose-700",
        };
        return styles[status] || "bg-gray-100 text-gray-700";
    };

    if (loading) return <div className="p-20 text-center font-bold uppercase tracking-widest animate-pulse">Loading Details...</div>;
    if (!order) return <div className="p-20 text-center font-bold">Order not found!</div>;

    // Timeline logic
    const steps = [
        { label: 'Placed', status: 'pending', icon: <Clock size={18} /> },
        { label: 'Processing', status: 'processing', icon: <Gpu size={18} /> },
        { label: 'Packed', status: 'packed', icon: <Package size={18} /> },
        { label: 'Shipped', status: 'shipped', icon: <Truck size={18} /> },
        { label: 'Delivered', status: 'delivered', icon: <CheckCircle2 size={18} /> },
    ];

    const currentStepIndex = steps.findIndex(s => s.status === order.orderStatus.toLowerCase());

    return (
        <div className="container mx-auto p-1 min-h-screen bg-gray-50 text-black">
            {/* Header */}
            <div className="space-y-6 mb-10">
                {/* Top Navigation & Action Row */}
                <div className="flex justify-between items-start sm:items-center gap-4">
                    <Link
                        to="/dashboard/my-orders"
                        className="group flex items-center gap-2 text-gray-400 hover:text-black transition-all text-[10px] font-black uppercase tracking-[0.2em]"
                    >
                        <div className="p-2 bg-gray-50 rounded-full group-hover:bg-gray-100 transition-colors">
                            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                        </div>
                        Back to Orders
                    </Link>

                    <button
                        onClick={() => downloadInvoice(order._id)}
                        className="flex items-center gap-3 bg-black text-white px-3 py-1 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-zinc-800 transition-all active:scale-95 shadow-xl shadow-black/10 group"
                    >
                        <Download size={18} className="group-hover:bounce" />
                        Download Invoice
                    </button>
                </div>

                {/* Order Header Section */}
                <div className="relative">
                    <div className="absolute -left-4 top-0 w-1 h-full bg-violet-600 rounded-full hidden md:block" />
                    <h1 className="text-2xl font-black text-gray-900 tracking-tighter leading-none pl-2">
                        OID <span className="text-gray-300 font-light"> # </span>{order.orderId}
                    </h1>
                    <div className="flex items-center gap-3 mt-3">
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-gray-100 rounded-full">
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                            <p className="text-gray-500 font-bold text-[11px] uppercase tracking-widest">
                                Placed on {new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </p>
                        </div>

                        {/* Status Badge (Optional but Recommended) */}
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${getOrderStatusStyle(order.orderStatus)}`}>
                            {order.orderStatus}
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Items & Timeline */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Order Timeline */}
                    <div className="bg-white border border-gray-100 p-8 rounded-4xl shadow-sm">
                        <h3 className="text-sm font-black uppercase tracking-widest mb-8 text-black">Track Order</h3>
                        <div className="relative flex justify-between items-start">
                            {steps.map((step, index) => {
                                const isCompleted = index <= currentStepIndex;
                                return (
                                    <div key={index} className="flex flex-col items-center relative z-10 w-full">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors duration-500 ${isCompleted ? 'bg-black border-black text-white' : 'bg-white border-gray-600 text-gray-600'}`}>
                                            {step.icon}
                                        </div>
                                        <span className={`mt-3 text-[10px] font-black uppercase tracking-tighter text-center ${isCompleted ? 'text-black' : 'text-gray-700'}`}>
                                            {step.label}
                                        </span>
                                        {/* Connector Line */}
                                        {index < steps.length - 1 && (
                                            <div className="absolute top-5 left-1/2 w-full h-0.5 bg-gray-100 -z-10">
                                                <div className={`h-full bg-black transition-all duration-700 ${index < currentStepIndex ? 'w-full' : 'w-0'}`} />
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Order Items */}
                    <div className="bg-white border border-gray-100 overflow-hidden rounded-4xl shadow-sm">
                        <div className="px-8 py-6 border-b border-gray-50">
                            <h3 className="text-sm font-black uppercase tracking-widest text-black">Order Items ({order.items.length})</h3>
                        </div>
                        <div className="divide-y divide-gray-50">
                            {order.items.map((item) => (
                                <div key={item._id} className="p-4 flex items-center gap-6">
                                    <div className="w-20 h-24 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100 shrink-0">
                                        <Package size={24} className="text-gray-200" />
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <h4 className="text-lg font-black uppercase tracking-tight text-gray-900">{item.name}</h4>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                                            S: {item.variant?.size} • C: {item.variant?.color}
                                        </p>
                                        <p className="text-sm font-bold text-gray-900">৳{item.price || (order.summary.subtotal / item.quantity)} x {item.quantity}</p>
                                    </div>
                                    <div className="text-right relative">
                                        <p className="font-black text-gray-900">৳{(item.price || (order.summary.subtotal / item.quantity)) * item.quantity}</p>
                                        {order.orderStatus === "delivered" && <button
                                            onClick={() => handleReviewModal(item._id)}
                                            className="absolute -bottom-10 -right-2 btn btn-sm btn-primary whitespace-nowrap"
                                        >
                                            Review
                                        </button>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Address & Summary */}
                <div className="space-y-8">
                    {/* Shipping Address */}
                    <div className="bg-white border border-gray-100 p-8 rounded-[2.5rem] shadow-sm space-y-4">
                        <h3 className="text-sm font-black uppercase tracking-widest text-gray-400">Shipping Details</h3>
                        <div className=" space-y-4">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-gray-50 rounded-xl text-gray-400"><User size={18} /></div>
                                <div>
                                    <p className="text-[10px] font-black uppercase text-gray-400">Customer</p>
                                    <p className="text-sm font-bold text-gray-900 uppercase">{order.shippingAddress.name}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-gray-50 rounded-xl text-gray-400"><Phone size={18} /></div>
                                <div>
                                    <p className="text-[10px] font-black uppercase text-gray-400">Phone</p>
                                    <p className="text-sm font-bold text-gray-900">{order.shippingAddress.phone}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-gray-50 rounded-xl text-gray-400"><MapPin size={18} /></div>
                                <div className="text-sm font-bold text-gray-900 uppercase leading-relaxed">
                                    <p>{order.shippingAddress.street}</p>
                                    <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.zip}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="bg-black text-white p-8 rounded-[2.5rem] shadow-xl shadow-gray-200 space-y-4">
                        <h3 className="text-sm font-black uppercase tracking-widest text-gray-500">Payment Summary</h3>
                        <div className="space-y-3 text-sm font-bold">
                            <div className="flex justify-between text-gray-400">
                                <span className="uppercase tracking-widest text-[10px]">Subtotal</span>
                                <span>৳{order.summary.subtotal}</span>
                            </div>
                            <div className="flex justify-between text-gray-400">
                                <span className="uppercase tracking-widest text-[10px]">Shipping</span>
                                <span>৳{order.summary.shippingCharge}</span>
                            </div>
                            {order.summary.discount > 0 && (
                                <div className="flex justify-between text-green-400">
                                    <span className="uppercase tracking-widest text-[10px]">Discount</span>
                                    <span>-৳{order.summary.discount}</span>
                                </div>
                            )}
                            <div className="pt-4 border-t border-white/10 flex justify-between items-end">
                                <span className="uppercase tracking-[0.2em] text-xs font-black">Total Paid</span>
                                <span className="text-3xl font-black">৳{order.summary.totalAmount}</span>
                            </div>
                        </div>
                        <div className="pt-4 flex items-center gap-2">
                            <CreditCard size={16} className="text-gray-500" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Method: {order.paymentMethod}</span>
                        </div>
                    </div>
                </div>
            </div>


            {showReviewModal && productId && <Modal isOpen={showReviewModal} onClose={handleCloseReviewModal} title={'Post Your Review'}>
                <ReviewForm productId={productId} />
            </Modal>}
        </div >
    );
};

export default MyOrderDetails;