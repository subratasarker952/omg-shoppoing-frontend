import React from 'react';
import ScrollToTop from '../components/shared/ScrollToTop';
import AuthNavbar from '../components/navigationbar/AuthNavbar';
import { Outlet } from 'react-router-dom';
import Footer from '../components/shared/Footer';


const AuthLayout = () => {
    return (<>
        <ScrollToTop />
        <AuthNavbar />
        <main className='min-h-screen p-2 container mx-auto'>
            <Outlet />
        </main>
        <Footer />
    </>);
};

export default AuthLayout;


