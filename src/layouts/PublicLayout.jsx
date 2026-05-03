import React from 'react';
import ScrollToTop from '../components/shared/ScrollToTop';
import PublicNavbar from '../components/navigationbar/PublicNavbar';
import { Outlet } from 'react-router-dom';
import Footer from '../components/shared/Footer';
import { useCart } from '../context/CartContext';
import CartDrawer from '../pages/public/product/component/CartDrawer';

const PublicLayout = () => {
    const { isCartOpen, closeCart } = useCart();
    return (<>
        <ScrollToTop />
        <PublicNavbar />
        <main className='min-h-screen p-2'>
            <Outlet />
        </main>
        <Footer />
        {/* কার্ট ড্রয়ার এখানে বসবে */}
        <CartDrawer isOpen={isCartOpen} onClose={closeCart} />
    </>);
};

export default PublicLayout;


