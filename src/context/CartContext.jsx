import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cart, setCart] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('peyejan_cart');
      try {
        return savedCart ? JSON.parse(savedCart) : [];
      } catch (error) {
        console.error("Cart parsing error:", error);
        return [];
      }
    }
    return [];
  });

  // ১. সিনক্রোনাইজেশন: কার্ট চেঞ্জ হলেই লোকাল স্টোরেজ আপডেট
  useEffect(() => {
    localStorage.setItem('peyejan_cart', JSON.stringify(cart));
  }, [cart]);

  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);

  // ২. addToCart: ব্যাকএন্ডের ক্যালকুলেটেড ডাটা গ্রহণ করা
  const addToCart = useCallback((product, variant, quantity = 1, finalPrice = null, isFlashSale = false) => {
    if (!variant?._id) {
      toast.error("ভেরিয়েন্ট সিলেক্ট করা হয়নি!");
      return;
    }

    // স্টক চেক লজিক
    if (variant.stock <= 0) {
      toast.error("দুঃখিত, এই ভেরিয়েন্টটি স্টকে নেই");
      return;
    }

    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(item => item.variantId === variant._id);
      
      // ব্যাকএন্ড থেকে আসা ফাইনাল প্রাইস অথবা ভেরিয়েন্টের বেজ প্রাইস
      const priceToStore = finalPrice !== null ? finalPrice : variant.price;

      if (existingItemIndex > -1) {
        const existingItem = prevCart[existingItemIndex];
        const newQuantity = existingItem.quantity + quantity;

        // আপডেট করার সময়ও স্টক চেক
        if (newQuantity > variant.stock) {
          toast.error(`দুঃখিত, সর্বোচ্চ ${variant.stock} টি কেনা সম্ভব`);
          return prevCart;
        }

        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex] = {
          ...existingItem,
          quantity: newQuantity,
          price: priceToStore, // কার্টে থাকা অবস্থায় প্রাইস আপডেট হতে পারে (যেমন সেল শুরু হলে)
          isFlashSale
        };
        
        toast.success("কার্টে পরিমাণ বাড়ানো হয়েছে");
        return updatedCart;
      }

      // নতুন আইটেম হিসেবে যোগ করা
      toast.success("পণ্যটি কার্টে যোগ করা হয়েছে");
      return [...prevCart, {
        productId: product._id,
        variantId: variant._id,
        name: product.name,
        image: product.images[0]?.url,
        variant: {
          ...variant, // আমরা এখানে পুরো ভেরিয়েন্ট রাখছি কিন্তু প্রাইস হিসেবে ব্যাকএন্ডের ক্যালকুলেটেড প্রাইস ব্যবহার করব
        },
        quantity: quantity,
        price: priceToStore,
        isFlashSale: isFlashSale
      }];
    });
  }, []);

  // ৩. আপডেট কোয়ান্টিটি (Inline Cart Update)
  const updateQuantity = useCallback((variantId, newQty) => {
    if (newQty < 1) return;

    setCart(prevCart => prevCart.map(item => {
      if (item.variantId === variantId) {
        if (newQty > item.variant.stock) {
          toast.error(`দুঃখিত, স্টকে মাত্র ${item.variant.stock} টি আছে`);
          return item;
        }
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  }, []);

  const removeFromCart = useCallback((variantId) => {
    setCart(prev => prev.filter(item => item.variantId !== variantId));
    toast.success("পণ্যটি কার্ট থেকে সরানো হয়েছে");
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
    toast.success("কার্ট ক্লিয়ার করা হয়েছে");
  }, []);

  // ৪. মেমোয়াইজড ক্যালকুলেশন (পারফরম্যান্স বুস্ট)
  // cartTotal এখন সরাসরি item.price ব্যবহার করবে যা ব্যাকএন্ড থেকে ফিক্সড হয়ে এসেছে
  const cartTotal = useMemo(() => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  }, [cart]);

  const cartCount = useMemo(() => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  }, [cart]);

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      clearCart,
      updateQuantity,
      cartTotal,
      cartCount,
      isCartOpen,
      openCart,
      closeCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};