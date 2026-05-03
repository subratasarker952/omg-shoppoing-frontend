import React, { useState, useEffect, useCallback } from 'react';
import { Zap, Flame, ShoppingCart } from 'lucide-react';
import api from '../../../../services/axios';
import { useNavigate } from 'react-router-dom';

// ==========================================
// Sub-Component: প্রতিটি আলাদা সেলের জন্য
// ==========================================
// ১. একটি পিওর ফাংশন তৈরি করুন যা শুধুমাত্র সময় ক্যালকুলেট করে রিটার্ন করবে (স্টেট আপডেট করবে না)
const getRemainingTime = (endTime) => {
    if (!endTime) return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };

    const difference = +new Date(endTime) - +new Date();

    if (difference > 0) {
        return {
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60),
            isExpired: false,
        };
    }

    return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
};

const FlashSaleBlock = ({ sale }) => {
    // ২. Lazy Initial State: useState-এর ভেতরেই ফাংশন কল করে প্রাথমিক সময় সেট করা হলো
    // এতে কম্পোনেন্ট লোড হওয়ার সাথে সাথেই সঠিক সময় দেখাবে (১ সেকেন্ড ডিলে হবে না)
    const [timeLeft, setTimeLeft] = useState(() => getRemainingTime(sale?.endTime));
    const [isExpired, setIsExpired] = useState(() => getRemainingTime(sale?.endTime).isExpired);
    const navigate = useNavigate();

    useEffect(() => {
        // যদি অফার আগেই শেষ হয়ে থাকে, তাহলে টাইমার চালানোর দরকার নেই
        if (isExpired) return;

        const timer = setInterval(() => {
            const newTime = getRemainingTime(sale?.endTime);
            
            // স্টেট আপডেট
            setTimeLeft(newTime);

            // যদি টাইমার চলতে চলতে সময় শেষ হয়ে যায়
            if (newTime.isExpired) {
                setIsExpired(true);
                clearInterval(timer); // টাইমার বন্ধ করে দেওয়া
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [sale?.endTime, isExpired]);

    // ... (বাকি রেন্ডার লজিক হুবহু আগের মতোই থাকবে)
    if (isExpired) return null;

    return (
        <div className="mb-16 last:mb-0">
            {/* Header: Title & Timer */}
            <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-6">
                <div className="flex items-center gap-4">
                    <div className="bg-rose-500 p-3 rounded-2xl text-white shadow-lg shadow-rose-200 animate-bounce">
                        <Zap size={28} fill="currentColor" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                            {sale.title} <Flame size={24} className="text-orange-500" />
                        </h2>
                        <p className="text-rose-600 font-bold text-sm bg-rose-100 px-2 py-0.5 rounded-md inline-block mt-1">
                            স্পেশাল {sale.discountPercentage}% ডিসকাউন্ট!
                        </p>
                    </div>
                </div>

                {/* ডাইনামিক টাইমার (দিন সহ) */}
                <div className="flex items-center gap-3 bg-white p-2.5 rounded-2xl shadow-sm border border-rose-100">
                    <span className="text-slate-500 font-bold text-xs ml-2 uppercase tracking-wider">শেষ হতে বাকি:</span>
                    <div className="flex items-center gap-1.5">
                        {/* Days (যদি ১ দিনের বেশি হয় তবেই দেখাবে) */}
                        {timeLeft.days > 0 && (
                            <div className="flex items-center">
                                <div className="bg-rose-100 text-rose-600 min-w-12 h-12 rounded-xl flex flex-col items-center justify-center font-black shadow-inner">
                                    <span className="text-lg leading-none">{timeLeft.days.toString().padStart(2, '0')}</span>
                                    <span className="text-[9px] uppercase">দিন</span>
                                </div>
                                <span className="mx-1.5 font-bold text-slate-400 text-xl">:</span>
                            </div>
                        )}
                        
                        {/* Hours, Minutes, Seconds */}
                        {[
                            { label: 'ঘণ্টা', value: timeLeft.hours }, 
                            { label: 'মিনিট', value: timeLeft.minutes }, 
                            { label: 'সেকেন্ড', value: timeLeft.seconds }
                        ].map((unit, i) => (
                            <div key={i} className="flex items-center">
                                <div className="bg-slate-900 text-white min-w-12 h-12 rounded-xl flex flex-col items-center justify-center font-black shadow-lg">
                                    <span className="text-lg leading-none">{unit.value.toString().padStart(2, '0')}</span>
                                    <span className="text-[9px] text-slate-400 uppercase">{unit.label}</span>
                                </div>
                                {i < 2 && <span className="mx-1.5 font-bold text-slate-900 text-xl animate-pulse">:</span>}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {sale.products?.map(product => {
                    const originalPrice = product.variants?.length > 0 && product.variants[0].price 
                                          ? product.variants[0].price 
                                          : product.basePrice;

                    const finalPrice = originalPrice - (originalPrice * sale.discountPercentage / 100);

                    return (
                        <div 
                        key={product._id}
                        onClick={() => navigate(`/products/${product._id}`)}
                        className="bg-white rounded-[2.5rem] p-4 shadow-sm border border-rose-100 hover:shadow-xl transition-all duration-500 group relative">
                            <div className="absolute top-6 left-6 z-10 bg-rose-600 text-white text-[11px] font-black px-2.5 py-1 rounded-lg shadow-lg">
                                -{sale.discountPercentage}%
                            </div>

                            <div className="relative aspect-square bg-slate-50 rounded-[1.8rem] mb-5 overflow-hidden">
                                <img 
                                    src={product.images?.[0]?.url || '/placeholder.png'} 
                                    alt={product.name} 
                                    className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700" 
                                />
                            </div>

                            <div className="px-1">
                                <h3 className="font-bold text-slate-800 line-clamp-1 group-hover:text-rose-600 transition-colors">
                                    {product.name}
                                </h3>
                                
                                <div className="flex items-center gap-3 mt-2">
                                    <span className="text-2xl font-black text-slate-900">৳{Math.round(finalPrice)}</span>
                                    <span className="text-sm text-slate-400 line-through font-medium">৳{originalPrice}</span>
                                </div>
                                
                                <div className="mt-5 space-y-2">
                                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-tighter">
                                        <span className={product.totalStock < 10 ? 'text-rose-600' : 'text-slate-500'}>
                                            {product.totalStock < 10 ? `মাত্র ${product.totalStock}টি বাকি!` : `স্টক: ${product.totalStock}টি`}
                                        </span>
                                        <span className="text-slate-400 font-medium">হট ডিল</span>
                                    </div>
                                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <div 
                                            className={`h-full transition-all duration-1000 rounded-full ${product.totalStock < 10 ? 'bg-rose-500 animate-pulse' : 'bg-rose-400'}`} 
                                            style={{ width: `${Math.max(15, Math.min((product.totalStock / 50) * 100, 100))}%` }} 
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

// ==========================================
// Main Component: ডাটা ফেচিং এবং লুপ
// ==========================================
const FlashSaleSection = () => {
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchActiveSales = useCallback(async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/api/flash-sales?active=true');
            if (data.success && data.sales) {
                setSales(data.sales);
            }
        } catch (error) {
            console.error("Flash sale fetch error:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchActiveSales();
    }, [fetchActiveSales]);

    if (loading) return (
        <div className="py-12 bg-rose-50/30 animate-pulse">
            <div className="container mx-auto px-4 space-y-8">
                <div className="h-12 w-64 bg-slate-200 rounded-xl"></div>
                <div className="h-80 bg-slate-100 rounded-3xl"></div>
            </div>
        </div>
    );

    // যদি কোনো সেল না থাকে
    if (!sales || sales.length === 0) return null;

    return (
        <section className="py-12 bg-rose-50 border-y border-rose-100 overflow-hidden">
            <div className="container mx-auto px-4">
                {/* যতগুলো সেল আছে, সবগুলোর জন্য একটি করে ব্লক রেন্ডার হবে */}
                {sales.map((sale) => (
                    <FlashSaleBlock key={sale._id} sale={sale} />
                ))}
            </div>
        </section>
    );
};

export default FlashSaleSection;