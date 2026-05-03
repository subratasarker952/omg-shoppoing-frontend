import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Trash2, Plus, ImageIcon, Loader2, Edit, X, Layout, Calendar, Image } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../../../../services/axios';
import { scrollTOTop } from '../../../../utils/helperFunction';

const AdminBanners = () => {
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [editingId, setEditingId] = useState(null);

    const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm({
        defaultValues: {
            position: 'main-slider',
            order: ""
        }
    });

    const previewImage = watch("imagePreview");

    const fetchBanners = async () => {
        try {
            const { data } = await api.get('/api/banners/admin');
            setBanners(data.banners);
        } catch (error) {
            console.error(error);
            toast.error("ব্যানার লোড করতে সমস্যা হয়েছে");
        }
    };

    useEffect(() => { fetchBanners(); }, []);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setValue("imagePreview", URL.createObjectURL(file));
        }
    };

    const handleEdit = (banner) => {
        setEditingId(banner._id);
        setValue("title", banner.title);
        setValue("link", banner.link);
        setValue("position", banner.position);
        setValue("order", banner.order);
        // Date গুলোকে YYYY-MM-DD ফরম্যাটে কনভার্ট করে ইনপুট ফিল্ডে সেট করা
        if (banner.startDate) setValue("startDate", new Date(banner.startDate).toISOString().split('T')[0]);
        if (banner.endDate) setValue("endDate", new Date(banner.endDate).toISOString().split('T')[0]);

        setValue("imagePreview", banner.image.url);
        setSelectedFile(null);
        scrollTOTop()
    };

    const cancelEdit = () => {
        setEditingId(null);
        reset({
            title: '', link: '', position: 'main-slider', order: "", startDate: '', endDate: '', imagePreview: null
        });
        setSelectedFile(null);
    };

    const onSubmit = async (data) => {
        if (!editingId && !selectedFile) return toast.error("দয়া করে একটি ইমেজ সিলেক্ট করুন");

        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("link", data.link);
        formData.append("position", data.position);
        formData.append("order", data.order);
        if (data.startDate) formData.append("startDate", data.startDate);
        if (data.endDate) formData.append("endDate", data.endDate);

        if (selectedFile) {
            formData.append("image", selectedFile);
        }

        setLoading(true);
        try {
            if (editingId) {
                await api.patch(`/api/banners/${editingId}`, formData);
                toast.success("ব্যানার আপডেট হয়েছে");
            } else {
                await api.post('/api/banners', formData);
                toast.success("ব্যানার সফলভাবে যোগ করা হয়েছে");
            }
            cancelEdit();
            fetchBanners();
        } catch (error) {
            toast.error(error.response?.data?.message || "Error processing request");
        } finally {
            setLoading(false);
        }
    };

    // ৬. ডিলিট করা
    const handleDelete = async (id) => {
        if (!window.confirm("আপনি কি নিশ্চিত?")) return;
        try {
            await api.delete(`/api/banners/${id}`);
            toast.success("ব্যানার ডিলিট হয়েছে");
            setBanners(banners.filter(b => b._id !== id));
        } catch (error) {
            console.error(error);
            toast.error("ডিলিট করতে সমস্যা হয়েছে");
        }
    };

    return (
        <div className="p-1 container mx-auto space-y-4 bg-gray-50">
            <div>
                <h1 className="text-2xl font-bold text-black flex items-center gap-2">
                    <Image className="text-violet-600" />Manage Banners
                </h1>
                <p className="text-gray-500 text-sm font-medium">Configure promotional banners ({banners?.length || 0})</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Form Section */}
                <div className="lg:col-span-4 space-y-4">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 sticky top-4">
                        <h3 className="text-lg font-semibold mb-6 flex items-center gap-2 text-black">
                            {editingId ? <Edit size={18} /> : <Plus size={18} />}
                            {editingId ? "Update Banner" : "Create New Banner"}
                        </h3>

                        <form onSubmit={handleSubmit(onSubmit)} className=" space-y-4 text-slate-700">
                            {/* Title & Link */}
                            <div>
                                <label className="text-xs font-bold uppercase text-slate-500 ml-1">Title</label>
                                <input {...register("title", { required: "Title is required" })} className="w-full mt-1 p-3 text-black bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 outline-none" placeholder="Mega Sale!" />
                                {errors.title && <span className='text-red-500'>{errors.title.message}</span>}
                            </div>

                            <div>
                                <label className="text-xs font-bold uppercase text-slate-500 ml-1">Redirect Link</label>
                                <input {...register("link", { required: "Link is required" })} className="w-full mt-1 p-3 text-black bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 outline-none" placeholder="/shop/category" />
                                {errors.link && <span className='text-red-500'>{errors.link.message}</span>}
                            </div>

                            {/* Position & Order */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold uppercase text-slate-500 ml-1">Position</label>
                                    <select {...register("position", { required: "Position is required" })} className="w-full mt-1 p-3 text-black bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 outline-none appearance-none">
                                        <option value="main-slider">Main Slider</option>
                                        <option value="sidebar">Sidebar</option>
                                        <option value="promo-grid">Promo Grid</option>
                                    </select>
                                    {errors.position && <span className='text-red-500'>{errors.position.message}</span>}
                                </div>
                                <div>
                                    <label className="text-xs font-bold uppercase text-slate-500 ml-1">Order</label>
                                    <input type="number" {...register("order", { required: "Order is required" })} className="w-full mt-1 p-3 text-black bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 outline-none" />
                                    {errors.order && <span className='text-red-500'>{errors.order.message}</span>}
                                </div>
                            </div>

                            {/* Date Scheduling */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold uppercase text-slate-500 ml-1">Start Date</label>
                                    <input type="date" {...register("startDate", { required: true })} className="w-full mt-1 p-3 text-black bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 outline-none text-sm" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold uppercase text-slate-500 ml-1">End Date</label>
                                    <input type="date" {...register("endDate", { required: true })} className="w-full mt-1 p-3 text-black bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 outline-none text-sm" />
                                </div>
                            </div>

                            {/* Image Upload */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-slate-500 ml-1">Banner Image</label>
                                <div className="relative border-2 border-dashed border-slate-200 rounded-2xl p-4 text-center hover:bg-slate-50 transition-all overflow-hidden">
                                    {previewImage ? (
                                        <div className="relative group">
                                            <img src={previewImage} alt="Preview" className="rounded-lg h-32 w-full object-cover" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-lg">
                                                <button type="button" onClick={() => { setValue("imagePreview", null); setSelectedFile(null); }} className="bg-white p-2 rounded-full text-red-500 shadow-xl">
                                                    <Trash2 size={20} />
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <label className="cursor-pointer block py-6">
                                            <ImageIcon className="mx-auto text-slate-300 mb-2" size={40} />
                                            <span className="text-sm text-slate-400">Click to upload 16:9 image</span>
                                            <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                                        </label>
                                    )}
                                </div>
                            </div>

                            <button disabled={loading} className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:shadow-lg disabled:bg-slate-400 flex items-center justify-center gap-2 transition-all">
                                {loading ? <Loader2 className="animate-spin" size={20} /> : (editingId ? "Update Banner" : "Publish Banner")}
                            </button>

                            {editingId && (
                                <button type="button" onClick={cancelEdit} className="w-full py-2 text-slate-500 hover:text-slate-800 text-sm font-medium">
                                    Cancel Editing
                                </button>
                            )}
                        </form>
                    </div>
                </div>

                {/* List Section */}
                <div className="lg:col-span-8">
                    <div className="flex items-center justify-between mb-6 px-1">
                        <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                            <Layout size={20} className="text-slate-400" /> Current Banners
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {banners.map((banner) => (
                            <div key={banner._id} className="group bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all">
                                <div className="relative">
                                    <img src={banner.image.url} alt={banner.title} className="w-full h-48 object-cover" />
                                    <div className="absolute top-3 left-3 flex gap-2">
                                        <span className="bg-white/85  backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-slate-700 shadow-sm border border-slate-100">
                                            {banner.position}
                                        </span>
                                        <span className="bg-slate-900/90 text-white px-3 py-1 rounded-full text-[10px] font-bold shadow-sm">
                                            Order: {banner.order}
                                        </span>
                                    </div>
                                    <div className="absolute top-3 right-3 flex gap-2 transition-opacity">
                                        <button onClick={() => handleEdit(banner)} className="p-2 bg-white text-blue-600 rounded-xl shadow-lg hover:scale-110 transition-all"><Edit size={16} /></button>
                                        <button onClick={() => handleDelete(banner._id)} className="p-2 bg-white text-red-600 rounded-xl shadow-lg hover:scale-110 transition-all"><Trash2 size={16} /></button>
                                    </div>
                                </div>
                                <div className="p-5">
                                    <h4 className="font-bold text-slate-800 text-lg mb-1">{banner.title}</h4>
                                    <p className="text-xs text-slate-400 font-mono mb-3 truncate">{banner.link}</p>

                                    {(banner.startDate || banner.endDate) && (
                                        <div className="flex items-center gap-2 text-[11px] text-slate-500 bg-slate-50 p-2 rounded-lg">
                                            <Calendar size={12} />
                                            <span>
                                                {banner.startDate ? new Date(banner.startDate).toLocaleDateString() : 'Start'}
                                                {' — '}
                                                {banner.endDate ? new Date(banner.endDate).toLocaleDateString() : 'End'}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminBanners;