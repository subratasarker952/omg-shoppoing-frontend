import React from "react";
import { Star, Zap } from "lucide-react"; // Zap icon ফ্ল্যাশ সেলের জন্য ভালো দেখায়
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product, flashSaleDiscount }) => {
  const navigate = useNavigate();
  const hasDiscount = flashSaleDiscount > 0;

  // প্রাইস ক্যালকুলেশন
  const salePrice = hasDiscount
    ? Math.round(product.basePrice - (product.basePrice * flashSaleDiscount / 100))
    : product.basePrice;

  return (
    <div
      onClick={() => navigate(`/products/${product._id}`)}
      className="group relative bg-white border border-gray-100 rounded-4xl md:rounded-[2.5rem] p-3 md:p-4 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] hover:-translate-y-2 cursor-pointer overflow-hidden"
    >
      {/* Image Container */}
      <div className="relative aspect-square rounded-3xl md:rounded-3xl bg-gray-50 overflow-hidden mb-3 md:mb-5">
        <img
          src={product.images[0]?.url || "/placeholder-image.png"}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* Top Badges Area */}
        <div className="absolute top-2 left-2 md:top-4 md:left-4 flex flex-col gap-2">
          {/* Stock Badge Logic */}
          {(() => {
            const stock = product.variants?.[0]?.stock || 0;

            if (stock === 0) {
              return (
                <div className="bg-red-600/90 backdrop-blur-md text-white text-[8px] md:text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-wider">
                  Out of Stock
                </div>
              );
            }

            if (stock < 5) {
              return (
                <div className="bg-orange-500/90 backdrop-blur-md text-white text-[8px] md:text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-wider">
                  Low Stock ({stock})
                </div>
              );
            }

            return null; // স্টক ৫ এর বেশি হলে কিছুই দেখাবে না
          })()}

          {/* Flash Sale Badge - ইমেজের ওপর থাকলে বেশি প্রফেশনাল লাগে */}
          {hasDiscount && (
            <div className="flex items-center gap-1 bg-red-600 text-white px-2 py-1 md:px-3 md:py-1.5 rounded-lg shadow-lg shadow-red-500/30 animate-pulse">
              <Zap size={12} className="fill-white" />
              <span className="text-[9px] md:text-[11px] font-black uppercase">-{flashSaleDiscount}% OFF</span>
            </div>
          )}
        </div>
      </div>

      {/* Info Section */}
      <div className="px-1 md:px-2">
        <div className="flex items-center justify-between mb-1 md:mb-2">
          <p className="text-[8px] md:text-[10px] font-black text-violet-600 uppercase tracking-[0.15em]">
            {product.category?.name || "Premium"}
          </p>
          <div className="flex items-center gap-1 bg-gray-50 px-2 py-0.5 rounded-full">
            <Star size={10} className="fill-orange-400 text-orange-400" />
            <span className="text-[10px] font-bold text-gray-700">4.8</span>
          </div>
        </div>

        <h3 className="font-bold text-gray-900 text-[12px] md:text-lg line-clamp-1 mb-2 md:mb-3 group-hover:text-violet-600 transition-colors">
          {product.name}
        </h3>

        {/* Price Area */}
        <div className="flex items-end gap-2 md:gap-3 flex-wrap">
          {hasDiscount ? (
            <>
              <span className="text-lg md:text-2xl font-black text-gray-900 leading-none">
                ৳{salePrice.toLocaleString()}
              </span>
              <span className="text-[10px] md:text-sm line-through text-gray-400 font-bold mb-0.5">
                ৳{product.basePrice.toLocaleString()}
              </span>
            </>
          ) : (
            <span className="text-lg md:text-2xl font-black text-gray-900 leading-none">
              ৳{product.basePrice.toLocaleString()}
            </span>
          )}
        </div>
      </div>

      {/* Quick Add Visual Decoration */}
      <div className="absolute bottom-4 right-4 translate-y-2 group-hover:translate-y-0 transition-all duration-300 hidden md:block">
        <div className="bg-black text-white p-3 rounded-2xl shadow-xl">
          <Zap size={18} />
        </div>
      </div>
    </div>
  );
};

export default ProductCard;