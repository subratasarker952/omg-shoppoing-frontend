import React from "react";
import { Edit3, Trash2, Box, Tag } from "lucide-react";
import api from "../../../../../services/axios";
import toast from "react-hot-toast";

const ProductCard = ({ product, onEdit, onDeleteSuccess }) => {

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                await api.delete(`/api/products/soft/${product._id}`);
                onDeleteSuccess();
            } catch (error) {
                console.error(error);
                toast.error("Failed to delete product");
            }
        }
    };

    return (
        <div className="bg-white rounded-4xl border border-gray-100 overflow-hidden group hover:shadow-xl transition-all duration-300">
            {/* Product Image */}
            <div className="relative h-48 overflow-hidden bg-gray-100">
                <img
                    src={product.images[0]?.url || "https://via.placeholder.com/300"}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${product.variants[0]?.stock > 0 ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                        {product.variants[0]?.stock > 0 ? 'In Stock' : 'Out of Stock'}
                    </span>
                </div>
            </div>

            {/* Product Details */}
            <div className="p-5 space-y-3">
                <div>
                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">{product.category?.name || "Uncategorized"}</p>
                    <h3 className="font-bold text-gray-800 line-clamp-1">{product.name}</h3>
                </div>

                <div className="flex justify-between items-center bg-gray-50 p-3 rounded-2xl">
                    <div className="flex items-center gap-1 text-gray-500">
                        <Box size={14} />
                        <span className="text-xs font-bold">{product.variants?.reduce((acc, v) => acc + v.stock, 0)} Pcs</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-900 font-black">
                        <Tag size={14} className="text-orange-500" />
                        <span className="text-sm">৳{product.basePrice}</span>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-2">
                    <button
                        onClick={onEdit}
                        className="flex items-center justify-center gap-2 py-2.5 bg-gray-900 text-white rounded-xl text-xs font-bold hover:bg-blue-600 transition-colors"
                    >
                        <Edit3 size={14} /> EDIT
                    </button>
                    <button
                        onClick={handleDelete}
                        className="flex items-center justify-center gap-2 py-2.5 bg-red-50 text-red-500 rounded-xl text-xs font-bold hover:bg-red-500 hover:text-white transition-all"
                    >
                        <Trash2 size={14} /> DELETE
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
