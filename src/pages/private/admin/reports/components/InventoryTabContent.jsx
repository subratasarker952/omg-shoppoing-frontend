import React from 'react';
import { Package, AlertTriangle, XCircle, DollarSign, Box } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const InventoryTabContent = ({ data }) => {
    if (!data) return (
        <div className="flex items-center justify-center h-64 text-gray-400">
            No inventory data available.
        </div>
    );

    // চার্টের জন্য ডাটা তৈরি
    const chartData = [
        { name: 'Healthy Stock', value: data.totalProducts - (data.lowStockProducts + data.outOfStockProducts), color: '#10b981' },
        { name: 'Low Stock', value: data.lowStockProducts, color: '#f59e0b' },
        { name: 'Out of Stock', value: data.outOfStockProducts, color: '#ef4444' },
    ];

    const stats = [
        { 
            label: "Total Products", 
            value: data.totalProducts, 
            icon: <Package size={18} />, 
            text: "text-blue-600", 
            bg: "bg-blue-50",
            sub: "Unique Items" 
        },
        { 
            label: "Total Stock Units", 
            value: data.totalStock, 
            icon: <Box size={18} />, 
            text: "text-violet-600", 
            bg: "bg-violet-50",
            sub: "Across all variants" 
        },
        { 
            label: "Inventory Value", 
            value: `৳${data.totalInventoryValue?.toLocaleString()}`, 
            icon: <DollarSign size={18} />, 
            text: "text-emerald-600", 
            bg: "bg-emerald-50",
            sub: "Stock Assets Cost" 
        },
        { 
            label: "Stock Alerts", 
            value: data.lowStockProducts + data.outOfStockProducts, 
            icon: (data.outOfStockProducts > 0) ? <XCircle size={18} /> : <AlertTriangle size={18} />, 
            text: (data.outOfStockProducts > 0) ? "text-red-600" : "text-amber-600", 
            bg: (data.outOfStockProducts > 0) ? "bg-red-50" : "bg-amber-50",
            sub: `${data.outOfStockProducts} Out of Stock` 
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

            {/* Visual Inventory Status */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col items-center justify-center min-h-87.5">
                    <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-widest self-start">Stock Health</h3>
                    <div className="w-full h-62.5">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={8}
                                    dataKey="value"
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                />
                                <Legend verticalAlign="bottom" height={36}/>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="lg:col-span-2 bg-gray-900 rounded-3xl p-8 text-white flex flex-col justify-center">
                    <h3 className="text-xl font-black mb-2">Inventory Management Tips</h3>
                    <p className="text-gray-400 text-sm mb-6">Based on your current data, here is what you should focus on:</p>
                    
                    <div className="space-y-4">
                        <div className="flex gap-4 items-start">
                            <div className="p-2 bg-white/10 rounded-lg text-emerald-400"><Package size={20}/></div>
                            <div>
                                <h4 className="font-bold text-sm">Stock Valuation</h4>
                                <p className="text-xs text-gray-400">Your total inventory assets are worth ৳{data.totalInventoryValue?.toLocaleString()}.</p>
                            </div>
                        </div>
                        <div className="flex gap-4 items-start">
                            <div className="p-2 bg-white/10 rounded-lg text-amber-400"><AlertTriangle size={20}/></div>
                            <div>
                                <h4 className="font-bold text-sm">Low Stock Alerts</h4>
                                <p className="text-xs text-gray-400">{data.lowStockProducts} products need restocking soon to avoid sales loss.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InventoryTabContent;