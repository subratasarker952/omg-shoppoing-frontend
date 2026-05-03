import React, { useState, useEffect } from 'react';
import { Star, MessageSquareText, Trash2, Package, Calendar, Loader2, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../../../services/axios';

const MyReviews = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchMyReviews = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/api/reviews/my-reviews'); // এই এন্ডপয়েন্টটি ব্যাকএন্ডে লাগবে
            setReviews(data.reviews);
        } catch (error) {
            console.error(error);
            toast.error("রিভিউ লোড করতে সমস্যা হয়েছে");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyReviews();
    }, []);

    const handleDeleteReview = async (id) => {
        if (!window.confirm("আপনি কি এই রিভিউটি মুছে ফেলতে চান?")) return;
        try {
            await api.delete(`/api/reviews/${id}`);
            toast.success("রিভিউটি মুছে ফেলা হয়েছে");
            setReviews(reviews.filter(r => r._id !== id));
        } catch (error) {
            console.error(error);
            toast.error("রিভিউ মুছতে ব্যর্থ হয়েছে");
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-100">
                <Loader2 className="animate-spin text-primary" size={40} />
            </div>
        );
    }

    return (
        <div className="p-1 container mx-auto max-h-screen space-y-6 bg-gray-50">
            <div>
                <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                    <MessageSquareText className="text-indigo-600" /> My Product Reviews
                </h1>
                <p className="text-slate-500 text-sm mt-1">You have shared your experience on ({reviews?.length || 0}) products</p>
            </div>

            {reviews.length > 0 ? (
                <div className="grid grid-cols-1 gap-6">
                    {reviews.map((review) => (
                        <div key={review._id} className="group bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row gap-6">

                            {/* Product Info */}
                            <div className="md:w-1/4 flex flex-col items-center md:items-start border-b md:border-b-0 md:border-r border-slate-50 pb-4 md:pb-0 md:pr-6">
                                <div className="w-20 h-20 rounded-xl bg-slate-50 overflow-hidden mb-3 border border-slate-100">
                                    <img
                                        src={review.product?.image?.url || 'https://via.placeholder.com/150'}
                                        alt={review.product?.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <Link
                                    to={`/product/${review.product?._id}`}
                                    className="font-bold text-slate-800 text-sm hover:text-primary transition-colors line-clamp-2 text-center md:text-left flex items-center gap-1"
                                >
                                    {review.product?.name} <ExternalLink size={12} />
                                </Link>
                                <div className="flex items-center gap-1 mt-2 text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                                    <Calendar size={12} /> {new Date(review.createdAt).toLocaleDateString()}
                                </div>
                            </div>

                            {/* Review Content */}
                            <div className="md:w-3/4 flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex gap-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    size={18}
                                                    className={`${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-slate-200"}`}
                                                />
                                            ))}
                                        </div>
                                        <button
                                            onClick={() => handleDeleteReview(review._id)}
                                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                            title="Delete Review"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                    <p className="text-slate-600 leading-relaxed italic">
                                        "{review.comment}"
                                    </p>
                                </div>

                                <div className="mt-4 flex items-center gap-2">
                                    <span className="text-[10px] font-black uppercase px-2 py-1 bg-green-50 text-green-600 rounded-md border border-green-100">
                                        Verified Review
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-3xl p-20 text-center border border-dashed border-slate-200">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                        <Package size={40} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800">No Reviews Yet!</h3>
                    <p className="text-slate-500 mt-2">You haven't reviewed any products yet. Start sharing your thoughts!</p>
                    <Link to="/dashboard/my-orders" className="btn btn-primary mt-6 rounded-xl px-8 text-white">
                        Review Recent Orders
                    </Link>
                </div>
            )}
        </div>
    );
};

export default MyReviews;