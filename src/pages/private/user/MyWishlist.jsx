import React from 'react';
import { Heart, ShoppingCart, Trash2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../../../context/WishlistContext';

const MyWishlist = () => {
    const { wishlist, removeFromWishlist } = useWishlist();

    if (wishlist.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center  space-y-4">
                <div className="p-6 bg-slate-200 dark:text-white text-black dark:bg-gray-600 rounded-full">
                    <Heart size={60} />
                </div>
                <h2 className="text-2xl font-bold">Your wishlist is empty</h2>
                <p className="text-slate-500">Add items you love to find them easily later.</p>
                <Link to="/products" className="btn btn-primary px-8 rounded-xl text-white">
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-1">
            <header className="mb-10 flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Heart className="text-violet-600" />My Wishlist
                    </h1>
                    <p className="text-gray-500 text-sm font-medium">Manage Favorite items ({wishlist?.length || 0})</p>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {wishlist.map((product) => (
                    <div key={product._id} className="group bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden relative">
                        {/* Image Section */}
                        <div className="relative h-64 overflow-hidden bg-slate-100">
                            <img
                                src={product.images[0].url}
                                alt={product.name}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <button
                                onClick={() => removeFromWishlist(product._id)}
                                className="absolute top-4 right-4 p-2 bg-white/85  backdrop-blur-sm text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>

                        {/* Content Section */}
                        <div className="p-6">
                            <h3 className="font-bold text-xl text-slate-800 truncate mb-1">
                                {product.name}
                            </h3>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-2xl font-black text-primary">৳{product.basePrice}</span>
                                {product.oldPrice && (
                                    <span className="text-sm text-slate-400 line-through">৳{product.oldPrice}</span>
                                )}
                            </div>


                            <Link
                                to={`/products/${product._id}`}
                                className="flex-1 bg-slate-900 text-white py-3 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-primary transition-all active:scale-95"
                            >
                                <ShoppingCart size={18} /> Details
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyWishlist;