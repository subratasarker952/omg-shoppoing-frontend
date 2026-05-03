import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast'; // বা আপনার পছন্দের টোস্ট লাইব্রেরি
import api from '../services/axios';

export const useAddresses = () => {
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // ১. সব অ্যাড্রেস ফেচ করা
    const fetchAddresses = useCallback(async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/api/users/addresses'); // আপনার এপিআই এন্ডপয়েন্ট
            setAddresses(data.addresses);
            setError(null);
        } catch (err) {
            const message = err.response?.data?.message || "অ্যাড্রেস লোড করতে সমস্যা হয়েছে";
            setError(message);
            toast.error(message);
        } finally {
            setLoading(false);
        }
    }, []);

    // ২. নতুন অ্যাড্রেস যোগ করা
    const addAddress = async (addressData) => {
        try {
            const { data } = await api.post('/api/users/addresses', addressData);
            const { success, message } = data
            if (success) {
                toast.success(message || "অ্যাড্রেস সফলভাবে যোগ করা হয়েছে");
            }
            fetchAddresses()
            return data;
        } catch (err) {
            toast.error(err.response?.data?.message || "অ্যাড্রেস যোগ করা যায়নি");
            throw err;
        }
    };

    // ৩. অ্যাড্রেস ডিলিট করা
    const deleteAddress = async (id) => {
        try {
            const { data } = await api.delete(`/api/users/address/${id}`);
            const { success, message } = data
            if (success) {
                toast.success(message || "অ্যাড্রেস ডিলিট করা হয়েছে");
            }
            fetchAddresses()
            return data
        } catch (err) {
            console.error(err);
            toast.error("ডিলিট করতে সমস্যা হয়েছে");
        }
    };


    const updateAddress = async (updatedData) => {
        try {
            const { data } = await api.put(`/api/users/address/${updatedData._id}`, updatedData);
            const { success, message } = data
            if (success) {
                toast.success(message || "অ্যাড্রেস আপডেট হয়েছে!");
            }
            fetchAddresses()
        } catch (err) {
            console.error(err);
            toast.error("আপডেট করা যায়নি");
        }
    };

    useEffect(() => {
        fetchAddresses();
    }, [fetchAddresses]);

    return {
        addresses,
        loading,
        error,
        refresh: fetchAddresses,
        addAddress,
        deleteAddress,
        updateAddress,
    };
};