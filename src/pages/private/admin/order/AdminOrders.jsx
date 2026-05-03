import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Eye, Search, X, User, MapPin, CreditCard, ShoppingBag, Send, Printer, RefreshCw, Loader2 } from 'lucide-react';
import moment from 'moment';
import api from '../../../../services/axios';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const [loadingOrderId, setLoadingOrderId] = useState(null);

    const [startDate, SetStartDate] = useState('')
    const [endDate, SetEndDate] = useState('')

    // মডাল স্টেট
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchOrders = async () => {
        setLoading(true);
        try {

            const params = {};

            // শুধুমাত্র যদি ভ্যালু থাকে তখনই অবজেক্টে অ্যাড হবে
            if (startDate) params.startDate = startDate;
            if (endDate) params.endDate = endDate;

            const { data } = await api.get('/api/orders/admin', { params });
            if (data.success) {
                setOrders(data.orders);
            }
        } catch (error) {
            console.error(error);
            toast.error("অর্ডার লোড করতে সমস্যা হয়েছে");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [startDate, endDate]);

    const handleUpdateStatus = async (orderId, newStatus) => {
        try {
            const { data } = await api.patch(`/api/orders/admin/${orderId}/status`, { status: newStatus });
            if (data.success) {
                toast.success(`অর্ডার স্ট্যাটাস: ${newStatus}`);
                fetchOrders()
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "আপডেট ফেইল হয়েছে");
        }
    };

    const filteredOrders = orders.filter(order => {
        const matchesSearch = order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.shippingAddress.phone.includes(searchTerm);
        const matchesStatus = statusFilter === 'all' || order.orderStatus === statusFilter;
        return matchesSearch && matchesStatus || [];
    });

    const getPaymentStatusStyle = (status) => {
        const styles = {
            pending: "bg-amber-100 text-amber-700 border border-amber-200",
            paid: "bg-emerald-100 text-emerald-700 border border-emerald-200",
            failed: "bg-rose-100 text-rose-700 border border-rose-200",
            refund_pending: "bg-sky-100 text-sky-700 border border-sky-200",
            refunded: "bg-purple-100 text-purple-700 border border-purple-200",
        };

        return styles[status] || "bg-gray-100 text-gray-700 border border-gray-200";
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

    const openDetails = (order) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    };

    const handlePrintAndPack = async (id) => {
        try {
            const response = await api.get(`/api/orders/admin/print/${id}`, {
                responseType: 'blob',
            });


            fetchOrders(); // স্ট্যাটাস আপডেট দেখানোর জন্য

            const file = new Blob([response.data], { type: 'application/pdf' });
            const fileURL = URL.createObjectURL(file);

            // Hidden Iframe logic for seamless printing
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.src = fileURL;
            document.body.appendChild(iframe);

            iframe.onload = () => {
                iframe.contentWindow.focus();
                iframe.contentWindow.print();
                // কিছু সময় পর মেমোরি ক্লিনআপ
                setTimeout(() => {
                    URL.revokeObjectURL(fileURL);
                    document.body.removeChild(iframe);
                }, 1000);
            };
        } catch (error) {
            toast.error("Printing failed. Please try again.");
            console.error("Print failed", error);
        }
    };

    const handleShip = async (id) => {
        try {
            setLoadingOrderId(id);
            const response = await api.post(`/api/orders/admin/ship/${id}`);

            if (response.data.success) {
                toast.success("Order sent to Steadfast successfully!");
                fetchOrders();
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
            setLoadingOrderId(null);
        }
    };

    return (
        <div className="p-1 bg-gray-50 min-h-screen text-black">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Header Section */}
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <ShoppingBag className="text-violet-600" /> Order Management
                    </h1>
                    <p className="text-gray-500 text-sm font-medium">Manage your shops orders ({orders?.length || 0})</p>
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
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="all">সব স্ট্যাটাস</option>
                    {['pending', 'processing', 'packed', 'shipped', 'delivered', 'cancelled'].map(st => (
                        <option key={st} value={st}>{st.toUpperCase()}</option>
                    ))}
                </select>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="table w-full text-left">
                        <thead className="bg-gray-50 text-gray-600 font-bold">
                            <tr>
                                <th className="py-4 px-6">SN</th>
                                <th>অর্ডার আইডি</th>
                                <th>কাস্টমার</th>
                                <th>টাকা ও পেমেন্ট</th>
                                <th>স্ট্যাটাস আপডেট</th>
                                <th className="text-right">অ্যাকশন</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredOrders?.length > 0 && filteredOrders.map((order, i) => (
                                <tr onClick={() => openDetails(order)} key={order._id} className="hover:bg-gray-50 transition-colors hover:cursor-pointer">
                                    <td className="px-6 text-black">{i + 1}</td>
                                    <td className='whitespace-nowrap'>
                                        <div className="font-mono font-bold text-primary text-sm">#{order.orderId}</div>
                                        <div className="text-[10px] text-gray-400">{moment(order.createdAt).format('lll')}</div>
                                    </td>
                                    <td className='whitespace-nowrap'>
                                        <div className="font-semibold text-gray-800">{order.shippingAddress.name}</div>
                                        <div className="text-xs text-gray-500">{order.shippingAddress.phone}</div>
                                    </td>
                                    <td className='whitespace-nowrap w-48 text-center'>
                                        <div className="font-bold">৳{order.summary.totalAmount}</div>
                                        <div className={`text-[10px] font-bold uppercase p-1 ${getPaymentStatusStyle(order.paymentStatus)}`}>
                                            {order.paymentStatus} ({order.paymentMethod})
                                        </div>
                                    </td>
                                    <td className='whitespace-nowrap w-48 space-y-1' onClick={(e) => e.stopPropagation()}>
                                        <select
                                            className={` select select-xs select-bordered font-bold ${getOrderStatusStyle(order.orderStatus)}`}
                                            value={order.orderStatus}
                                            onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                                        >
                                            {['pending', 'processing', 'packed', 'shipped', 'delivered', 'cancelled'].map(st => (
                                                <option key={st} value={st}>{st.toUpperCase()}</option>
                                            ))}
                                        </select>

                                        {/* যদি অলরেডি শিপড হয়ে যায়, তবে ট্র্যাকিং আইডি দেখাতে পারেন */}
                                        {order.orderStatus === 'shipped' && (
                                            <p className="text-[10px] bg-blue-50 text-blue-600 px-2 py-1 rounded-full font-bold">
                                                TRK: {order.trackingId}
                                            </p>
                                        )}
                                    </td>
                                    <td className="flex gap-1 justify-end" onClick={(e) => e.stopPropagation()}>
                                        {order.orderStatus === 'packed' && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleShip(order._id);
                                                }}
                                                disabled={loadingOrderId === order._id}
                                                className="bg-pink-600 text-white p-2 rounded-xl font-bold hover:bg-green-700 transition-all"
                                            >
                                                {loadingOrderId === order._id ? (
                                                    <span className="loading loading-spinner loading-xs"></span>
                                                ) : (
                                                    <Send size={16} />
                                                )}
                                            </button>
                                        )}

                                        <button
                                            onClick={() => handlePrintAndPack(order._id)}
                                            className="bg-green-400 text-white p-2 rounded-xl font-bold hover:bg-green-700 transition-all"
                                        >
                                            <Printer size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* --- ORDER DETAILS MODAL --- */}
            {isModalOpen && selectedOrder && (
                <div className="fixed inset-0 z-100 flex items-center justify-center p-2 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl animate-in fade-in zoom-in duration-200">

                        {/* Modal Header */}
                        <div className="sticky top-0 bg-white p-6 border-b border-gray-100 flex justify-between items-center z-10">
                            <div>
                                <h2 className="text-xl font-bold flex items-center gap-2 text-black">
                                    ডিটেইলস <span className="text-primary font-mono text-base">#{selectedOrder.orderId}</span>
                                </h2>
                                <p className="text-xs text-gray-400">অর্ডার সময়: {moment(selectedOrder.createdAt).format('LLLL')}</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="btn btn-circle btn-ghost btn-sm text-black">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-8">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                                {/* 1. Customer & Shipping Info */}
                                <div className="space-y-6">
                                    <section>
                                        <h3 className="flex items-center gap-2 font-bold text-gray-800 mb-3 text-sm uppercase tracking-wider">
                                            <User size={16} className="text-primary" /> কাস্টমার ইনফো
                                        </h3>
                                        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                            <p className="font-bold text-black">{selectedOrder.userId?.name || selectedOrder.shippingAddress.name}</p>
                                            <p className="text-sm text-black">{selectedOrder.userId?.email || 'No email provided'}</p>
                                            <p className="text-sm text-black font-semibold mt-1">{selectedOrder.shippingAddress.phone}</p>
                                        </div>
                                    </section>

                                    <section>
                                        <h3 className="flex items-center gap-2 font-bold text-gray-800 mb-3 text-sm uppercase tracking-wider">
                                            <MapPin size={16} className="text-primary" /> শিপিং ঠিকানা
                                        </h3>
                                        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-sm leading-relaxed  text-black">
                                            <p>{selectedOrder.shippingAddress.name}</p>
                                            <p>{selectedOrder.shippingAddress.phone}</p>
                                            <p>{selectedOrder.shippingAddress.street}</p>
                                            <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} - {selectedOrder.shippingAddress.zip}</p>
                                            <p className="font-semibold text-primary">{selectedOrder.shippingAddress.country}</p>
                                        </div>
                                    </section>

                                    <section>
                                        <h3 className="flex items-center gap-2 font-bold text-gray-800 mb-3 text-sm uppercase tracking-wider">
                                            <CreditCard size={16} className="text-primary" /> পেমেন্ট সামারি
                                        </h3>
                                        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-sm space-y-1  text-black">
                                            <div className="flex justify-between"><span>মেথড:</span> <span className="font-bold uppercase">{selectedOrder.paymentMethod}</span></div>
                                            <div className="flex justify-between"><span>স্ট্যাটাস:</span>
                                                <span className={`font-bold uppercase ${selectedOrder.paymentStatus === 'paid' ? 'text-emerald-600' : 'text-rose-500'}`}>
                                                    {selectedOrder.paymentStatus}
                                                </span>
                                            </div>
                                        </div>
                                    </section>
                                </div>

                                {/* 2. Items List */}
                                <div className="md:col-span-2 space-y-4">
                                    <section>
                                        <h3 className="flex items-center gap-2 font-bold text-gray-800 mb-3 text-sm uppercase tracking-wider">
                                            <ShoppingBag size={16} className="text-primary" /> অর্ডার করা পণ্যসমূহ
                                        </h3>
                                        <div className="border border-gray-100 rounded-2xl overflow-hidden  text-black">
                                            <table className="table w-full">
                                                <thead className="bg-gray-50">
                                                    <tr className=' text-black'>
                                                        <th>প্রোডাক্ট</th>
                                                        <th>পরিমাণ</th>
                                                        <th className="text-right">মূল্য</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {selectedOrder.items.map((item, idx) => (
                                                        <tr key={idx}>
                                                            <td>
                                                                <div className="font-bold text-gray-800">{item.name}</div>
                                                                <div className="text-[10px] flex gap-2 mt-1">
                                                                    <span className="bg-white border px-1.5 py-0.5 rounded uppercase"> {item.variant.size}</span>
                                                                    <span className="bg-white border px-1.5 py-0.5 rounded uppercase"> {item.variant.color}</span>
                                                                </div>
                                                            </td>
                                                            <td className="font-semibold text-center">x {item.quantity}</td>
                                                            <td className="text-right font-bold">৳{item.price * item.quantity}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </section>

                                    {/* 3. Billing Summary */}
                                    <div className="bg-gray-900 text-white p-6 rounded-3xl ml-auto md:w-80 shadow-xl">
                                        <div className="space-y-3 text-sm">
                                            <div className="flex justify-between opacity-70"><span>Subtotal:</span> <span>৳{selectedOrder.summary.subtotal}</span></div>
                                            <div className="flex justify-between opacity-70"><span>Shipping:</span> <span>৳{selectedOrder.summary.shippingCharge}</span></div>
                                            <div className="flex justify-between opacity-70"><span>Discount:</span> <span className="text-rose-400">-৳{selectedOrder.summary.discount}</span></div>
                                            <div className="divider border-white/10 my-1"></div>
                                            <div className="flex justify-between text-lg font-bold">
                                                <span>Grand Total:</span>
                                                <span className="text-primary-focus">৳{selectedOrder.summary.totalAmount}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminOrders;