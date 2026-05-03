import React, { useState, useEffect } from 'react';
import { Star, Trash2, Loader2, MessageSquare, Search, Filter, ExternalLink } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import api from '../../../../services/axios';


const AdminReviews = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterRating, setFilterRating] = useState("all");

    const fetchAllReviews = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/api/reviews');
            setReviews(data.reviews);
        } catch (error) {
            console.error(error);
            toast.error("রিভিউ লোড করতে ব্যর্থ হয়েছে");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllReviews();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("আপনি কি নিশ্চিতভাবে এই রিভিউটি মুছে ফেলতে চান?")) return;
        try {
            await api.delete(`/api/reviews/${id}`);
            toast.success("Review deleted successfully");
            setReviews(reviews.filter(r => r._id !== id));
        } catch (error) {
            console.error(error);
            toast.error("Error deleting review");
        }
    };

    // ফিল্টারিং লজিক
    const filteredReviews = reviews.filter(review => {
        const matchesSearch = review.product?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            review.comment.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRating = filterRating === "all" ? true : review.rating === parseInt(filterRating);
        return matchesSearch && matchesRating;
    });

    return (
        <div className="p-1 container mx-auto  space-y-4 bg-gray-50">
            <div>
                <h2 className="text-2xl font-bold text-black flex items-center gap-2">
                    <MessageSquare className="text-violet-600" /> Review Management
                </h2>
                <p className="text-slate-500 text-sm font-medium">Monitor and moderate customer feedback ({reviews?.length || 0})</p>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 items-center bg-white p-4 rounded-xl shadow-sm border border-slate-50">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search product or comment..."
                        className="w-full pl-10 pr-4 py-2 text-black bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/20"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="relative flex-1 w-full">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <select
                        className="bg-slate-50 border border-slate-200 p-2 pr-4 pl-10 py-2 rounded-lg outline-none text-sm font-medium text-black w-full"
                        value={filterRating}
                        onChange={(e) => setFilterRating(e.target.value)}
                    >
                        <option value="all">All Ratings</option>
                        <option value="5">5 Stars</option>
                        <option value="4">4 Stars</option>
                        <option value="3">3 Stars</option>
                        <option value="2">2 Stars</option>
                        <option value="1">1 Star</option>
                    </select>
                </div>
            </div>

            {/* Content */}
            {loading ? (
                <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary" size={40} /></div>
            ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-50 border-b border-slate-100">
                                <tr>
                                    <th className="p-4 font-bold text-slate-600 text-sm">Customer</th>
                                    <th className="p-4 font-bold text-slate-600 text-sm">Product</th>
                                    <th className="p-4 font-bold text-slate-600 text-sm">Comment</th>
                                    <th className="p-4 font-bold text-slate-600 text-sm">Date</th>
                                    <th className="p-4 font-bold text-slate-600 text-sm text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filteredReviews.map((review) => (
                                    <tr key={review._id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="p-4">
                                            <div className="font-semibold text-slate-800">{review.user?.name}</div>
                                            <div className="text-xs text-slate-400">{review.user?.email}</div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex gap-0.5">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} size={14} className={i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-slate-200"} />
                                                ))}
                                            </div>
                                            <Link to={`/products/${review.product?._id}`} className="flex items-center gap-1 text-primary hover:underline font-medium">
                                                {review.product?.name?.substring(0, 20)}... <ExternalLink size={12} />
                                            </Link>
                                        </td>
                                        <td className="p-4">
                                            <p className="text-slate-600 text-sm max-w-xs truncate" title={review.comment}>
                                                {review.comment}
                                            </p>
                                        </td>
                                        <td className="p-4 text-sm text-slate-500">
                                            {new Date(review.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="p-4 text-center">
                                            <button
                                                onClick={() => handleDelete(review._id)}
                                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {filteredReviews.length === 0 && (
                        <div className="text-center py-20 text-slate-400">No reviews match your criteria</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AdminReviews;