import React, { useCallback, useEffect, useState } from 'react';
import api from '../../../services/axios';
import { ShoppingBag, ArrowRight, ShieldCheck, Truck, RefreshCcw, Star, ShoppingCart, Search, User, ChevronRight } from 'lucide-react';
import BannerSlider from '../../../components/shared/BannerSlider';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import ProductCard from '../product/component/ProductCard';
import Loader from '../../../components/shared/Loader';
import CouponSection from './component/CouponSection';
import FlashSaleSection from './component/FlashSaleSection';
import { useConfig } from '../../../context/ConfigContext';

const Landing = () => {
    const navigate = useNavigate();
    const config = useConfig();
    const [banners, setBanners] = useState([]);
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // ১. ডাটা ফেচিং ফাংশন (useCallback ব্যবহার করা হয়েছে মেমরি অপ্টিমাইজেশনের জন্য)
    const fetchLandingData = useCallback(async () => {
        try {
            setLoading(true);

            // Parallel Fetching: তিনটি রিকোয়েস্ট একসাথে যাবে, যা লোডিং টাইম কমাবে
            const [bannerRes, categoryRes, productRes] = await Promise.all([
                api.get("/api/banners"),
                api.get("/api/categories"),
                api.get("/api/products?limit=8"),
            ]);

            // API Response structure অনুযায়ী ডাটা সেট করা
            setBanners(bannerRes.data?.banners || []);
            setCategories(categoryRes.data?.categories || []);
            setProducts(productRes.data?.products || [])
        } catch (error) {
            console.error("Landing Data Fetch Error:", error);
            toast.error("কিছু ডাটা লোড করতে সমস্যা হয়েছে। দয়া করে পেজটি রিফ্রেশ করুন।");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchLandingData();
    }, [fetchLandingData]);



    // লোডিং অবস্থায় স্কেলিটন বা লোডার দেখানো ভালো প্র্যাকটিস
    if (loading) {
        return <Loader fullScreen={true} />
    }



    return (
        <div className="min-h-screen bg-slate-50 font-sans">

            {/* 1. Hero */}
            <section className="relative pt-12 pb-20 overflow-hidden">
                <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-12">
                    <div className="flex-1 space-y-8 text-center md:text-left">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100 uppercase tracking-widest">
                            Limited Edition Collection
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black leading-[1.1] text-slate-900">
                            সেরা পণ্যে <br />
                            <span className="text-blue-600">সেরা অভিজ্ঞতা</span>
                        </h1>
                        <p className="text-lg text-slate-500 max-w-lg leading-relaxed">
                            আমরা দিচ্ছি প্রিমিয়াম কোয়ালিটির নিশ্চয়তা। আজই অর্ডার করুন এবং উপভোগ করুন দ্রুততম হোম ডেলিভারি।
                        </p>
                        <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                            <Link to='/products' className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-blue-600 transition-all flex items-center gap-2 shadow-xl shadow-slate-200">
                                এখনই কিনুন <ArrowRight size={20} />
                            </Link>
                        </div>
                    </div>
                    <div className="flex-1 relative">
                        <div className="w-full aspect-square bg-linear-to-br from-blue-100 to-indigo-100 rounded-[40px] md:-rotate-5 flex items-center justify-center border-4 border-white shadow-2xl">
                            <img src={config?.heroBanner ? config.heroBanner : '/logo.png'} className='h-full rounded-[40px]' alt={config?.siteName} />
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. Banner Section */}
            <BannerSlider banners={banners} />

            {/* 3. Promotional CTA (Direct to Consumer) */}
            <FlashSaleSection />


            {/* 4. Category Section */}
            <section className="py-20 bg-slate-50">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-2xl mx-auto mb-16 space-y-4 text-black">
                        <h2 className="text-4xl font-black">আমাদের সেরা কালেকশন</h2>
                        <p className="text-slate-500">সবচেয়ে জনপ্রিয় এবং ট্রেন্ডি প্রোডাক্টগুলো এখন আপনার হাতের মুঠোয়।</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {categories.map(cat => (
                            <div key={cat._id} className="group bg-white p-8 rounded-3xl border border-slate-200 text-center hover:border-blue-500 transition-all cursor-pointer">
                                <h4
                                    onClick={() => navigate(`/products?category=${cat.name}`)}
                                    className="font-bold text-lg capitalize text-black">{cat.name}</h4>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 5. Featured Products Grid */}
            <section className="py-24">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-2xl mx-auto mb-16 space-y-4 text-black">
                        <h2 className="text-4xl font-black">আমাদের সেরা কালেকশন</h2>
                        <p className="text-slate-500">সবচেয়ে জনপ্রিয় এবং ট্রেন্ডি প্রোডাক্টগুলো এখন আপনার হাতের মুঠোয়।</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {products.map(product => {

                            return (
                                <ProductCard
                                    key={product._id}
                                    product={product}
                                    flashSaleDiscount={null} // ডিসকাউন্ট পার্সেন্টেজ পাঠিয়ে দিন
                                />
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* 6. Trust Indicators (USPs) */}
            <section className="py-16 bg-blue-600">
                <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12 text-white">
                    <div className="flex flex-col items-center text-center space-y-4">
                        <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md">
                            <Truck size={32} />
                        </div>
                        <h3 className="text-xl font-bold">ফাস্ট ডেলিভারি</h3>
                        <p className="opacity-80 text-sm">৪৮ ঘণ্টার মধ্যে সারা দেশে হোম ডেলিভারি নিশ্চিত করি আমরা।</p>
                    </div>
                    <div className="flex flex-col items-center text-center space-y-4">
                        <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md">
                            <ShieldCheck size={32} />
                        </div>
                        <h3 className="text-xl font-bold">নিরাপদ পেমেন্ট</h3>
                        <p className="opacity-80 text-sm">বিকাশ, নগদ এবং যেকোনো কার্ডের মাধ্যমে নিরাপদ পেমেন্ট সুবিধা।</p>
                    </div>
                    <div className="flex flex-col items-center text-center space-y-4">
                        <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md">
                            <RefreshCcw size={32} />
                        </div>
                        <h3 className="text-xl font-bold">সহজ রিটার্ন</h3>
                        <p className="opacity-80 text-sm">পণ্য পছন্দ না হলে ৭ দিনের মধ্যে সহজে রিটার্ন করার গ্যারান্টি।</p>
                    </div>
                </div>
            </section>

            {/* 7. Testimonials */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-16 text-slate-900">কাস্টমাররা আমাদের সম্পর্কে যা বলছেন</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="bg-slate-50 p-8 rounded-4xl space-y-4 border border-slate-100 italic text-slate-600">
                                <div className="flex justify-center gap-1 text-amber-400 mb-2">
                                    {[...Array(5)].map((_, j) => <Star key={j} size={16} fill="currentColor" />)}
                                </div>
                                <p>"পণ্যের কোয়ালিটি অনেক ভালো ছিল এবং খুব দ্রুত ডেলিভারি পেয়েছি। ধন্যবাদ!"</p>
                                <div className="not-italic pt-4 border-t border-slate-200">
                                    <h5 className="font-bold text-slate-900">মোঃ আরিফুর রহমান</h5>
                                    <p className="text-xs text-slate-400">ঢাকা, বাংলাদেশ</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 7. Testimonials */}
            <CouponSection />

        </div>
    );
};

export default Landing;