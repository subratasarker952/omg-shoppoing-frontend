import React, { useState, useEffect, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { Helmet } from 'react-helmet-async';
import {
    ShoppingCart, Star, ShieldCheck, Truck,
    RefreshCcw, Plus, Minus, Heart, Loader2, Zap, Clock,
    ArrowRight
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../../../services/axios";
import { useCart } from "../../../context/CartContext";
import { useConfig } from "../../../context/ConfigContext";
import { useWishlist } from "../../../context/WishlistContext";

const ProductDetails = () => {
    const { id } = useParams();
    const { siteName } = useConfig();
    const { addToCart } = useCart();
    const { addToWishlist, isInWishlist } = useWishlist();

    // States
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [selectedColor, setSelectedColor] = useState("");
    const [selectedSize, setSelectedSize] = useState("");

    // ১. ডাটা ফেচিং (ব্যাকএন্ড এখন এক কল-এই সব ডেটা দিচ্ছে)
    useEffect(() => {
        const getProductData = async () => {
            try {
                setLoading(true);
                const { data } = await api.get(`/api/products/${id}`);

                if (data.success) {
                    const prod = data.product;
                    setProduct(prod);

                    // ডিফল্ট সিলেকশন সেট করা
                    if (prod.variants?.length > 0) {
                        setSelectedColor(prod.variants[0].color);
                        setSelectedSize(prod.variants[0].size);
                    }
                }
            } catch (error) {
                console.error("Fetch Error:", error);
                toast.error("প্রোডাক্ট লোড করতে সমস্যা হয়েছে");
            } finally {
                setLoading(false);
            }
        };
        getProductData();
    }, [id]);

    // ২. মেমোয়াইজড ভ্যালুস (পারফরম্যান্স অপ্টিমাইজেশন)
    const colors = useMemo(() => {
        if (!product?.variants) return [];
        return [...new Set(product.variants.map(v => v.color))];
    }, [product]);

    const availableSizes = useMemo(() => {
        if (!product?.variants || !selectedColor) return [];
        return product.variants.filter(v => v.color === selectedColor);
    }, [product, selectedColor]);

    // বর্তমান সিলেক্ট করা ভেরিয়েন্ট অবজেক্ট (ব্যাকএন্ডের pricing সহ)
    const activeVariant = useMemo(() => {
        return product?.variants?.find(
            v => v.color === selectedColor && v.size === selectedSize
        );
    }, [selectedColor, selectedSize, product]);

    // ৩. হ্যান্ডেলার্স
    const handleAddToCart = () => {
        if (!activeVariant) return toast.error("দয়া করে অপশনগুলো সিলেক্ট করুন");
        if (activeVariant.stock < quantity) return toast.error("দুঃখিত, পর্যাপ্ত স্টক নেই");

        addToCart(
            product,
            activeVariant,
            quantity,
            activeVariant.pricing.current, // ব্যাকএন্ড থেকে আসা ক্যালকুলেটেড প্রাইস
            !!product.flashSale            // ফ্ল্যাশ সেল কি না তার বুলিয়ান ভ্যালু
        );
    };

    if (loading) return (
        <div className="h-screen flex items-center justify-center bg-white">
            <Loader2 className="animate-spin text-violet-600" size={48} />
        </div>
    );

    if (!product) return <div className="text-center py-20 font-bold">Product Not Found</div>;

    return (
        <>
            <Helmet>
                <title>{product.name} | {siteName}</title>
                <meta name="description" content={product.description?.substring(0, 160)} />
                <meta property="og:title" content={product.name} />
                <meta property="og:image" content={product.images?.[0]?.url} />
            </Helmet>

            <div className="bg-white min-h-screen pb-12 text-black">
                <div className="container mx-auto px-4 md:px-8 py-6 md:py-12">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

                        {/* Left: Image Gallery */}
                        <div className="space-y-4">
                            <div className="aspect-4/5 md:aspect-square rounded-3xl overflow-hidden bg-gray-50 border border-gray-100 shadow-sm relative">
                                <img
                                    src={product.images[selectedImage]?.url}
                                    alt={product.name}
                                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                                />
                            </div>
                            <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
                                {product.images.map((img, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImage(index)}
                                        className={`w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden border-2 shrink-0 transition-all ${selectedImage === index ? 'border-violet-600 ring-4 ring-violet-50' : 'border-transparent'
                                            }`}
                                    >
                                        <img src={img.url} className="w-full h-full object-cover" alt="thumb" />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Right: Product Details */}
                        <div className="flex flex-col">
                            <div className="border-b border-gray-100 pb-6 mb-6">

                                {/* Flash Sale Banner */}
                                {product.flashSale && (
                                    <div className="flex items-center justify-between bg-red-50 border border-red-100 p-4 rounded-3xl mb-6">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-red-600 p-2 rounded-2xl text-white shadow-lg">
                                                <Zap size={20} className="fill-white" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black uppercase text-red-600">Flash Sale Active</p>
                                                <p className="text-sm font-bold text-red-900">{product.flashSale.title}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-1">Status</p>
                                            <div className="flex items-center gap-1 text-red-600 font-black">
                                                <Clock size={14} />
                                                <span className="text-xs uppercase">Limited Time</span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-center gap-2 mb-4">
                                    <span className="bg-violet-100 text-violet-600 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                                        {product.category?.name}
                                    </span>
                                    {product.flashSale && (
                                        <span className="bg-red-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase">
                                            -{product.flashSale.discountPercentage}% OFF
                                        </span>
                                    )}
                                </div>

                                <h1 className="text-3xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">
                                    {product.name}
                                </h1>

                                {/* Pricing Section - Direct from Backend logic */}
                                <div className="flex items-end gap-3">
                                    <span className="text-4xl md:text-5xl font-black text-violet-600">
                                        ৳{activeVariant?.pricing?.current.toLocaleString()}
                                    </span>
                                    {product.flashSale && (
                                        <span className="text-xl text-gray-400 line-through font-bold mb-1">
                                            ৳{activeVariant?.pricing?.original.toLocaleString()}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Options Selection */}
                            <div className="space-y-8 mb-10">
                                {/* Color Selector */}
                                <div>
                                    <h3 className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-4">Color</h3>
                                    <div className="flex flex-wrap gap-3">
                                        {colors.map((color) => (
                                            <button
                                                key={color}
                                                onClick={() => {
                                                    setSelectedColor(color);
                                                    const firstAvailableSize = product.variants.find(v => v.color === color)?.size;
                                                    setSelectedSize(firstAvailableSize);
                                                }}
                                                className={`px-5 py-2.5 rounded-xl text-[11px] font-black uppercase border-2 transition-all ${selectedColor === color
                                                        ? 'bg-black text-white border-black shadow-lg scale-105'
                                                        : 'bg-gray-50 text-gray-400 border-transparent hover:border-gray-200'
                                                    }`}
                                            >
                                                {color}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Size Selector */}
                                <div>
                                    <h3 className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-4">Size</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {availableSizes.map((v) => (
                                            <button
                                                key={v._id}
                                                onClick={() => setSelectedSize(v.size)}
                                                className={`h-12 min-w-14 px-4 rounded-xl text-sm font-black border-2 transition-all ${selectedSize === v.size
                                                        ? 'border-violet-600 bg-violet-50 text-violet-600 shadow-inner'
                                                        : 'border-gray-100 text-gray-400 hover:border-gray-300'
                                                    }`}
                                            >
                                                {v.size}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-wrap items-center gap-4 mb-8">
                                <div className="flex items-center bg-gray-50 rounded-2xl p-1 border border-gray-100">
                                    <button
                                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                        className="p-3 hover:bg-white rounded-xl transition-all shadow-sm active:scale-90"
                                    >
                                        <Minus size={18} />
                                    </button>
                                    <span className="w-10 text-center font-black text-lg">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(q => q + 1)}
                                        className="p-3 hover:bg-white rounded-xl transition-all shadow-sm active:scale-90"
                                    >
                                        <Plus size={18} />
                                    </button>
                                </div>

                                <button
                                    onClick={() => addToWishlist(product)}
                                    className={`p-4 border rounded-2xl transition-all ${isInWishlist(product._id) ? "text-red-500 bg-red-50 border-red-100" : "text-gray-400 border-gray-100 hover:bg-gray-50"
                                        }`}
                                >
                                    <Heart size={24} className={isInWishlist(product._id) ? "fill-current" : ""} />
                                </button>

                                <button
                                    onClick={handleAddToCart}
                                    disabled={!activeVariant || activeVariant.stock === 0}
                                    className="flex-1 bg-violet-600 text-white h-14 md:h-16 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-black transition-all shadow-xl shadow-violet-100 disabled:bg-gray-200 active:scale-95"
                                >
                                    <ShoppingCart size={22} />
                                    <span className="hidden md:inline">{activeVariant?.stock === 0 ? "Out of Stock" : "Add to Cart"}</span>
                                </button>
                            </div>

                            <Link to={'/dashboard/my-checkout'}
                                className="w-full bg-black text-white h-16 rounded-2xl font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-violet-600 transition-all active:scale-[0.98] shadow-xl shadow-gray-100"
                            >
                                Checkout Now <ArrowRight size={18} />
                            </Link>

                            {/* Trust Badges */}
                            <div className="grid grid-cols-3 gap-2 border-t border-gray-100 pt-8">
                                <div className="flex flex-col items-center gap-1 text-center">
                                    <Truck size={20} className="text-violet-600" />
                                    <span className="text-[10px] font-bold text-gray-500 uppercase">Fast Delivery</span>
                                </div>
                                <div className="flex flex-col items-center gap-1 text-center">
                                    <ShieldCheck size={20} className="text-violet-600" />
                                    <span className="text-[10px] font-bold text-gray-500 uppercase">Authentic</span>
                                </div>
                                <div className="flex flex-col items-center gap-1 text-center">
                                    <RefreshCcw size={20} className="text-violet-600" />
                                    <span className="text-[10px] font-bold text-gray-500 uppercase">Easy Return</span>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="mt-10">
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-4">Description</h3>
                                <p className="text-gray-600 leading-relaxed font-medium whitespace-pre-line">
                                    {product.description}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProductDetails;