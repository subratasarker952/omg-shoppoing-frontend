import React, { useEffect, useState, useCallback } from 'react';
import { Copy, Ticket, Gift } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../../../services/axios';

const CouponSection = () => {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchCoupons = useCallback(async () => {
        try {
            setLoading(true);
            // active=true ফিল্টার পাঠানো হচ্ছে যাতে শুধুমাত্র কার্যকর কুপন আসে
            const { data } = await api.get('/api/coupons?active=true');
            setCoupons(data.coupons || []);
        } catch (err) {
            console.error("Coupon Fetch Error:", err);
            // প্রোডাকশনে সাইলেন্ট এরর রাখাই ভালো যদি কুপন না থাকে
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCoupons();
    }, [fetchCoupons]);

    const copyCode = (code) => {
        if (!code) return;
        navigator.clipboard.writeText(code);
        toast.success(`কুপন কোড "${code}" কপি হয়েছে!`, {
            style: { borderRadius: '10px', background: '#333', color: '#fff' }
        });
    };

    // যদি কোনো সক্রিয় কুপন না থাকে, তবে সেকশনটি দেখানোর প্রয়োজন নেই
    if (!loading && coupons.length === 0) return null;

    return (
        <section className="py-20 bg-slate-50/50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-black text-slate-900 flex items-center justify-center gap-3">
                        <Gift className="text-blue-600" /> অফার ও কুপন
                    </h2>
                    <p className="text-slate-500 mt-2">আপনার কেনাকাটায় অতিরিক্ত সাশ্রয় করতে কুপন ব্যবহার করুন</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {loading ? (
                        // Skeleton Loader
                        [1, 2].map(i => <div key={i} className="h-48 bg-slate-200 animate-pulse rounded-4xl"></div>)
                    ) : (
                        coupons.map((coupon) => (
                            <div 
                                key={coupon._id}
                                className="bg-blue-600 rounded-4xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden group hover:shadow-2xl hover:shadow-blue-200 transition-all duration-500"
                            >
                                {/* Ticket Edge Effect */}
                                <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full hidden sm:block"></div>
                                <div className="absolute -right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full hidden sm:block"></div>

                                <div className="text-center sm:text-left z-10">
                                    <div className="flex items-center justify-center sm:justify-start gap-2 text-blue-200 font-bold mb-3 tracking-widest uppercase text-xs">
                                        <Ticket size={16} /> {coupon.allowOnFlashSale ? "Flash Sale Eligible" : "Exclusive Discount"}
                                    </div>
                                    <h3 className="text-3xl font-black text-white leading-tight">
                                        {coupon.discountType === 'percentage' 
                                            ? `${coupon.discountAmount}%` 
                                            : `৳${coupon.discountAmount}`} ফ্ল্যাট ছাড়!
                                    </h3>
                                    <p className="text-blue-100 text-sm mt-2 font-medium opacity-90">
                                        সর্বনিম্ন ৳{coupon.minOrderAmount} এর অর্ডারে প্রযোজ্য
                                    </p>
                                </div>

                                <div className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-3xl flex flex-col items-center gap-3 z-10 min-w-55">
                                    <span className="text-blue-50 text-[10px] font-bold uppercase tracking-[0.2em]">Code</span>
                                    <div className="bg-white w-full py-3 px-5 rounded-2xl flex items-center justify-between shadow-xl">
                                        <span className="text-xl font-black text-slate-900 tracking-wider">
                                            {coupon.code}
                                        </span>
                                        <button 
                                            onClick={() => copyCode(coupon.code)}
                                            className="p-2 hover:bg-blue-50 rounded-xl text-blue-600 transition-all active:scale-90"
                                            title="Copy Code"
                                        >
                                            <Copy size={18} />
                                        </button>
                                    </div>
                                    <p className="text-blue-50 text-[10px] italic opacity-80">
                                        মেয়াদ শেষ: {new Date(coupon.expiryDate).toLocaleDateString('bn-BD')}
                                    </p>
                                </div>
                                
                                {/* Background Glow Decor */}
                                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all"></div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </section>
    );
};

export default CouponSection;