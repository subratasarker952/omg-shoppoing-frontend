import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
    Save, Loader2, Settings as SettingsIcon, Globe,
    Truck, ShieldCheck, Link as LinkIcon, Image as ImageIcon, Search
} from "lucide-react";
import api from "../../../../services/axios";
import { useConfig } from "../../../../context/ConfigContext";

const SettingInput = ({ label, name, register, validation, error, type = "text", placeholder }) => (
    <div className="space-y-2">
        <label className="text-[11px] font-bold text-gray-500 uppercase ml-1 tracking-wider">{label}</label>
        <input
            type={type}
            {...register(name, validation)}
            placeholder={placeholder}
            className={`w-full bg-gray-50 border-none rounded-2xl p-4 focus:ring-2 transition-all outline-none font-medium ${error ? "focus:ring-red-500 ring-1 ring-red-200" : "focus:ring-blue-500 text-gray-800"
                }`}
        />
        {error && <p className="text-red-500 text-[10px] font-bold uppercase ml-1">{error.message}</p>}
    </div>
);

const AdminSettings = () => {
    const [loading, setLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const { refreshConfig } = useConfig();
    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await api.get("/api/settings");
                console.log(res);
                if (res.data.success) {
                    reset(res.data.settings);
                }
            } catch (error) {
                console.error(error);
                toast.error("সেটিংস লোড করা যায়নি");
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, [reset]);

    const onSubmit = async (data) => {
        setIsUpdating(true);
        try {
            // বুলিয়ান ভ্যালুগুলোকে কনভার্ট করা (যদি সিলেক্ট থেকে স্ট্রিং আসে)
            const payload = {
                ...data,
                maintenanceMode: data.maintenanceMode === "true" || data.maintenanceMode === true,
                registrationEnabled: data.registrationEnabled === "true" || data.registrationEnabled === true,
                guestCheckout: data.guestCheckout === "true" || data.guestCheckout === true,
            };

            const res = await api.post("/api/settings/update", payload);
            if (res.data.success) {
                toast.success("সব সেটিংস সফলভাবে আপডেট হয়েছে!");
                refreshConfig(); // ৩. গ্লোবাল স্টেট আপডেট
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "আপডেট ব্যর্থ হয়েছে");
        } finally {
            setIsUpdating(false);
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-screen">
            <Loader2 className="animate-spin text-black" size={40} />
        </div>
    );

    return (
        <div className="container mx-auto p-4 pb-32 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="flex items-center gap-3 mb-10 border-b pb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <SettingsIcon className="text-violet-600" /> System Setting
                    </h1>
                    <p className="text-sm text-gray-500">Manage your global store rules</p>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 text-black ">

                {/* 1. General & Branding */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1">
                        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2"><Globe size={20} /> General</h3>
                        <p className="text-sm text-gray-500">সাইটের নাম, ইমেইল এবং কারেন্সি সেটিংস।</p>
                    </div>
                    <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6">
                        <SettingInput label="Site Name" name="siteName" register={register} validation={{ required: "Required" }} error={errors.siteName} />
                        <SettingInput label="Support Email" name="siteEmail" register={register} />
                        <SettingInput label="Contact Phone" name="sitePhone" register={register} />
                        <div className="grid grid-cols-2 gap-4">
                            <SettingInput label="Currency" name="currency" register={register} placeholder="BDT" />
                            <SettingInput label="Symbol" name="currencySymbol" register={register} placeholder="৳" />
                        </div>
                        <SettingInput label="Hero Banner" name="heroBanner" register={register} placeholder={'https://yourimage.png'} />
                    </div>
                </div>

                {/* 2. Logistics & Shipping */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 border-t pt-8">
                    <div className="lg:col-span-1">
                        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2"><Truck size={20} /> Logistics</h3>
                        <p className="text-sm text-gray-500">শিপিং চার্জ এবং ফ্রি ডেলিভারি থ্রেশহোল্ড সেট করুন।</p>
                    </div>
                    <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6">
                        <SettingInput label="Inside Dhaka" name="shippingInsideDhaka" type="number" register={register} />
                        <SettingInput label="Outside Dhaka" name="shippingOutsideDhaka" type="number" register={register} />
                        <SettingInput label="Free Shipping Over" name="freeShippingThreshold" type="number" register={register} />
                    </div>
                </div>

                {/* 3. SEO & Assets */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 border-t pt-8">
                    <div className="lg:col-span-1">
                        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2"><Search size={20} /> SEO & Assets</h3>
                        <p className="text-sm text-gray-500">গুগল সার্চ অপ্টিমাইজেশন এবং ইমেজ লিঙ্কস।</p>
                    </div>
                    <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4">
                        <SettingInput label="Meta Title" name="metaTitle" register={register} />
                        <div className="space-y-2">
                            <label className="text-[11px] font-bold text-gray-500 uppercase">Meta Description</label>
                            <textarea {...register("metaDescription")} className="w-full bg-gray-50 border-none rounded-2xl p-4 min-h-25 outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <SettingInput label="Logo URL" name="logoUrl" register={register} placeholder="/assets/logo.png" />
                            <SettingInput label="Favicon URL" name="faviconUrl" register={register} placeholder="/favicon.ico" />
                        </div>
                    </div>
                </div>

                {/* 4. Social Links */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 border-t pt-8">
                    <div className="lg:col-span-1">
                        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2"><LinkIcon size={20} /> Social Links</h3>
                        <p className="text-sm text-gray-500">আপনার সোশ্যাল মিডিয়া প্রোফাইল লিঙ্ক।</p>
                    </div>
                    <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6">
                        <SettingInput label="Facebook URL" name="facebookUrl" register={register} />
                        <SettingInput label="Instagram URL" name="instagramUrl" register={register} />
                        <SettingInput label="Twitter URL" name="twitterUrl" register={register} />
                        <SettingInput label="LinkedIn URL" name="linkedinUrl" register={register} />
                    </div>
                </div>

                {/* 5. Access Control */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 border-t pt-8">
                    <div className="lg:col-span-1">
                        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2"><ShieldCheck size={20} /> Access Control</h3>
                        <p className="text-sm text-gray-500">সিস্টেম স্ট্যাটাস এবং রেজিস্ট্রেশন কন্ট্রোল।</p>
                    </div>
                    <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <label className="text-[11px] font-bold text-gray-500 uppercase ml-1">Maintenance Mode</label>
                            <select {...register("maintenanceMode")} className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold outline-none focus:ring-2 focus:ring-red-500 appearance-none cursor-pointer">
                                <option value="false">🟢 Live Mode</option>
                                <option value="true">🔴 Maintenance</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[11px] font-bold text-gray-500 uppercase ml-1">User Registration</label>
                            <select {...register("registrationEnabled")} className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer">
                                <option value="true">✅ Enabled</option>
                                <option value="false">🚫 Disabled</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[11px] font-bold text-gray-500 uppercase ml-1">Guest Checkout</label>
                            <select {...register("guestCheckout")} className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold outline-none focus:ring-2 focus:ring-green-500 appearance-none cursor-pointer">
                                <option value="true">✅ Enabled</option>
                                <option value="false">🚫 Disabled</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-center z-50">
                    <button
                        type="submit"
                        disabled={isUpdating}
                        className="flex items-center gap-3 bg-black text-white px-8 py-4 rounded-full font-black hover:scale-105 transition-all active:scale-95 disabled:bg-gray-400 shadow-2xl group"
                    >
                        {isUpdating ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                        <span className="flex-1 uppercase tracking-widest text-sm">Update Global Settings</span>
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AdminSettings;