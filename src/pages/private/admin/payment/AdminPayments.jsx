import React, { useEffect, useState } from "react";
import api from "../../../../services/axios";
import {
    Download,
    Search,
    Filter,
    CreditCard,
    Calendar,
    Loader2,
    CheckCircle2,
    XCircle,
    Clock,
    X,
    ExternalLink,
    RefreshCcw,
    RefreshCw
} from "lucide-react";
import toast from "react-hot-toast";

const AdminPayments = () => {
    const [payments, setPayments] = useState([]);

    const [startDate, SetStartDate] = useState('')
    const [endDate, SetEndDate] = useState('')

    const [loading, setLoading] = useState(true);

    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");

    const [selectedPayment, setSelectedPayment] = useState(null);
    const [showModal, setShowModal] = useState(false);

    // ডিটেইলস দেখার ফাংশন
    const handleViewDetails = (payment) => {
        setSelectedPayment(payment);
        setShowModal(true);
    };

    // ১. সকল পেমেন্ট ফেচ করা
    const fetchAllPayments = async () => {
        try {
            setLoading(true);
            const params = {};

            // শুধুমাত্র যদি ভ্যালু থাকে তখনই অবজেক্টে অ্যাড হবে
            if (startDate) params.startDate = startDate;
            if (endDate) params.endDate = endDate;

            const { data } = await api.get("/api/payments", {params}); // আপনার রাউট অনুযায়ী চেঞ্জ করুন
            if (data.success) {
                setPayments(data.payments);
            }
        } catch (error) {
            toast.error("Failed to fetch payments");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllPayments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [startDate, endDate]);

    // ২. ইনভয়েস ডাউনলোড লজিক
    const handleDownload = async (id) => {
        try {
            const res = await api.get(`/api/payments/download-invoice/${id}`, {
                responseType: "blob",
            });
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `invoice-${id}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            toast.success("Invoice downloading...");
        } catch (error) {
            console.error(error);
            toast.error("Download failed");
        }
    };

    const handleRefund = async (payment) => {
        const confirmRefund = window.confirm(
            `Are you sure you want to refund ${payment.currency} ${payment.amount}? This will also cancel the order and restore stock.`
        );

        if (!confirmRefund) return;

        const reason = prompt("Please enter a reason for the refund:");
        if (reason) {

            try {
                // লোডিং স্টেট সেট করুন (Optional)
                const { data } = await api.post(`/api/payments/admin/refund/${payment._id}`, {
                    refundReason: reason
                });

                if (data.success) {
                    toast.success("Refund successful!");
                    setShowModal(false); // মোডাল বন্ধ করুন
                    fetchAllPayments(); // লিস্ট রিফ্রেশ করুন
                }
            } catch (err) {
                toast.error(err.response?.data?.message || "Refund failed");
            }
        }
    };

    // ৩. সার্চ এবং ফিল্টার লজিক
    const filteredPayments = React.useMemo(() => {
        return payments.filter((p) => {
            const matchesSearch =
                p.userId?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p._id.includes(searchTerm);
            const matchesStatus = filterStatus === "all" || p.status === filterStatus;
            return matchesSearch && matchesStatus;
        });
    }, [searchTerm, filterStatus, payments]);

    // const [isRefunding, setIsRefunding] = useState(false);

    // const handleRefund = async (payment) => {
    //     // ... confirm and prompt logic
    //     try {
    //         setIsRefunding(true);
    //         // your api call...
    //     } finally {
    //         setIsRefunding(false);
    //     }
    // }

    const getStatusBadge = (status) => {
        const styles = {
            paid: "bg-green-100 text-green-700 border-green-200",
            pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
            failed: "bg-red-100 text-red-700 border-red-200",
            refunded: "bg-gray-100 text-gray-700 border-gray-200", // রিফান্ডেড অ্যাড করুন
        };
        const icons = {
            paid: <CheckCircle2 size={14} />,
            pending: <Clock size={14} />,
            failed: <XCircle size={14} />,
            refunded: <RefreshCcw size={14} />, // রিফান্ডেড আইকন
        };
        return (
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-[10px] font-bold uppercase tracking-tighter ${styles[status]}`}>
                {icons[status]} {status}
            </span>
        );
    };


    return (
        <div className="p-2 space-y-4 bg-gray-50 container mx-auto min-h-screen">
           {/* Header Section */}
           <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Header Section */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <CreditCard className="text-violet-600" /> Transaction Management
                    </h1>
                    <p className="text-sm text-gray-500">View and manage all system-wide payments ({payments?.length || 0})</p>
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
                                className="text-black outline-none text-xs sm:text-sm font-semibold bg-transparent cursor-pointer min-w-25"
                            />
                        </div>

                        {/* End Date */}
                        <div className="flex items-center gap-1">
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => SetEndDate(e.target.value)}
                                className="text-black outline-none text-xs sm:text-sm font-semibold bg-transparent cursor-pointer min-w-25"
                            />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-1 ml-auto">
                        {(startDate || endDate) ? (
                            <button
                                onClick={() => { SetStartDate(''); SetEndDate(''); }}
                                className="p-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-colors border border-red-100"
                                title="Clear Filters"
                            >
                                <X size={18} />
                            </button>
                        ) : (

                            <button
                                onClick={() => fetchAllPayments()}
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

            {/* Filters Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative md:col-span-2">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10" size={18} />
                    <input
                        type="text"
                        placeholder="Search by User, Email or Transaction ID..."
                        className="input input-bordered pl-10 w-full text-black focus:ring-primary h-11 bg-white rounded-2xl shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="relative">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <select
                        className="input input-bordered pl-10 w-full text-black focus:ring-primary h-11 bg-white rounded-2xl shadow-sm"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="all">All Status</option>
                        <option value="paid">Paid</option>
                        <option value="pending">Pending</option>
                        <option value="failed">Failed</option>
                        <option value="refunded">Refunded</option>
                    </select>
                </div>
            </div>

            {/* Table Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-xs font-bold uppercase tracking-wider">
                                <th className="p-4">Payment Info</th>
                                <th className="p-4">User Info</th>
                                <th className="p-4 text-center">Pay</th>
                                <th className="p-4 text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredPayments.length > 0 ? filteredPayments.map((p) => (
                                <tr
                                    onClick={() => handleViewDetails(p)}
                                    key={p._id}
                                    className="hover:bg-gray-50/50 transition-colors group text-black hover:cursor-pointer"
                                >
                                    <td className="p-4">
                                        <span className="text-xs font-mono text-gray-400">#{p._id}</span> <br />
                                        <div className="flex items-center gap-1 text-sm">
                                            <Calendar size={12} />
                                            {new Date(p.createdAt).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center font-bold text-xs">
                                                {p.userId?.name?.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-gray-800">{p.userId?.name}</p>
                                                <p className="text-xs text-gray-500">{p.userId?.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 font-bold text-gray-800 text-center">
                                        <div>
                                            <p className="text-sm font-semibold text-gray-800">{p.amount.toFixed(2)}</p>
                                            <p> {getStatusBadge(p.status)} </p>
                                        </div>
                                    </td>

                                    <td className="p-4 whitespace-nowrap">
                                        <div className="flex flex-col items-end">
                                            <p className="text-sm font-black text-black">
                                                {p.currency} {p.amount.toFixed(2)}
                                            </p>
                                            <p className="text-[11px] text-black font-bold uppercase tracking-tight">
                                                Net: {p.metadata?.store_amount || p.amount} {p.currency}
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="7" className="px-6 py-10 text-center text-gray-400">
                                        No payments found matching your criteria.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>


            {/* --- Details Modal --- */}
            {showModal && selectedPayment && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
                        {/* Modal Header */}
                        <div className="bg-violet-600 p-6 text-white flex justify-between items-center">
                            <div>
                                <h3 className="text-xl font-bold">Transaction Details</h3>
                                <p className="text-violet-100 text-xs mt-1">ID: {selectedPayment._id}</p>
                            </div>
                            <button onClick={() => setShowModal(false)} className="hover:bg-white/20 p-2 rounded-full transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
                            {/* User Info Section */}
                            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                                <div className="w-12 h-12 bg-violet-100 text-violet-600 rounded-full flex items-center justify-center font-bold text-lg">
                                    {selectedPayment.userId?.name?.charAt(0)}
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 font-medium">Customer</p>
                                    <h4 className="font-bold text-gray-800">{selectedPayment.userId?.name}</h4>
                                    <p className="text-xs text-gray-500">{selectedPayment.userId?.email}</p>
                                </div>
                            </div>

                            {/* Primary Payment Info */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="border border-gray-100 p-3 rounded-lg bg-white shadow-sm">
                                    <p className="text-[10px] uppercase font-bold text-gray-400">Total Amount</p>
                                    <p className="text-lg font-black text-violet-600">{selectedPayment.currency} {selectedPayment.amount}</p>
                                </div>
                                <div className="border border-gray-100 p-3 rounded-lg bg-white shadow-sm">
                                    <p className="text-[10px] uppercase font-bold text-gray-400">Method</p>
                                    <p className="text-sm font-bold text-gray-700 uppercase">{selectedPayment.paymentMethod}</p>
                                </div>
                            </div>

                            {/* --- SSLCommerz Specific Technical Details --- */}
                            {selectedPayment.paymentMethod === 'sslcommerz' && selectedPayment.metadata && (
                                <div className="space-y-3">
                                    <h5 className="text-[11px] font-black uppercase tracking-widest text-gray-400 border-b pb-2">Technical Gateway Info</h5>

                                    <div className="grid grid-cols-1 gap-2">
                                        {/* ব্যাংক ও কার্ড ডিটেইলস */}
                                        <div className="flex justify-between text-xs p-2 bg-gray-50 rounded">
                                            <span className="text-gray-500">Bank Tran ID:</span>
                                            <span className="font-mono font-bold text-gray-700">{selectedPayment.metadata.bank_tran_id}</span>
                                        </div>

                                        <div className="flex justify-between text-xs p-2 bg-gray-50 rounded">
                                            <span className="text-gray-500">Card Issuer:</span>
                                            <span className="font-bold text-gray-700">{selectedPayment.metadata.card_issuer}</span>
                                        </div>

                                        <div className="flex justify-between text-xs p-2 bg-gray-50 rounded">
                                            <span className="text-gray-500">Card Type:</span>
                                            <span className="font-bold text-gray-700">{selectedPayment.metadata.card_type}</span>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="p-2 bg-blue-50 rounded">
                                                <p className="text-[9px] text-blue-400 uppercase font-bold">Store Amount</p>
                                                <p className="font-bold text-blue-700">{selectedPayment.metadata.store_amount} BDT</p>
                                            </div>
                                            <div className="p-2 bg-orange-50 rounded">
                                                <p className="text-[9px] text-orange-400 uppercase font-bold">Risk Level</p>
                                                <p className="font-bold text-orange-700">{selectedPayment.metadata.risk_title} ({selectedPayment.metadata.risk_level})</p>
                                            </div>
                                        </div>

                                        <div className="flex justify-between text-xs p-2 border-t border-dashed mt-2">
                                            <span className="text-gray-500">Gateway Status:</span>
                                            <span className="font-black text-green-600 uppercase">{selectedPayment.metadata.status}</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Transaction Footer Info */}
                            <div className="text-[10px] text-gray-400 space-y-1 pt-4 border-t">
                                <p>Transaction ID: <span className="text-gray-600">{selectedPayment.transactionId}</span></p>
                                <p>Verified At: <span className="text-gray-600">{new Date(selectedPayment.updatedAt).toLocaleString()}</span></p>
                            </div>
                        </div>

                        {/* --- Stripe Specific Technical Details --- */}
                        {selectedPayment.paymentMethod === 'stripe' && selectedPayment.metadata && (
                            <div className=" space-y-4">
                                <h5 className="text-[11px] font-black uppercase tracking-widest text-blue-500 border-b border-blue-100 pb-2 flex items-center gap-2">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                                    Stripe Cloud Verification
                                </h5>

                                <div className="grid grid-cols-1 gap-3">
                                    {/* কার্ড ইনফো - যা কাস্টমার ট্রাস্ট বাড়ায় */}
                                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-white p-2 rounded shadow-sm">
                                                <CreditCard size={18} className="text-slate-600" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase">Card Details</p>
                                                <p className="text-sm font-black text-slate-700">
                                                    **** **** **** {selectedPayment.metadata.last4 || '4242'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] text-slate-400 font-bold uppercase">Network</p>
                                            <p className="text-xs font-bold text-slate-600 uppercase">{selectedPayment.metadata.brand || 'Visa'}</p>
                                        </div>
                                    </div>

                                    {/* ট্রানজ্যাকশন আইডি ও রিসিপ্ট */}
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-[11px] px-2">
                                            <span className="text-gray-400 font-bold">Payment Intent:</span>
                                            <span className="font-mono text-gray-600">{selectedPayment.metadata.id}</span>
                                        </div>

                                        <div className="flex justify-between text-[11px] px-2">
                                            <span className="text-gray-400 font-bold">Stripe Fee:</span>
                                            <span className="text-red-400">Included in processing</span>
                                        </div>

                                        {/* সরাসরি স্ট্রাইপ থেকে আসা রিসিপ্ট দেখার লিংক */}
                                        {selectedPayment.metadata.receipt_url && (
                                            <a
                                                href={selectedPayment.metadata.receipt_url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="mt-2 flex items-center justify-center gap-2 w-full py-2 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-tighter rounded-lg hover:bg-blue-100 transition-all border border-blue-100"
                                            >
                                                <ExternalLink size={12} /> View Official Stripe Receipt
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Modal Footer */}
                        <div className="p-6 bg-gray-50 flex gap-3">
                            {selectedPayment.status === 'paid' && (
                                <button
                                    onClick={() => handleRefund(selectedPayment)}
                                    className="flex-1 hover:cursor-pointer px-4 py-2 border border-red-200 bg-red-50 rounded-lg text-xs font-black uppercase text-red-600 hover:bg-red-100 transition-all flex items-center justify-center gap-2"
                                >
                                    <RefreshCcw size={14} /> Refund Payment
                                </button>
                            )}
                            <button
                                onClick={() => handleDownload(selectedPayment._id)}
                                className="flex-1 hover:cursor-pointer px-4 py-2 bg-violet-600 rounded-lg text-sm font-bold text-white hover:bg-violet-700 transition-colors flex items-center justify-center gap-2"
                            >
                                <Download size={16} /> Get Invoice
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPayments;