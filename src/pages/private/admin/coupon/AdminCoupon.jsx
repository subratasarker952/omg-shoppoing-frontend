import React, { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { Ticket, Trash2, Plus, Loader2, Calendar, DollarSign, Percent, ShieldCheck, Users, Edit3, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import moment from 'moment'; // Import fixed
import api from '../../../../services/axios';
import CouponCard from './components/CouponCard';
import { scrollTOTop } from '../../../../utils/helperFunction';

const initialCouponValues = {
    code: '',
    discountType: 'percentage',
    discountAmount: "",
    minOrderAmount: 1000,
    maxDiscountAmount: 500,
    usageLimit: 100,
    isActive: true,
    allowOnFlashSale: false,
    expiryDate: ''
};

const AdminCoupons = () => {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingId, setEditingId] = useState(null); // এডিট মুড ট্র্যাক করার জন্য

    const { register, handleSubmit, reset, watch, formState: { errors } } = useForm({
        defaultValues: initialCouponValues
    });

    const discountType = watch("discountType");

    // ১. কুপনগুলোকে দুই ভাগে ভাগ করা (Memoized for performance)
    const { activeCoupons, expiredCoupons } = useMemo(() => {
        const active = [];
        const expired = [];
        const now = moment();

        coupons.forEach(c => {
            const isExpired = moment(c.expiryDate).isBefore(now, 'day');
            const isLimitReached = c.usedCount >= c.usageLimit;

            if (isExpired || isLimitReached || !c.isActive) {
                expired.push(c);
            } else {
                active.push(c);
            }
        });
        return { activeCoupons: active, expiredCoupons: expired };
    }, [coupons]);

    const fetchCoupons = async () => {
        try {
            const { data } = await api.get('/api/coupons');
            setCoupons(data.coupons || []);
        } catch (err) {
            console.error(err);
            toast.error("কুপন লোড করতে সমস্যা হয়েছে");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchCoupons(); }, []);

    // ২. এডিট মুড হ্যান্ডলার
    const handleEdit = (coupon) => {
        setEditingId(coupon._id);
        reset({
            ...coupon,
            expiryDate: moment(coupon.expiryDate).format('YYYY-MM-DD')
        });
        scrollTOTop()
    };

    // ৩. ক্যান্সেল বা রিসেট করার সময় explicit ভ্যালু দিন
    const cancelEdit = () => {
        setEditingId(null);
        reset(initialCouponValues); // এখানে initialValues পাঠিয়ে দিন
    };

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        try {
            if (editingId) {
                await api.put(`/api/coupons/${editingId}`, data);
                toast.success("কুপন আপডেট হয়েছে!");
            } else {
                await api.post('/api/coupons', data);
                toast.success("নতুন কুপন তৈরি হয়েছে!");
            }
            setEditingId(null);
            reset(initialCouponValues);
            fetchCoupons();
        } catch (err) {
            toast.error(err.response?.data?.message || "অপারেশন ব্যর্থ হয়েছে");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("আপনি কি নিশ্চিতভাবে এই কুপনটি ডিলিট করতে চান?")) return;
        try {
            await api.delete(`/api/coupons/${id}`);
            toast.success("কুপন ডিলিট করা হয়েছে");
            fetchCoupons();
        } catch (err) {
            console.error(err);
            toast.error("ডিলিট করা সম্ভব হয়নি");
        }
    };

    if (loading) return <div className="flex justify-center mt-20"><Loader2 className="animate-spin text-violet-600" size={40} /></div>;

    return (
        <div className="container mx-auto p-2 space-y-4 min-h-screen bg-gray-50">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <Ticket className={"text-violet-400"} />
                    Coupon Management
                </h2>
                <p className="text-gray-400 text-sm font-medium">Manage Your System Coupons ({coupons?.length || 0})</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Form Section */}
                <div className="lg:col-span-4">
                    <form onSubmit={handleSubmit(onSubmit)} className="bg-white px-4 py-10 text-black rounded-4xl border border-gray-100 space-y-6 sticky top-6 shadow-md">
                        <div className="flex justify-between items-center border-b border-gray-50 pb-4">
                            <h3 className="font-black text-gray-800 uppercase text-sm tracking-widest flex items-center pl-2 gap-2">
                                {editingId ? <Edit3 size={18} className="text-blue-600" /> : <Plus size={18} className="text-violet-600" />}
                                {editingId ? "Modify Coupon" : "Create Coupon"}
                            </h3>
                            {editingId && (
                                <button type="button" onClick={cancelEdit} className="text-rose-500 hover:bg-rose-50 p-1 rounded-full transition-colors"><XCircle size={22} /></button>
                            )}
                        </div>

                        {/* Code Input */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Unique Code</label>
                            <input
                                {...register("code", { required: "Code is required" })}
                                placeholder="PROMO2026"
                                className="w-full p-4 text-gray-900 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-violet-500 focus:bg-white outline-none uppercase font-black tracking-widest transition-all shadow-inner"
                            />
                            {errors.code && <p className='text-rose-500 text-[10px] font-bold mt-1 ml-1'>{errors.code.message}</p>}
                        </div>

                        {/* Grid Inputs */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Discount Type</label>
                                <select {...register("discountType")} className="w-full p-4 bg-gray-50 rounded-2xl outline-none font-bold text-sm border-2 border-transparent focus:border-violet-500 transition-all">
                                    <option value="percentage">Percent (%)</option>
                                    <option value="fixed">Fixed (৳)</option>
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase text-gray-400 ml-1">
                                    {discountType === 'percentage' ? 'Amount %' : 'Amount ৳'}
                                </label>
                                <input type="number" {...register("discountAmount", { required: true })} className="w-full p-4 bg-gray-50 rounded-2xl outline-none font-black border-2 border-transparent focus:border-violet-500 transition-all shadow-inner" />
                            </div>
                        </div>

                        {/* Limits and Expiry */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Min Spend (৳)</label>
                                <input type="number" {...register("minOrderAmount")} className="w-full p-4 bg-gray-50 rounded-2xl outline-none font-bold text-sm" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Max Cap (৳)</label>
                                <input
                                    type="number"
                                    {...register("maxDiscountAmount")}
                                    disabled={discountType === 'fixed'}
                                    className={`w-full p-4 rounded-2xl outline-none font-bold text-sm transition-all ${discountType === 'fixed' ? 'bg-gray-100 opacity-50 cursor-not-allowed text-gray-400' : 'bg-gray-50'}`}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Usage Cap</label>
                                <input type="number" {...register("usageLimit")} className="w-full p-4 bg-gray-50 rounded-2xl outline-none font-bold text-sm" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Valid Until</label>
                                <input type="date" {...register("expiryDate", { required: true })} className="w-full p-4 bg-gray-50 rounded-2xl outline-none font-bold text-sm" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {/* Is Active Field */}
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Is Active</label>
                                <select
                                    {...register("isActive")}
                                    className="w-full p-4 bg-gray-50 rounded-2xl outline-none font-bold text-sm appearance-none cursor-pointer"
                                >
                                    <option value={true}>Active</option>
                                    <option value={false}>Inactive</option>
                                </select>
                            </div>

                            {/* Allow On Flash Sale Field */}
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Allow On Flash Sale</label>
                                <select
                                    {...register("allowOnFlashSale")}
                                    className="w-full p-4 bg-gray-50 rounded-2xl outline-none font-bold text-sm appearance-none cursor-pointer"
                                >
                                    <option value={false}>No (Restricted)</option>
                                    <option value={true}>Yes (Allowed)</option>
                                </select>
                            </div>
                        </div>

                        <button
                            disabled={isSubmitting}
                            className={`w-full p-4 rounded-2xl font-black uppercase tracking-[2px] transition-all flex justify-center items-center gap-2 shadow-md active:scale-95 disabled:opacity-50 
                                ${editingId ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-900 hover:bg-violet-600'} text-white`}
                        >
                            {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : editingId ? "Update Coupon" : "Release Coupon"}
                        </button>
                    </form>
                </div>

                {/* List Section */}
                <div className="lg:col-span-8 space-y-10 p-2">

                    {/* Active Section */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <h3 className="font-black text-gray-800 uppercase text-xs tracking-[3px]">Active Campaigns</h3>
                            <div className="h-px flex-1 bg-gray-100"></div>
                            <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-black">{activeCoupons.length}</span>
                        </div>

                        {activeCoupons.length === 0 ? (
                            <div className="bg-white border-4 border-dashed border-gray-50 rounded-4xl py-16 text-center text-gray-300 font-bold uppercase text-sm tracking-widest">
                                No Active Campaigns Found
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {activeCoupons.map(coupon => <CouponCard handleEdit={handleEdit} handleDelete={handleDelete} key={coupon._id} coupon={coupon} type="active" />)}
                            </div>
                        )}
                    </div>

                    {/* Expired Section */}
                    <div className="space-y-6 opacity-80 hover:opacity-100 transition-opacity">
                        <div className="flex items-center gap-4">
                            <h3 className="font-black text-gray-400 uppercase text-xs tracking-[3px]">Past Campaigns</h3>
                            <div className="h-px flex-1 bg-gray-100"></div>
                            <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-[10px] font-black">{expiredCoupons.length}</span>
                        </div>

                        {expiredCoupons.length === 0 ? (
                            <div className="bg-white border-2 border-dashed border-gray-50 rounded-3xl py-10 text-center text-gray-300 font-medium text-xs uppercase tracking-widest">
                                History is empty
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {expiredCoupons.map(coupon => <CouponCard handleEdit={handleEdit} handleDelete={handleDelete} key={coupon._id} coupon={coupon} type="expired" />)}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminCoupons;