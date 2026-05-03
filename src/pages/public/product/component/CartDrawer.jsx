import React from 'react';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, Zap } from 'lucide-react';
import { useCart } from '../../../../context/CartContext';
import { useNavigate } from 'react-router-dom';

const CartDrawer = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateQuantity, cartTotal, cartCount } = useCart();

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-60 transition-opacity duration-500 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Drawer Container */}
      <aside
        className={`fixed right-0 top-0 h-full w-full max-w-md bg-white z-70 shadow-2xl transition-transform duration-500 ease-out transform ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-6 border-b border-gray-50">
          <div className="flex items-center gap-3">
            <div className="relative">
              <ShoppingBag size={24} className="text-black" />
              <span className="absolute -top-2 -right-2 bg-violet-600 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            </div>
            <h2 className="text-xl text-black font-black uppercase tracking-tighter">Your Bag</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-black hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-6 h-[calc(100vh-280px)] text-black">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <div className="p-8 bg-gray-50 text-gray-300 rounded-full">
                <ShoppingBag size={48} />
              </div>
              <div>
                <p className="text-gray-900 font-black uppercase text-sm tracking-widest">Your bag is empty</p>
                <p className="text-gray-400 text-xs mt-1">Looks like you haven't added anything yet.</p>
              </div>
              <button
                onClick={() => {
                  onClose();
                  navigate('/products');
                }}
                className="bg-black text-white px-8 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-violet-600 transition-all"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.variantId} className="flex gap-4 group animate-in fade-in slide-in-from-right-4 duration-300">
                {/* Product Image */}
                <div className="w-24 h-32 bg-gray-50 rounded-2xl overflow-hidden shrink-0 border border-gray-100 relative">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {item.isFlashSale && (
                    <div className="absolute top-2 left-2 bg-red-600 text-white p-1 rounded-lg shadow-lg">
                      <Zap size={10} className="fill-current" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 flex flex-col py-1">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-black text-sm text-gray-900 line-clamp-2 leading-tight">
                      {item.name}
                    </h3>
                    <button
                      onClick={() => removeFromCart(item.variantId)}
                      className="text-red-500 transition-colors shrink-0"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-2 py-0.5 rounded-md">
                      {item.variant.color}
                    </span>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-2 py-0.5 rounded-md">
                      {item.variant.size}
                    </span>
                  </div>

                  <div className="mt-auto flex justify-between items-end">
                    {/* Quantity Selector */}
                    <div className="flex items-center bg-gray-50 rounded-xl p-1 border border-gray-100">
                      <button
                        onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                        className="p-1.5 hover:bg-white rounded-lg transition-all shadow-sm active:scale-90"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center font-black text-sm">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                        className="p-1.5 hover:bg-white rounded-lg transition-all shadow-sm active:scale-90"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <div className="text-right">
                        {/* ১. এখানে সরাসরি item.price ব্যবহার হচ্ছে যা ব্যাকএন্ড থেকে ক্যালকুলেটেড */}
                      <p className="font-black text-base text-violet-600">
                        ৳{(item.price * item.quantity).toLocaleString()}
                      </p>
                      {item.isFlashSale && (
                        <p className="text-[10px] text-gray-400 line-through font-bold">
                          ৳{(item.variant.price * item.quantity).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer / Checkout Section */}
        {cart.length > 0 && (
          <div className="absolute bottom-0 left-0 w-full bg-white border-t border-gray-100 p-6 space-y-4 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
            <div className="flex justify-between items-center">
              <span className="text-gray-400 font-black uppercase text-[11px] tracking-[0.2em]">Subtotal</span>
              <span className="text-black text-2xl font-black">৳{cartTotal.toLocaleString()}</span>
            </div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest text-center">
              Shipping & taxes calculated at checkout
            </p>
            <button
              onClick={() => {
                navigate('/dashboard/my-checkout');
                onClose();
              }}
              className="w-full bg-black text-white h-16 rounded-2xl font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-violet-600 transition-all active:scale-[0.98] shadow-xl shadow-gray-100"
            >
              Checkout Now <ArrowRight size={18} />
            </button>
          </div>
        )}
      </aside>
    </>
  );
};

export default CartDrawer;