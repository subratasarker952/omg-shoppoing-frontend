import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Star, MessageSquare, User, Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../../../../services/axios';
import { useAuth } from '../../../../context/AuthContext';

const ProductReviews = ({ productId }) => {
    const { user } = useAuth();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [hoverRating, setHoverRating] = useState(0);

    const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm({
        defaultValues: { rating: 5, comment: "" }
    });

    const selectedRating = watch("rating");

    const fetchReviews = async () => {
        try {
            const { data } = await api.get(`/api/reviews/${productId}`);
            setReviews(data.reviews);
        } catch (error) {
            console.error(error);
            console.error("Error fetching reviews");
        } finally {
            setFetching(false);
        }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => { fetchReviews(); }, [productId]);

    const onSubmit = async (data) => {
        if (data.rating === 0) return toast.error("অনুগ্রহ করে রেটিং সিলেক্ট করুন");
        
        setLoading(true);
        try {
            await api.post('/api/reviews', { ...data, productId });
            toast.success("রিভিউ দেওয়ার জন্য ধন্যবাদ!");
            reset();
            fetchReviews();
        } catch (error) {
            toast.error(error.response?.data?.message || "রিভিউ দিতে ব্যর্থ হয়েছে");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-12 space-y-8 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <h3 className="text-2xl font-bold flex items-center gap-2">
                <MessageSquare className="text-primary" /> Customer Reviews ({reviews.length})
            </h3>

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
                        className="btn btn-primary px-8 rounded-xl text-white shadow-lg shadow-primary/20"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : "Submit Review"}
                    </button>
                </form>
            ) : (
                <div className="bg-primary/5 p-6 rounded-2xl text-center border border-primary/10">
                    <p className="text-slate-600">রিভিউ দিতে হলে আপনাকে অবশ্যই <a href="/login" className="text-primary font-bold underline">লগইন</a> করতে হবে।</p>
                </div>
            )}

            {/* Reviews List */}
            <div className="space-y-6">
                {fetching ? (
                    <div className="flex justify-center py-10"><Loader2 className="animate-spin text-primary" /></div>
                ) : reviews.length > 0 ? (
                    reviews.map((review) => (
                        <div key={review._id} className="group border-b border-slate-100 pb-6 last:border-0">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold border border-slate-200">
                                        <User size={20} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <p className="font-bold text-slate-800">{review.name}</p>
                                            {review.isVerified && <CheckCircle2 size={14} className="text-green-500" title="Verified Purchase" />}
                                        </div>
                                        <p className="text-[10px] text-slate-400">{new Date(review.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="flex gap-0.5">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <Star key={s} size={14} className={`${review.rating >= s ? "fill-yellow-400 text-yellow-400" : "text-slate-200"}`} />
                                    ))}
                                </div>
                            </div>
                            <p className="text-slate-600 leading-relaxed pl-13">
                                {review.comment}
                            </p>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-10 text-slate-400">এখনো কোনো রিভিউ দেওয়া হয়নি। প্রথম রিভিউটি আপনি দিন!</div>
                )}
            </div>
        </div>
    );
};

export default ProductReviews;