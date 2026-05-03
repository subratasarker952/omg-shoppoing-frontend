import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import api from "../../../../../services/axios";
import toast from "react-hot-toast";
import { ImagePlus, X, Loader2, CheckCircle2, XCircle } from "lucide-react";

const CategoryForm = ({ initialData, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(initialData?.image?.url || "");

    const { register, handleSubmit, formState: { errors }, reset, watch } = useForm({
        defaultValues: initialData || { name: "", isActive: true }
    });

    // isActive এর কারেন্ট ভ্যালু ট্রাক করা
    const isActive = watch("isActive");

    useEffect(() => {
        if (initialData) {
            reset(initialData);
            setPreview(initialData.image?.url);
        }
    }, [initialData, reset]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) return toast.error("File size must be less than 2MB");
            setSelectedFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const onSubmit = async (data) => {
        setLoading(true);
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("isActive", data.isActive); // এটি বুলিয়ান হিসেবে যাবে

        if (selectedFile) {
            formData.append("image", selectedFile);
        }

        try {
            let res;
            if (initialData) {
                res = await api.put(`/api/categories/${initialData._id}`, formData, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
            } else {
                if (!selectedFile) {
                    setLoading(false);
                    return toast.error("Please upload a category image");
                }
                res = await api.post("/api/categories", formData, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
            }

            if (res.data.success) {
                toast.success(initialData ? "Category Updated!" : "Category Created!");
                onSuccess();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Image Preview Section */}
            <div className="flex flex-col items-center justify-center space-y-3">
                <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest">Category Thumbnail</label>
                <div className="relative group w-32 h-32">
                    <div className="w-full h-full rounded-[2.5rem] bg-gray-50 border-2 border-dashed border-gray-200 overflow-hidden flex items-center justify-center transition-all group-hover:border-violet-400">
                        {preview ? (
                            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                            <ImagePlus className="text-gray-300 group-hover:text-violet-400" size={32} />
                        )}
                    </div>
                    <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
            </div>

            {/* Category Name */}
            <div className="space-y-2">
                <label className="text-[11px] font-black text-gray-500 uppercase ml-1">Category Name</label>
                <input
                    {...register("name", { required: "Name is required" })}
                    placeholder="e.g. Smart Watches"
                    className="w-full bg-gray-50 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-violet-500 font-bold border border-transparent focus:bg-white transition-all"
                />
                {errors.name && <p className="text-red-500 text-[10px] font-bold uppercase ml-1">{errors.name.message}</p>}
            </div>

            {/* Custom Toggle Switch for Status */}
            <div className="flex items-center justify-between bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <div className="flex items-center gap-3">
                    {isActive ? <CheckCircle2 className="text-green-500" size={20} /> : <XCircle className="text-gray-400" size={20} />}
                    <div>
                        <p className="text-xs font-black text-gray-700 uppercase">Category Status</p>
                        <p className="text-[10px] text-gray-500 font-medium">{isActive ? "Visible to customers" : "Hidden from customers"}</p>
                    </div>
                </div>
                
                <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                        type="checkbox" 
                        {...register("isActive")} 
                        className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-600"></div>
                </label>
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-violet-700 transition-all disabled:bg-gray-200 flex items-center justify-center gap-2 shadow-xl shadow-black/5"
            >
                {loading ? <Loader2 size={18} className="animate-spin" /> : (initialData ? "Update Category" : "Save Category")}
            </button>
        </form>
    );
};

export default CategoryForm;