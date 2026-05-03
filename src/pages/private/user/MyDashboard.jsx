import React from "react";
import { useAuth } from "../../../context/AuthContext";
import { Bell, CreditCard, User, ShieldCheck, ExternalLink, MessageSquareText, Heart, ListOrdered, Headphones, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const MyDashboard = () => {
    const { user } = useAuth();

    const dashboardLinks = [
        { to: "/dashboard/my-orders", title: "My Orders", desc: "Track recent orders", icon: ListOrdered, color: "text-emerald-600 bg-emerald-50" },
        { to: "/dashboard/my-wishlist", title: "My Wishlist", desc: "Saved products", icon: Heart, color: "text-rose-600 bg-rose-50" },
        { to: "/dashboard/my-payments", title: "My Payments", desc: "Transaction history", icon: CreditCard, color: "text-purple-600 bg-purple-50" },
        { to: "/dashboard/my-reviews", title: "My Reviews", desc: "Your product feedback", icon: MessageSquareText, color: "text-indigo-600 bg-indigo-50" },
        { to: "/dashboard/my-notifications", title: "Notifications", desc: "System updates", icon: Bell, color: "text-orange-600 bg-orange-50" },
        { to: "/dashboard/my-supports", title: "Help/Support", desc: "Contact support team", icon: Headphones, color: "text-cyan-600 bg-cyan-50" },
    ];

    return (
        <div className="p-1 space-y-4 container mx-auto animate-in fade-in duration-500">
            {/* Welcome Header */}
            <div className="bg-linear-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl">
                <div className="relative z-10">
                    <h1 className="text-2xl md:text-3xl font-black italic">Hi, {user?.name.split(' ')[0]}! 👋</h1>
                    <p className="mt-2 text-blue-100 max-w-md text-sm md:text-base leading-relaxed">
                        Welcome back to your dashboard. Manage your orders, 
                        shipping details, and track your activity.
                    </p>
                </div>
                <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-12 -translate-y-12 rotate-12">
                    <ShieldCheck size={260} />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Profile Summary Card */}
                <div className="lg:col-span-1 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center text-center h-fit">
                    <div className="relative group">
                        <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-blue-600 border-4 border-white shadow-inner transition-transform group-hover:scale-105">
                            <User size={48} />
                        </div>
                        <div className="absolute bottom-1 right-1 w-6 h-6 bg-green-500 border-4 border-white rounded-full" title="Online"></div>
                    </div>
                    
                    <div className="mt-4">
                        <h3 className="font-bold text-slate-800 text-xl">{user?.name}</h3>
                        <p className="text-sm text-slate-500 font-medium">{user?.email}</p>
                    </div>

                    <div className="w-full h-px bg-slate-100 my-6"></div>

                    <Link to="/dashboard/my-profile" className="w-full py-3 px-4 rounded-xl text-sm font-bold bg-blue-600 text-white transition-all flex items-center justify-center gap-2">
                        Manage Account <ExternalLink size={16} />
                    </Link>
                </div>

                {/* Quick Actions Grid */}
                <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {dashboardLinks.map((link, index) => (
                        <DashboardLink key={index} {...link} />
                    ))}
                </div>
            </div>
        </div>
    );
};

const DashboardLink = ({ to, title, desc, icon: Icon, color }) => (
    <Link 
        to={to} 
        className="group p-5 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-100 hover:-translate-y-1 transition-all duration-300 flex items-center justify-between"
    >
        <div className="flex items-center gap-4">
            <div className={`p-3.5 rounded-2xl transition-all duration-300 group-hover:scale-110 ${color}`}>
                <Icon size={24} />
            </div>
            <div>
                <h4 className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{title}</h4>
                <p className="text-[11px] text-slate-400 font-medium mt-0.5 uppercase tracking-wider">{desc}</p>
            </div>
        </div>
        <div className="text-slate-300 group-hover:text-blue-500 transition-all group-hover:translate-x-1">
            <ChevronRight size={20} />
        </div>
    </Link>
);

export default MyDashboard;