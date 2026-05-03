import React from 'react';
import { Users, ShieldCheck, ShieldAlert, UserPlus, Fingerprint } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const UserTabContent = ({ data }) => {
    if (!data || data.totalUsers === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-64 bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-200">
                <Users size={48} className="text-gray-300 mb-4" />
                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No users found in this period</p>
            </div>
        );
    }

    // Pie Chart এর জন্য ডাটা (রোল অনুযায়ী)
    const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
    const chartData = data.roleCounts?.map(item => ({
        name: item.name,
        value: item.count
    })) || [];

    const stats = [
        { 
            label: "Total Users", 
            value: data.totalUsers, 
            icon: <Users size={18} />, 
            text: "text-indigo-600", 
            bg: "bg-indigo-50",
            sub: `${data.activeUsers} Active Accounts` 
        },
        { 
            label: "Verified Users", 
            value: data.verifiedUsers, 
            icon: <ShieldCheck size={18} />, 
            text: "text-emerald-600", 
            bg: "bg-emerald-50",
            sub: `${data.unverifiedUsers} Pending Email` 
        },
        { 
            label: "Blocked Users", 
            value: data.blockedUsers, 
            icon: <ShieldAlert size={18} />, 
            text: "text-rose-600", 
            bg: "bg-rose-50",
            sub: "Access Restricted" 
        },
        { 
            label: "Growth Rate", 
            value: "N/A", 
            icon: <UserPlus size={18} />, 
            text: "text-amber-600", 
            bg: "bg-amber-50",
            sub: "New Registrations" 
        },
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((s, i) => (
                    <div key={i} className="p-6 rounded-3xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${s.bg} ${s.text}`}>
                            {s.icon}
                        </div>
                        <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">{s.label}</p>
                        <h2 className={`text-2xl font-black mt-1 ${s.text}`}>{s.value}</h2>
                        <p className="text-[10px] font-bold text-gray-400 mt-2 uppercase tracking-tighter">{s.sub}</p>
                    </div>
                ))}
            </div>

            {/* User Analysis Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Role Distribution Chart */}
                <div className="lg:col-span-1 bg-white rounded-3xl p-6 border border-gray-100 shadow-sm min-h-87.5">
                    <h3 className="text-sm font-bold text-gray-900 mb-6 uppercase tracking-widest flex items-center gap-2">
                        <Fingerprint size={16} /> Role Distribution
                    </h3>
                    <div className="w-full h-62.5" >
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                />
                                <Legend iconType="circle" />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Verification Progress / Details */}
                <div className="lg:col-span-2 bg-gray-900 rounded-3xl p-8 text-white">
                    <h3 className="text-xl font-black mb-6">User Security Insights</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Verification Meter */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-end">
                                <p className="text-sm font-bold text-gray-400">Verification Rate</p>
                                <p className="text-2xl font-black text-emerald-400">
                                    {data.totalUsers > 0 ? Math.round((data.verifiedUsers / data.totalUsers) * 100) : 0}%
                                </p>
                            </div>
                            <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                                <div 
                                    className="bg-emerald-500 h-full transition-all duration-1000" 
                                    style={{ width: `${data.totalUsers > 0 ? (data.verifiedUsers / data.totalUsers) * 100 : 0}%` }}
                                ></div>
                            </div>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                                Based on {data.verifiedUsers} verified accounts
                            </p>
                        </div>

                        {/* Quick Insights */}
                        <div className="space-y-4">
                            <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-4">
                                <div className="p-2 bg-rose-500/20 text-rose-500 rounded-lg"><ShieldAlert size={20}/></div>
                                <div>
                                    <h4 className="text-xs font-bold text-gray-300 uppercase">Blocked Risk</h4>
                                    <p className="text-lg font-black">{data.blockedUsers} Users</p>
                                </div>
                            </div>
                            <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-4">
                                <div className="p-2 bg-blue-500/20 text-blue-500 rounded-lg"><Users size={20}/></div>
                                <div>
                                    <h4 className="text-xs font-bold text-gray-300 uppercase">Unique Roles</h4>
                                    <p className="text-lg font-black">{data.roleCounts?.length || 0} Tiers</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserTabContent;