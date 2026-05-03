import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Star, MessageSquare, User, Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../../../../services/axios';
import { useAuth } from '../../../../context/AuthContext';
import { Link } from 'react-router-dom';

const ReviewForm = ({ productId }) => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [hoverRating, setHoverRating] = useState(0);

    const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm({
        defaultValues: { rating: 5, comment: "" }
    });

    const selectedRating = watch("rating");

    const onSubmit = async (data) => {
        if (data.rating === 0) return toast.error("অনুগ্রহ করে রেটিং সিলেক্ট করুন");
        
        setLoading(true);
        try {
            await api.post('/api/reviews', { ...data, productId });
            toast.success("রিভিউ দেওয়ার জন্য ধন্যবাদ!");
            reset();
            // fetchReviews();
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "রিভিউ দিতে ব্যর্থ হয়েছে");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-3xl shadow-sm">
            {/* Review Form */}
            {user ? (
                <form onSubmit={handleSubmit(onSubmit)} className="bg-slate-50 p-6 rounded-2xl  space-y-4">
                    <p className="font-semibold text-slate-700">আপনার মতামত লিখুন</p>
                    
                    {/* Interactive Star Rating */}
                    <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setValue("rating", star)}
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                                className="transition-transform active:scale-90"
                            >
                                <Star
                                    size={32}
                                    className={`${
                                        (hoverRating || selectedRating) >= star 
                                        ? "fill-yellow-400 text-yellow-400" 
                                        : "text-slate-300"
                                    } transition-colors duration-200`}
                                />
                            </button>
                        ))}
                    </div>

                    <textarea
                        {...register("comment", { required: "আপনার মতামত লিখুন" })}
                        placeholder="প্রোডাক্টটি কেমন ছিল? আপনার অভিজ্ঞতা শেয়ার করুন..."
                        className="w-full p-4 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 min-h-30 transition-all"
                    ></textarea>
                    {errors.comment && <p className="text-red-500 text-xs">{errors.comment.message}</p>}

                    <button
                        disabled={loading}
                        className="btn w-full btn-primary px-8 rounded-xl text-white shadow-lg shadow-primary/20"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : "Submit Review"}
                    </button>
                </form>
            ) : (
                <div className="bg-primary/5 p-6 rounded-2xl text-center">
                    <p className="text-slate-600">রিভিউ দিতে হলে আপনাকে অবশ্যই <Link to="/login" className="text-primary font-bold underline">লগইন</Link> করতে হবে।</p>
                </div>
            )}
        </div>
    );
};

export default ReviewForm;