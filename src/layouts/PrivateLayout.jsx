import { Outlet } from "react-router-dom";
import PrivateNavbar from "../components/navigationbar/PrivateNavbar";
import DynamicSidebar from "../components/navigationbar/DynamicSidebar";
import { useCart } from "../context/CartContext";
import CartDrawer from "../pages/public/product/component/CartDrawer";

const PrivateLayout = () => {
    const { isCartOpen, closeCart } = useCart();

    return (
        <div className="drawer lg:drawer-open bg-base-200 min-h-screen">

            <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />

            {/* Main Content */}
            <div className="drawer-content flex flex-col">

                {/* Navbar */}
                <PrivateNavbar />

                {/* Page Content */}
                <main className="flex-1 p-2 container mx-auto">
                    <Outlet />
                </main>

            </div>

            {/* Sidebar */}
            <div className="drawer-side z-40">
                <label htmlFor="dashboard-drawer" className="drawer-overlay"></label>
                <DynamicSidebar />
            </div>
            {/* কার্ট ড্রয়ার এখানে বসবে */}
            <CartDrawer isOpen={isCartOpen} onClose={closeCart} />
        </div>
    );
};

export default PrivateLayout;