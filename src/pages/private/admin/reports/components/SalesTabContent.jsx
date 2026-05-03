import React from 'react';
import { ArrowUpRight, ShoppingBag, Truck, Tag, BarChart as ChartIcon } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const SalesTabContent = ({ data }) => {
    if (!data) return (
        <div className="flex items-center justify-center h-64 text-gray-400">
            No sales data available for the selected range.
        </div>
    );

    // চার্টের জন্য ডাটা ফরম্যাটিং
    const chartData = [
        { name: 'Gross Revenue', value: data.totalGrossRevenue, color: '#8b5cf6' }, // Violet
        { name: 'Net Revenue', value: data.netRevenue, color: '#10b981' }, // Emerald
        { name: 'Shipping', value: data.totalShippingCollected, color: '#3b82f6' }, // Blue
        { name: 'Discount', value: data.totalDiscount, color: '#f43f5e' }, // Rose
    ];

    const stats = [
        { 
            label: "Gross Revenue", 
            value: data.totalGrossRevenue, 
            icon: <ArrowUpRight size={16} />, 
            text: "text-violet-600",
            sub: `Avg. Order: ৳${data.averageOrderValue}`
        },
        { 
            label: "Net Revenue", 
            value: data.netRevenue, 
            icon: <ChartIcon size={16} />, 
            text: "text-emerald-600",
            sub: "Excludes Shipping"
        },
        { 
            label: "Total Items Sold", 
            value: data.totalItemsSold, 
            icon: <ShoppingBag size={16} />, 
            text: "text-blue-600",
            sub: `${data.totalOrders} Successful Orders`
        },
        { 
            label: "Shipping & Discount", 
            value: data.totalShippingCollected, 
            icon: <Truck size={16} />, 
            text: "text-amber-600",
            sub: `Discount Given: ৳${data.totalDiscount}`
        },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((s, i) => (
                    <div key={i} className="p-5 rounded-3xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center">
                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-4 bg-gray-50 ${s.text}`}>
                            {s.icon}
                        </div>
                        <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">{s.label}</p>
                        <h2 className={`text-2xl font-black mt-1 ${s.text}`}>
                            {typeof s.value === 'number' && s.label !== "Total Items Sold" ? `৳${s.value.toLocaleString()}` : s.value}
                        </h2>
                        <p className="text-[10px] font-bold text-gray-400 mt-2 uppercase">{s.sub}</p>
                    </div>
                ))}
            </div>

            {/* Chart Section */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                <div className="mb-6">
                    <h3 className="text-lg font-bold text-gray-900">Revenue Overview</h3>
                    <p className="text-sm text-gray-500">Visual breakdown of your sales metrics</p>
                </div>
                
                <div className="h-75 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                            <XAxis 
                                dataKey="name" 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{ fill: '#9ca3af', fontSize: 12, fontWeight: 600 }}
                                dy={10}
                            />
                            <YAxis 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{ fill: '#9ca3af', fontSize: 12 }}
                            />
                            <Tooltip 
                                cursor={{ fill: '#f9fafb' }}
                                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                            />
                            <Bar dataKey="value" radius={[10, 10, 0, 0]} barSize={50}>
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default SalesTabContent;