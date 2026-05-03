import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
    const [wishlist, setWishlist] = useState(() => {
        const saved = localStorage.getItem('wishlist');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
    }, [wishlist]);

    const addToWishlist = (product) => {
        const exists = wishlist.find(item => item._id === product._id);
        if (exists) {
            setWishlist(wishlist.filter(item => item._id !== product._id));
            toast.success("উইশলিস্ট থেকে সরানো হয়েছে");
        } else {
            setWishlist([...wishlist, product]);
            toast.success("উইশলিস্টে যোগ করা হয়েছে");
        }
    };

    const removeFromWishlist = (id) => {
        setWishlist(wishlist.filter(item => item._id !== id));
    };

    const isInWishlist = (id) => wishlist.some(item => item._id === id);

    return (
        <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useWishlist = () => useContext(WishlistContext);