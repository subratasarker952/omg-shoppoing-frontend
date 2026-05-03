import React, { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { Timer, Trash2, Plus, Loader2, Calendar, Edit3, X, Search, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../../../../services/axios';
import moment from 'moment';
import { scrollTOTop } from '../../../../utils/helperFunction';

const AdminFlashSale = () => {
    const [sales, setSales] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editId, setEditId] = useState(null); // এডিট মোড ট্র্যাক করার জন্য

    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

    const fetchData = async () => {
        try {
            const [salesRes, productsRes] = await Promise.all([
                api.get('/api/flash-sales'),
                api.get('/api/products')
            ]);
            setSales(salesRes.data.sales);
            setProducts(productsRes.data.products);
        } catch (error) {
            console.error(error);
            toast.error("ডাটা লোড করতে সমস্যা হয়েছে");
        }
    };

    useEffect(() => { fetchData(); }, []);

    // এডিট মোড চালু করার ফাংশন
    const handleEdit = (sale) => {
        setEditId(sale._id);
        setValue("title", sale.title);
        setValue("discountPercentage", sale.discountPercentage);
        setValue("status", sale.status);

        // HTML datetime-local ইনপুট ফরমেটে কনভার্ট করা (YYYY-MM-DDTHH:mm)
        const start = new Date(sale.startTime).toISOString().slice(0, 16);
        const end = new Date(sale.endTime).toISOString().slice(0, 16);

        setValue("startTime", start);
        setValue("endTime", end);

        const productIds = sale.products?.map(p => p._id || p);
        setValue("products", productIds);
        scrollTOTop()
    };

    const cancelEdit = () => {
        setEditId(null);
        reset();
    };

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            if (editId) {
                // আপডেট এপিআই কল
                await api.put(`/api/flash-sales/${editId}`, data);
                toast.success("ফ্ল্যাশ সেল আপডেট হয়েছে!");
            } else {
                // নতুন তৈরি করা
                await api.post('/api/flash-sales', data);
                toast.success("ফ্ল্যাশ সেল তৈরি হয়েছে!");
            }
            cancelEdit();
            fetchData();
        } catch (error) {
            toast.error(error.response?.data?.message || "Error saving sale");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("আপনি কি নিশ্চিতভাবে এটি ডিলিট করতে চান?")) return;
        try {
            await api.delete(`/api/flash-sales/${id}`);
            toast.success("Deleted successfully");
            fetchData();
        } catch (error) {
            console.error(error);
            toast.error("Delete failed");
        }
    };

    const [searchTerm, setSearchTerm] = useState("");

    // স্ট্যাটাস লজিক (Live/Upcoming/Expired)
    const getSaleStatus = (startTime, endTime, status) => {
        if (status === 'inactive') return { label: 'Paused', color: 'bg-slate-100 text-slate-500', icon: <AlertCircle size={12} /> };
        const now = new Date();
        if (now < new Date(startTime)) return { label: 'Upcoming', color: 'bg-blue-100 text-blue-600', icon: <Clock size={12} /> };
        if (now > new Date(endTime)) return { label: 'Expired', color: 'bg-red-100 text-red-600', icon: <X size={12} /> };
        return { label: 'Live Now', color: 'bg-green-100 text-green-600', icon: <CheckCircle2 size={12} /> };
    };

    // প্রোডাক্ট ফিল্টারিং লজিক (Search inside Form)
    const filteredProducts = useMemo(() => {
        return products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [products, searchTerm]);

    return (
        <div className="p-2 container mx-auto space-y-4 bg-gray-50 min-h-screen">
            <div>
                <h2 className="text-2xl font-bold flex items-center gap-2 text-slate-900">
                    <Timer className="text-primary" /> Flash Sale Manager
                </h2>
                <p className="text-slate-500 text-sm">Create and manage limited time offers ({sales?.length || 0})</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* ----------------- FORM SECTION ----------------- */}
                <div className="lg:col-span-4">
                    <form onSubmit={handleSubmit(onSubmit)} className={`bg-white p-6 rounded-2xl shadow-lg border transition-all duration-300 sticky top-24 ${editId ? 'border-primary/30 ring-1 ring-primary/10' : 'border-slate-100'}`}>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-lg text-slate-700">
                                {editId ? 'Update Campaign' : 'New Campaign'}
                            </h3>
                            {editId && (
                                <button type="button" onClick={cancelEdit} className="text-red-500 transition-colors">
                                    <X size={20} />
                                </button>
                            )}
                        </div>

                        <div className=" space-y-4">
                            <div>
                                <label className="text-xs font-bold uppercase text-slate-500">Campaign Title</label>
                                <input {...register("title", { required: "Title is required" })} className="w-full mt-1 p-3 text-black bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20" placeholder="e.g. Eid Dhamaka" />
                                {errors.title && <p className="text-red-500 text-[10px] mt-1">{errors.title.message}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold uppercase text-slate-500">Discount %</label>
                                    <input type="number" {...register("discountPercentage", { required: true })} className="w-full mt-1 p-3 text-black bg-slate-50 border border-slate-200 rounded-xl outline-none" placeholder="20" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold uppercase text-slate-500">Status</label>
                                    <select {...register("status")} className="w-full mt-1 p-3 text-black bg-slate-50 border border-slate-200 rounded-xl outline-none">
                                        <option value="inactive">Inactive</option>
                                        <option value="active">Active</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <label className="text-xs font-bold uppercase text-slate-500 flex items-center gap-1"><Calendar size={14} /> Start Time</label>
                                    <input type="datetime-local" {...register("startTime", { required: true })} className="w-full mt-1 p-3 text-black bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold uppercase text-slate-500 flex items-center gap-1"><Calendar size={14} /> End Time</label>
                                    <input type="datetime-local" {...register("endTime", { required: true })} className="w-full mt-1 p-3 text-black bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm" />
                                </div>
                            </div>

                            {/* MODERN MULTI-SELECT SECTION */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-slate-500">Select Products</label>
                                <div className="relative mb-2">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 z-10" size={14} />
                                    <input
                                        type="text"
                                        placeholder="Search products..."
                                        className="input input-bordered pl-10 w-full text-black focus:ring-primary h-11 bg-white rounded-2xl shadow-sm"
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <div className="max-h-48 overflow-y-auto pr-2 space-y-1 scrollbar-thin scrollbar-thumb-slate-200">
                                    {filteredProducts.map(p => (
                                        <label key={p._id} className="flex items-center gap-3 p-2.5 rounded-xl cursor-pointer transition-colors group">
                                            <input
                                                type="checkbox"
                                                value={p._id}
                                                {...register("products")}
                                                className="w-8 h-8 rounded-md dark:bg-gray-50"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-bold text-slate-700 truncate">{p.name}</p>
                                                <p className="text-[10px] text-slate-400 font-bold tracking-tighter">৳{p.basePrice}</p>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <button disabled={loading} className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-sm shadow-lg transition-all flex justify-center items-center gap-2 ${editId ? 'bg-primary text-white shadow-primary/20' : 'bg-slate-900 text-white shadow-slate-900/20'}`}>
                                {loading ? <Loader2 className="animate-spin" /> : editId ? 'Update Campaign' : 'Launch Sale'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* ----------------- LIST SECTION ----------------- */}
                <div className="lg:col-span-8 space-y-5">
                    {sales?.map((sale) => {
                        const status = getSaleStatus(sale.startTime, sale.endTime, sale.status);

                        return (
                            <div key={sale._id} className={`group bg-white p-6 rounded-2xl border-none shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col md:flex-row gap-6 items-center ${editId === sale._id ? 'ring-2 ring-primary ring-offset-4' : ''}`}>

                                {/* Discount Badge Circle */}
                                <div className="w-32 h-32 rounded-full bg-slate-900 text-white flex flex-col items-center justify-center shrink-0 border-[6px] border-slate-50 shadow-xl">
                                    <span className="text-3xl font-black leading-none">{sale.discountPercentage}%</span>
                                    <span className="text-[8px] font-bold uppercase opacity-60">OFF</span>
                                </div>

                                <div className="flex-1 space-y-3 w-full text-center md:text-left">
                                    <div className="flex flex-col md:flex-row md:items-center gap-3">
                                        <h4 className="font-black text-xl text-slate-800 leading-none tracking-tight uppercase">{sale.title}</h4>
                                        <span className={`inline-flex items-center gap-1.5 self-center md:self-auto px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${status.color}`}>
                                            {status.icon} {status.label}
                                        </span>
                                    </div>

                                    <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 text-slate-400">
                                        <div className="flex items-center gap-1.5 text-xs font-bold bg-slate-50 px-3 py-1.5 rounded-full">
                                            <Calendar size={14} className="text-primary" />
                                            {moment(sale.startTime).format('MMM D, h:mm A')} - {moment(sale.endTime).format('h:mm A')}
                                        </div>
                                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                                            <CheckCircle2 size={14} className="text-green-500" />
                                            {sale.products?.length || 0} Products
                                        </div>
                                    </div>

                                    {/* Selected Product Stack */}
                                    <div className="flex justify-center md:justify-start -space-x-3 overflow-hidden p-1">
                                        {sale.products?.slice(0, 6).map((p, idx) => (
                                            <div key={idx} className="w-10 h-10 rounded-full border-2 border-white overflow-hidden shadow-sm bg-slate-100 ring-1 ring-slate-100">
                                                <img src={p.images[0]?.url} className="w-full h-full object-cover" alt="" />
                                            </div>
                                        ))}
                                        {sale.products?.length > 6 && (
                                            <div className="w-10 h-10 rounded-full border-2 border-white bg-slate-800 text-white flex items-center justify-center text-[10px] font-black">
                                                +{sale.products.length - 6}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex md:flex-col gap-2 w-full md:w-auto">
                                    <button onClick={() => handleEdit(sale)} className="flex-1 p-4 bg-slate-50 text-slate-600 rounded-2xl hover:bg-primary hover:text-white transition-all shadow-sm flex justify-center items-center gap-2">
                                        <Edit3 size={18} /> <span className='md:hidden'>Edit</span>
                                    </button>
                                    <button onClick={() => handleDelete(sale._id)} className="flex-1 p-4 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-sm flex justify-center items-center gap-2">
                                        <Trash2 size={18} /> <span className='md:hidden'>Delete</span>
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

        </div>
    );
};

export default AdminFlashSale;