import { useEffect, useMemo, useState } from "react";
import api from "../../../services/axios";
import { Download, Trash2, CreditCard, Loader2, Calendar, Hash, DollarSign, X, RefreshCw, Search, Filter } from "lucide-react";
import toast from "react-hot-toast";

const MyPayments = () => {
    const [payments, setPayments] = useState([]);

    const [startDate, SetStartDate] = useState('')
    const [endDate, SetEndDate] = useState('')

    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");

    const [loading, setLoading] = useState(true);

    const fetchPayments = async () => {
        try {
            const params = {};

            // শুধুমাত্র যদি ভ্যালু থাকে তখনই অবজেক্টে অ্যাড হবে
            if (startDate) params.startDate = startDate;
            if (endDate) params.endDate = endDate;

            const { data } = await api.get("/api/payments", { params });
            setPayments(data.payments);
        } catch (err) {
            console.error(err);
            toast.error("পেমেন্ট হিস্ট্রি লোড করা সম্ভব হয়নি");
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchPayments();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [startDate, endDate]);

    const filteredPayments = useMemo(() => {
        return payments.filter((p) => {
            const matchesSearch =
                p.userId?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p._id.includes(searchTerm);
            const matchesStatus = filterStatus === "all" || p.status === filterStatus;
            return matchesSearch && matchesStatus;
        });
    }, [searchTerm, filterStatus, payments]);


    const handleDownload = async (id) => {
        try {
            toast.loading("Downloading Invoice...", { id: "download" });
            const res = await api.get(`/api/payments/download-invoice/${id}`, { responseType: "blob" });
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `invoice-${id}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            toast.success("Downloaded!", { id: "download" });
        } catch (error) {
            console.error(error);
            toast.error("ডাউনলোড ব্যর্থ হয়েছে", { id: "download" });
        }
    };

    const getStatusStyle = (status) => {
        switch (status?.toLowerCase()) {
            case 'paid': return 'bg-green-100 text-green-700 border-green-200';
            case 'pending': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'failed': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-64">
            <Loader2 className="animate-spin text-gray-400 mb-2" size={32} />
            <p className="text-xs font-black uppercase tracking-widest text-gray-400">Loading History</p>
        </div>
    );

    return (
        <div className="container mx-auto p-1 space-y-6 max-h-screen bg-gray-50">

            {/* Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Header Section */}
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <DollarSign className="text-violet-600" />Payment History
                    </h1>
                    <p className="text-gray-500 text-sm font-medium">Transaction History & invoices ({payments?.length || 0})</p>
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
                                onClick={() => fetchPayments()}
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="relative md:col-span-2">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by User, Email or Transaction ID..."
                        className="w-full pl-10 pr-4 py-2 text-black bg-gray-50 border-none rounded-lg focus:ring-2 focus:ring-violet-500 text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="relative">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <select
                        className="w-full pl-10 pr-4 text-black py-2 bg-gray-50 border-none rounded-lg focus:ring-2 focus:ring-violet-500 text-sm appearance-none"
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

            <div className="bg-white border-b md:border border-gray-100 shadow-sm overflow-hidden">

                {/* Desktop View (Table) */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50/50">
                            <tr>
                                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Transaction</th>
                                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Amount</th>
                                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Date</th>
                                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {payments.map((p) => (
                                <tr key={p._id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-8 py-5">
                                        <p className="text-xs font-mono font-bold text-gray-600 uppercase">{p.transactionId || '---'}</p>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase">{p.paymentMethod}</p>
                                    </td>
                                    <td className="px-8 py-5 font-black text-gray-900">৳{p.amount}</td>
                                    <td className="px-8 py-5">
                                        <span className={`text-[9px] font-black uppercase px-2 py-1 rounded-md border ${getStatusStyle(p.status)}`}>
                                            {p.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-xs font-bold text-gray-400">
                                        {new Date(p.createdAt).toLocaleDateString('en-GB')}
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        {p.status == 'paid' && <button onClick={() => handleDownload(p._id)} className="p-2 hover:bg-black hover:text-white rounded-lg transition-all text-gray-400">
                                            <Download size={16} />
                                        </button>}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile View (Card Layout) */}
                <div className="md:hidden divide-y divide-gray-50 bg-gray-50/30">
                    {filteredPayments.map((p) => (
                        <div key={p._id} className="p-6 bg-white active:bg-gray-50 transition-colors">
                            <div className="flex justify-between items-start mb-4">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <Hash size={12} className="text-gray-400" />
                                        <span className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-tight">
                                            {p.transactionId || 'N/A'}...
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-black text-gray-900">৳{p.amount}</h3>
                                </div>
                                <span className={`text-[9px] font-black uppercase px-3 py-1.5 rounded-full border ${getStatusStyle(p.status)}`}>
                                    {p.status}
                                </span>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-1.5 text-gray-400">
                                        <Calendar size={14} />
                                        <span className="text-[10px] font-bold uppercase">{new Date(p.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-gray-400">
                                        <CreditCard size={14} />
                                        <span className="text-[10px] font-bold uppercase">{p.paymentMethod}</span>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleDownload(p._id)}
                                        className="w-10 h-10 flex items-center justify-center bg-gray-900 text-white rounded-xl active:scale-90 transition-transform shadow-lg shadow-gray-200"
                                    >
                                        <Download size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {payments.length === 0 && (
                    <div className="p-20 text-center text-gray-400 font-bold uppercase text-[10px] tracking-widest">
                        No payment records found
                    </div>
                )}
            </div>
        </div>
    );
}

export default MyPayments;