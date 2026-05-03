import React, { useState, useEffect, useMemo } from "react";
import { Search, Loader2, ChevronRight, ChevronDown } from "lucide-react";
import ProductCard from "./component/ProductCard";
import api from "../../../services/axios";
import useCategory from "../../../hooks/useCategory";
import { Pagination } from "../../../components/shared/Pagination";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";

const PublicProducts = () => {
    const [searchParams] = useSearchParams();
    const { categories } = useCategory();
    const [flashSales, setFlashSales] = useState([]);
    const [products, setProducts] = useState([]);
    const [totalProducts, setTotalProducts] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);

    const [filters, setFilters] = useState({
        category: searchParams.get('category') || "",
        minPrice: "",
        maxPrice: "",
        search: searchParams.get('search') || "",
        sort: "-createdAt"
    });

    const fetchData = async () => {
        try {
            setLoading(true);
            const { data } = await api.get(`/api/products`, {
                params: { ...filters, page, limit: 10 }
            });
            if (data.success) {
                setProducts(data.products);
                setTotalProducts(data.totalProducts);
                setTotalPages(data.totalPages);
            }
        } catch (error) {
            console.error("Error", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchFlashSaleProducts = async () => {
        try {
            const { data } = await api.get('/api/flash-sales')
            setFlashSales(data.sales)
        } catch (error) {
            console.error(error);
            toast.error("ডাটা লোড করতে সমস্যা হয়েছে");
        }
    };

    useEffect(() => { fetchFlashSaleProducts(); }, []);


    useEffect(() => {
        const delayDebounce = setTimeout(fetchData, 400);
        return () => clearTimeout(delayDebounce);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters, page]);

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setPage(1);
    };

    // রেন্ডার ব্লকের আগে এটি যোগ করুন
    const flashSaleMap = useMemo(() => {
        const map = {};
        flashSales.forEach(sale => {
            if (sale.status === 'active') {
                sale.products.forEach(p => {
                    // প্রোডাক্ট আইডি কি এবং ডিসকাউন্ট কত তা ম্যাপে সেভ করা হচ্ছে
                    map[p._id] = sale.discountPercentage;
                });
            }
        });
        return map;
    }, [flashSales]);

    return (
        <div className="bg-white container mx-auto min-h-screen pb-20">
            {/* Mobile Header & Search Area */}
            <div className="sticky top-0 z-30 bg-white/85  backdrop-blur-md border-b border-gray-100 p-2 lg:hidden  text-black">
                <div className="flex flex-col gap-2">
                    {/* Search Input with Bigger Font */}
                    <div className="flex gap-2 items-center">
                        <h2 className="text-4xl">({totalProducts})</h2>
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search products..."
                                className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl outline-none text-base font-bold placeholder:text-gray-400 focus:ring-2 focus:ring-violet-500/10 transition-all"
                                onChange={(e) => handleFilterChange("search", e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Filter & Sort Bar */}
                    <div className="flex items-center gap-3">
                        <div className="flex-1 relative">
                            <select
                                className="w-full bg-gray-50 appearance-none px-5 py-3.5 rounded-xl outline-none font-black text-[12px] uppercase tracking-widest cursor-pointer border border-transparent focus:border-violet-200"
                                onChange={(e) => handleFilterChange("sort", e.target.value)}
                            >
                                <option value="-createdAt">New Arrivals</option>
                                <option value="basePrice">Price: Low to High</option>
                                <option value="-basePrice">Price: High to Low</option>
                            </select>
                            <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
                        </div>
                    </div>
                </div>

                {/* Mobile Categories - High-End Scroller */}
                <div className="flex gap-3 overflow-x-auto no-scrollbar mt-2 pb-1">
                    <button
                        onClick={() => handleFilterChange("category", "")}
                        className={`whitespace-nowrap px-6 py-2.5 rounded-full text-[11px] font-black uppercase tracking-widest transition-all shadow-sm ${filters.category === "" ? 'bg-black text-white shadow-black/20' : 'bg-white text-gray-500 border border-gray-100'}`}
                    >
                        All
                    </button>
                    {categories.map(cat => (
                        <button
                            key={cat._id}
                            onClick={() => handleFilterChange("category", cat._id)}
                            className={`whitespace-nowrap px-4 py-2.5 rounded-full text-[11px] font-black uppercase tracking-widest transition-all shadow-sm ${filters.category === cat._id ? 'bg-black text-white shadow-black/20' : 'bg-white text-gray-500 border border-gray-100'}`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>
            </div>

            <div className="container mx-auto p-2">
                <div className="flex flex-col lg:flex-row gap-12">

                    {/* Desktop Sidebar */}
                    <aside className="hidden lg:block w-72 shrink-0 space-y-10">
                        <div className="space-y-2">
                            <button
                                onClick={() => handleFilterChange("category", "")}
                                className={`flex items-center justify-between w-full px-5 py-4 rounded-full text-[13px] font-black uppercase tracking-tight transition-all ${filters.category === "" ? 'bg-black text-white translate-x-2' : 'text-gray-500 hover:bg-gray-50 hover:text-black'}`}
                            >
                                All
                                {filters.category === '' ? <ChevronRight size={16} /> : <div className="w-1.5 h-1.5 rounded-full bg-gray-200"></div>}

                            </button>

                            {categories.map(cat => (
                                <button
                                    key={cat._id}
                                    onClick={() => handleFilterChange("category", cat._id)}
                                    className={`flex items-center justify-between w-full px-5 py-4 rounded-full text-[13px] font-black uppercase tracking-tight transition-all ${filters.category === cat._id ? 'bg-black text-white translate-x-2' : 'text-gray-500 hover:bg-gray-50 hover:text-black'}`}
                                >
                                    {cat.name}
                                    {filters.category === cat._id ? <ChevronRight size={16} /> : <div className="w-1.5 h-1.5 rounded-full bg-gray-200"></div>}
                                </button>
                            ))}
                        </div>
                    </aside>

                    {/* Main Content Area */}
                    <main className="flex-1 flex flex-col min-h-150  text-black">
                        {/* Desktop Search & Sort - More Spacing & Larger Inputs */}
                        <div className="hidden lg:flex items-center gap-6 mb-6">
                            <div className="flex-1 flex gap-2 items-center">
                                <h2 className="text-4xl ">({totalProducts})</h2>
                                <div className="relative flex-1">
                                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type="text"
                                        placeholder="What are you looking for today?"
                                        className="w-full pl-16 pr-6 py-2 bg-gray-50 rounded-4xl outline-none text-lg font-bold border-2 border-transparent focus:border-violet-500/20 focus:bg-white transition-all shadow-sm"
                                        onChange={(e) => handleFilterChange("search", e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="relative">
                                <select
                                    className="bg-black text-white px-10 py-4 rounded-4xl outline-none font-black text-[11px] uppercase tracking-[0.2em] cursor-pointer appearance-none min-w-55"
                                    onChange={(e) => handleFilterChange("sort", e.target.value)}
                                >
                                    <option className="p-4" value="-createdAt">New Arrivals</option>
                                    <option className="p-4" value="basePrice">Price: Low - High</option>
                                    <option className="p-4" value="-basePrice">Price: High - Low</option>
                                </select>
                                <ChevronDown size={16} className="absolute right-6 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none" />
                            </div>
                        </div>

                        {/* Product Grid Area */}
                        <div className="flex-1">
                            {loading ? (
                                <div className="flex flex-col items-center justify-center h-96 gap-4">
                                    <Loader2 className="animate-spin text-violet-600" size={40} />
                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Loading Boutique...</p>
                                </div>
                            ) : products.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-10">
                                    {products.map(product => {
                                        // চেক করা হচ্ছে এই প্রোডাক্টটি ফ্ল্যাশ সেলে আছে কি না
                                        const discount = flashSaleMap[product._id];

                                        return (
                                            <ProductCard
                                                key={product._id}
                                                product={product}
                                                flashSaleDiscount={discount} // ডিসকাউন্ট পার্সেন্টেজ পাঠিয়ে দিন
                                            />
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-32 text-center bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-100">
                                    <div className="bg-white p-8 rounded-full shadow-xl mb-6">
                                        <Search size={48} className="text-violet-200" />
                                    </div>
                                    <h3 className="text-2xl font-black text-gray-900 uppercase italic">No Matches Found</h3>
                                    <p className="text-gray-400 text-base mt-2 max-w-xs font-medium">Try refining your search or exploring a different category.</p>
                                </div>
                            )}
                        </div>

                        {/* Pagination */}
                        {!loading && products.length > 0 && totalPages > 1 && (
                            <div className="mt-20 py-12 flex justify-center border-t border-gray-100">
                                <Pagination
                                    currentPage={page}
                                    onPageChange={setPage}
                                    totalPages={totalPages}
                                />
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default PublicProducts;