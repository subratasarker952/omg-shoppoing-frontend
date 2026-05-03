import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Menu, Home as HomeIcon, LayoutDashboard } from 'lucide-react';
import ShopName from '../shared/ShopName';
import { AUTH_LINKS } from '../../constants/appData';

const AuthNavbar = () => {
    const { user } = useAuth();

    const renderNavLinks = () =>
        AUTH_LINKS.map((link) => (
            <li key={link.path}>
                <Link to={link.path} className="py-2.5">
                    <link.icon size={18} className="opacity-70 lg:hidden" />
                    {link.name}
                </Link>
            </li>
        ));

    return (
        <div className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/85  backdrop-blur-md shadow-sm dark:text-black">
            <div className='navbar container mx-auto px-4'>

                {/* LEFT: Logo */}
                <div className="navbar-start">
                    <div className="dropdown">
                        <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden p-0 mr-2">
                            <Menu size={24} />
                        </div>
                        <ul
                            tabIndex={0}
                            className="menu menu-sm dropdown-content bg-white  dark:text-black rounded-box z-50 mt-3 w-52 p-2 shadow-xl border "
                        >
                          {renderNavLinks()}
                        </ul>
                    </div>
                    <Link to='/'>
                        <ShopName />
                    </Link>
                </div>

                {/* RIGHT: Desktop Links & Action Button */}
                <div className="navbar-end gap-6">
                    <div className="hidden lg:flex">
                        <ul className="menu menu-horizontal px-1 gap-6">
                         {renderNavLinks()}
                        </ul>
                    </div>

                    {/* Action Button */}
                    <Link
                        to={user ? '/dashboard' : '/'}
                        className="btn bg-linear-to-r from-[#632EE3] to-[#9F62F2] text-white border-none shadow-md rounded-xl hover:opacity-90 transition-all"
                    >
                        {user ? (
                            <LayoutDashboard size={24}/>
                        ) : (
                            <HomeIcon size={24} />
                        )}
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AuthNavbar;