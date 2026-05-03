import React, { useState } from "react";
import api from "../../../services/axios";
import toast from "react-hot-toast";
import { useAuth } from "../../../context/AuthContext";
import { User, Lock, Loader2, MapPin, Plus } from "lucide-react";
import { useAddresses } from "../../../hooks/useAddresses";
import AddAddressModal from "../../public/product/component/AddAddressModal";
import AddressCard from "../../public/product/component/AddressCard";

const MyProfile = () => {
    const { user, refetchUser } = useAuth();
    const { addAddress, addresses, deleteAddress, updateAddress } = useAddresses()
    const [name, setName] = useState(user?.name || "");
    const [passwords, setPasswords] = useState({ current: "", new: "" });
    const [open, setOpen] = useState(false);

    const [selectedAddress, setSelectedAddress] = useState(null);

    const handleEditClick = (address) => {
        setSelectedAddress(address); // এডিট করার জন্য অ্যাড্রেস সিলেক্ট করা
        setOpen(true);
    };

    const handleCloseModal = () => {
        setSelectedAddress(null); // মোডাল ক্লোজ করলে স্টেট ক্লিয়ার করা
        setOpen(false);
    };

    const [loading, setLoading] = useState({ profile: false, password: false });

    // 1. Update Basic Profile
    const handleUpdateProfile = async () => {
        if (!name.trim()) return toast.error("Name is required");
        try {
            setLoading(prev => ({ ...prev, profile: true }));
            const res = await api.put("/api/users/update-profile", { name });
            if (res.data.success) {
                toast.success("Profile updated!");
                refetchUser();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Update failed");
        } finally {
            setLoading(prev => ({ ...prev, profile: false }));
        }
    };

    // 2. Change Password
    const handleChangePassword = async () => {
        if (!passwords.current || !passwords.new) return toast.error("Fill both password fields");
        try {
            setLoading(prev => ({ ...prev, password: true }));
            const res = await api.put("/api/users/change-password", {
                currentPassword: passwords.current,
                newPassword: passwords.new,
            });
            if (res.data.success) {
                toast.success("Password changed successfully");
                setPasswords({ current: "", new: "" });
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Password change failed");
        } finally {
            setLoading(prev => ({ ...prev, password: false }));
        }
    };

    return (
        <div className="container mx-auto p-2 space-y-6 min-h-screen bg-gray-50">

            {/* Header */}
            <div className="border-b border-black pb-5">
                <h1 className="text-2xl font-bold text-black flex items-center gap-2">
                    <User className="text-violet-600" /> Account Setting
                </h1>
                <p className="text-sm text-gray-500">Manage your profile information</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Profile & Security */}
                <div className="lg:col-span-1 space-y-4">
                    {/* Basic Info */}
                    <section className="bg-white border rounded-2xl p-6 shadow-sm">
                        <div className="flex items-center gap-2 mb-6 text-blue-600">
                            <User size={20} />
                            <h2 className="text-lg font-bold">Personal Info</h2>
                        </div>
                        <div className="text-black space-y-4">
                            <input
                                className="w-full border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Your Name"
                            />
                            <input
                                className="w-full text-black bg-gray-50 border rounded-xl px-4 py-2.5 cursor-not-allowed"
                                value={user?.email}
                                disabled
                            />
                            <button
                                onClick={handleUpdateProfile}
                                disabled={loading.profile}
                                className="w-full bg-blue-600 text-white font-bold py-2.5 rounded-xl hover:bg-blue-700 transition flex items-center justify-center gap-2"
                            >
                                {loading.profile && <Loader2 size={18} className="animate-spin" />}
                                Save Changes
                            </button>
                        </div>
                    </section>

                    {/* Security Info */}
                    <section className="bg-white border rounded-2xl p-6 shadow-sm">
                        <div className="flex items-center gap-2 mb-6 text-red-500">
                            <Lock size={20} />
                            <h2 className="text-lg font-bold">Security</h2>
                        </div>
                        <div className=" space-y-4">
                            <input
                                type="password"
                                placeholder="Current Password"
                                className="w-full text-black border rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-red-500"
                                value={passwords.current}
                                onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                            />
                            <input
                                type="password"
                                placeholder="New Password"
                                className="w-full text-black border rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-red-500"
                                value={passwords.new}
                                onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                            />
                            <button
                                onClick={handleChangePassword}
                                disabled={loading.password}
                                className="w-full bg-gray-900 text-white font-bold py-2.5 rounded-xl hover:bg-black transition flex items-center justify-center gap-2"
                            >
                                {loading.password && <Loader2 size={18} className="animate-spin" />}
                                Update Password
                            </button>
                        </div>
                    </section>
                </div>

                {/* Right Column: Address Management */}
                <div className="lg:col-span-2">
                    <section className="bg-white border rounded-2xl p-4 shadow-sm h-full">
                        <div className="flex justify-between items-center mb-6 gap-2">
                            <div className="flex items-center gap-2 text-orange-600">
                                <MapPin size={22} />
                                <h2 className="text-xl font-bold text-gray-800">Saved Addresses</h2>
                            </div>
                            <button
                                onClick={() => setOpen(true)}
                                className="flex items-center gap-1 text-sm font-bold bg-orange-50 text-orange-600 p-2 rounded-full hover:bg-orange-100 transition"
                            >
                                <Plus size={16} /> Add New
                            </button>
                        </div>

                        {addresses.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {addresses.map((addr) => (
                                    <AddressCard
                                        key={addr._id}
                                        address={addr}
                                        deleteAddress={deleteAddress}
                                        editAddress={handleEditClick}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 border-2 border-dashed rounded-2xl">
                                <p className="text-gray-400 font-medium">No addresses saved yet.</p>
                            </div>
                        )}
                    </section>
                </div>
            </div>

            {/* Modal */}
            <AddAddressModal
                isOpen={open}
                onClose={handleCloseModal}
                onSave={selectedAddress ? updateAddress : addAddress}
                initialData={selectedAddress}
            />
        </div>
    );
};

export default MyProfile;