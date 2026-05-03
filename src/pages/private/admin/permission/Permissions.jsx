import React, { useEffect, useState, useCallback } from "react";
import { PlusCircle, Trash2, Shield, Loader2, Key, Info } from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import api from "../../../../services/axios";

const Permissions = () => {
    const [permissions, setPermissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // React Hook Form Setup
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm({
        defaultValues: { name: "", module: "" }
    });

    // 1. Fetch Permissions (Wrapped in useCallback for stability)
    const fetchPermissions = useCallback(async () => {
        setLoading(true);
        try {
            const res = await api.get("/api/permissions");
            setPermissions(res.data?.data || []);
        } catch (error) {
            toast.error("Failed to load permissions");
            console.error("Fetch Permissions Error:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPermissions();
    }, [fetchPermissions]);

    // 2. Create Permission with React Hook Form
    const onSubmit = async (data) => {
        try {
            setIsSubmitting(true);
            const res = await api.post("/api/permissions", data);

            if (res.data?.success || res.status === 201 || res.status === 200) {
                toast.success("Permission created successfully!");
                reset(); // Clear form inputs
                fetchPermissions(); // Refresh list securely
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong while creating permission.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // 3. Delete with Confirmation
    const deletePermission = async (id) => {
        if (!window.confirm("Are you sure you want to delete this permission? This might affect user roles.")) return;

        // Optimistic UI Update (Remove instantly for better UX)
        const previousPermissions = [...permissions];
        setPermissions(prev => prev.filter(p => p._id !== id));

        try {
            await api.delete(`/api/permissions/${id}`);
            toast.success("Permission deleted successfully");
        } catch (error) {
            console.error("Delete Error:", error);
            toast.error("Failed to delete permission");
            // Rollback if API fails
            setPermissions(previousPermissions);
        }
    };

    return (
        <div className="p-2 w-full min-h-screen bg-gray-50">
            <div className="container mx-auto space-y-4">
                
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                            <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                                <Shield size={24} />
                            </div>
                            System Permissions
                        </h1>
                        <p className="text-slate-500 text-sm font-medium mt-1">
                            Create and manage permission. Total ({permissions?.length || 0})
                        </p>
                    </div>
                </div>

                {/* Input Form Section (Inline Layout for SaaS) */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-md">
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col md:flex-row items-start md:items-end gap-4">
                        
                        <div className="w-full md:w-1/3">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">
                                Permission Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                {...register("name", { required: "Permission name is required" })}
                                className={`w-full text-slate-900 bg-slate-50 border ${errors.name ? 'border-red-300 focus:ring-red-500' : 'border-slate-200 focus:ring-indigo-500'} p-3 rounded-xl focus:ring-2 outline-none transition-all text-sm`}
                                placeholder="e.g. manage_users, view_reports"
                            />
                            {errors.name && <p className="text-red-500 text-xs mt-1 font-medium">{errors.name.message}</p>}
                        </div>

                        <div className="w-full md:flex-1">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">
                            Module
                            </label>
                            <input
                                {...register("module")}
                                className="w-full text-slate-900 bg-slate-50 border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm"
                                placeholder="Module Name"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white px-8 py-3 rounded-xl flex items-center justify-center gap-2 font-semibold transition-all shadow-md shadow-indigo-200 shrink-0"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="animate-spin" size={18} />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <PlusCircle size={18} />
                                    Add Permission
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Content Section */}
                <div className="pt-2">
                    {loading ? (
                        // Skeleton Loader
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-md animate-pulse">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="w-8 h-8 bg-slate-100 rounded-lg"></div>
                                        <div className="w-6 h-6 bg-slate-100 rounded-md"></div>
                                    </div>
                                    <div className="h-5 bg-slate-200 rounded w-2/3 mb-2"></div>
                                    <div className="h-3 bg-slate-100 rounded w-full mb-1"></div>
                                    <div className="h-3 bg-slate-100 rounded w-4/5"></div>
                                </div>
                            ))}
                        </div>
                    ) : permissions.length > 0 ? (
                        // Permissions Grid
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                            {permissions.map((p) => (
                                <div
                                    key={p._id}
                                    className="relative group bg-white flex flex-col p-5 border border-slate-200 rounded-2xl hover:shadow-md hover:border-indigo-200 hover:-translate-y-1 transition-all duration-200"
                                >
                                    <div className="absolute top-2 right-2">
                                        <button
                                            onClick={() => deletePermission(p._id)}
                                            className="text-red-500 p-2 bg-red-50 rounded-lg transition-colors"
                                            title="Delete Permission"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                    
                                    <div className="space-y-1.5">
                                        <h3 className="font-bold text-slate-800 wrap-break-word">{p.name}</h3>
                                        <p className="text-sm text-slate-500 capitalize">
                                            {p.module}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        // Empty State
                        <div className="py-16 bg-white rounded-2xl border border-dashed border-slate-300 flex flex-col items-center justify-center text-center px-4">
                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                                <Info size={28} className="text-slate-400" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-800 mb-1">No Permissions Configured</h3>
                            <p className="text-sm text-slate-500 max-w-md">
                                You haven't added any access control permissions yet. Use the form above to create your first permission rule.
                            </p>
                        </div>
                    )}
                </div>
                
            </div>
        </div>
    );
};

export default Permissions;