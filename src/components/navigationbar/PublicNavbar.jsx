import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { DYNAMIC_MENU, PUBLIC_LINKS } from "../../constants/appData";
import { LayoutDashboard, LogIn, LogOut, Menu, ShoppingBag } from "lucide-react";
import ShopName from "../shared/ShopName";
import { useCart } from "../../context/CartContext";

const PublicNavbar = () => {
  const { user, logout } = useAuth();
  const { openCart, cartCount } = useCart();
  const [open, setOpen] = useState(false);
  const closeMenu = () => setOpen(false);

  const renderNavLinks = () =>
    PUBLIC_LINKS.map((link) => (
      <li key={link.path}>
        <Link to={link.path} onClick={closeMenu} className="py-2">
          <link.icon size={18} className="opacity-70 lg:hidden" />
          {link.name}
        </Link>
      </li>
    ));

  const renderUserLinks = () =>
    DYNAMIC_MENU.user.map((link) => (
      <li key={link.to}>
        <Link to={link.to} onClick={closeMenu} className="py-2">
          <link.icon size={18} className="opacity-70" />
          {link.label}
        </Link>
      </li>
    ));

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/85  backdrop-blur-md shadow-sm dark:text-black">
      <div className="navbar container mx-auto px-4">

        {/* LEFT */}
        <div className="navbar-start">
          {/* Mobile Menu */}
          {!user && <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden p-0 mr-2">
              <Menu size={24} />
            </div>

            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-white rounded-box z-10 mt-3 w-52 p-2 shadow-md"
            >
              {renderNavLinks()}
            </ul>
          </div>}

          <Link to="/">
            <ShopName />
          </Link>
        </div>

        {/* CENTER - Desktop Menu */}
        <nav className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1 font-medium gap-3">
            {renderNavLinks()}
          </ul>
        </nav>

        {/* RIGHT */}
        <div className="navbar-end flex items-center gap-3">

          {/* Cart */}
          <button
            onClick={openCart}
            aria-label="Open cart"
            className="group relative p-2 bg-gray-50 rounded-2xl hover:bg-black transition-all duration-300 active:scale-90"
          >
            <ShoppingBag
              size={24}
              className="text-gray-900 group-hover:text-white transition-colors"
            />

            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-violet-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                {cartCount}
              </span>
            )}
          </button>

          {/* Login / Dashboard */}
          {user ? (
            <div className="dropdown dropdown-end">
              {/* Avatar Trigger */}
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar online shadow-sm border border-base-200"
                onClick={() => setOpen(!open)}
              >
                <div className="w-11 rounded-full bg-linear-to-tr from-primary to-secondary text-primary-content flex items-center justify-center font-bold">
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </div>
              </div>

              {/* Dropdown Content */}
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content mt-3 z-50 p-2 shadow-2xl bg-white  dark:text-black rounded-2xl w-60 border"
              >
                {/* User Header */}
                <li className="px-4 py-3 mb-2 border-b">
                  <span className="font-bold text-base block p-0">{user?.name}</span>
                  <span className="text-xs opacity-60 block p-0 uppercase tracking-widest">{user?.role?.name || 'User'}</span>
                </li>

                <li>
                  <Link to="/dashboard" onClick={closeMenu} className="py-2">
                    <LayoutDashboard size={18} />
                    <span>Dashboard</span>
                  </Link>
                </li>

                {/* Mobile Links in Dropdown */}

                {user?.role.name && <>
                  <div className="border-b md:border-0">
                    {renderUserLinks()}
                  </div>
                </>
                }
                <div className="lg:hidden ">
                  {renderNavLinks()}
                </div>

                <li>
                  <button
                    onClick={() => { logout(); closeMenu(); }}
                    className="btn bg-linear-to-r from-[#632EE3] to-[#9F62F2] text-white border-none shadow-md rounded-xl hover:opacity-90 transition-all"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <Link to="/login" className="btn bg-linear-to-r from-[#632EE3] to-[#9F62F2] text-white border-none shadow-md rounded-xl hover:opacity-90 transition-all">
              <LogIn size={22} />
            </Link>
          )}

        </div>
      </div>
    </header>
  );
};

export default PublicNavbar;