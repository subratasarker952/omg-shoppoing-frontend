import React from 'react';
import { ArrowUpRight, TrendingUp, CreditCard, Banknote, Landmark, Wallet } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';

const ProfitTabContent = ({ data }) => {
    if (!data) return (
        <div className="flex items-center justify-center h-64 text-gray-400">
            No profit data available for this period.
        </div>
    );

    // ভিজ্যুয়াল চার্টের জন্য ডাটা ফরম্যাটিং
    const chartData = [
        { name: 'Gross Revenue', value: data.totalGrossRevenue, color: '#6366f1' },
        { name: 'Product Cost', value: data.totalProductCost, color: '#f59e0b' },
        { name: 'Net Profit', value: data.totalProfit, color: '#10b981' },
    ];

    const stats = [
        { 
            label: "Gross Revenue", 
            value: data.totalGrossRevenue, 
            icon: <Landmark size={18} />, 
            text: "text-indigo-600", 
            bg: "bg-indigo-50",
            sub: "Total money in" 
        },
        { 
            label: "Gateway Fees", 
            value: data.totalGatewayFees, 
            icon: <CreditCard size={18} />, 
            text: "text-amber-500", 
            bg: "bg-amber-50",
            sub: "Transaction costs" 
        },
        { 
            label: "Product Cost", 
            value: data.totalProductCost, 
            icon: <Banknote size={18} />, 
            text: "text-orange-600", 
            bg: "bg-orange-50",
            sub: "Total COGS" 
        },
        { 
            label: "Net Profit", 
            value: data.totalProfit, 
            icon: <TrendingUp size={18} />, 
            text: "text-emerald-600", 
            bg: "bg-emerald-50",
            sub: "Actual earnings" 
        },
        { 
            label: "Net Revenue", 
            value: data.totalNetRevenue, 
            icon: <Wallet size={18} />, 
            text: "text-blue-600", 
            bg: "bg-blue-50",
            sub: "After Gateway Fees" 
        },
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Stats Grid - 5 Columns for Profit Logic */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {stats.map((s, i) => (
                    <div key={i} className="p-5 rounded-3xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-3 ${s.bg} ${s.text}`}>
                            {s.icon}
                        </div>
                        <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">{s.label}</p>
                        <h2 className={`text-xl font-black ${s.text}`}>৳{s.value?.toLocaleString()}</h2>
                        <div className="flex items-center gap-1 mt-2 text-[10px] font-bold text-gray-400 uppercase">
                            Orders: {data.orderCount}
                        </div>
                    </div>
                ))}
            </div>

            {/* Profit Analysis Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">Profit vs Cost Analysis</h3>
                            <p className="text-xs text-gray-500 font-medium">Comparison of revenue, expenditure and actual profit</p>
                        </div>
                    </div>
                    
                    <div className="h-75 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                <XAxis 
                                    dataKey="name" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fill: '#9ca3af', fontSize: 12, fontWeight: 700 }}
                                    dy={10}
                                />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                                <Tooltip 
                                    cursor={{ fill: '#f9fafb' }}
                                    contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}
                                />
                                <Bar dataKey="value" radius={[12, 12, 0, 0]} barSize={60}>
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Profit Margin Info */}
                <div className="bg-emerald-600 rounded-3xl p-8 text-white flex flex-col justify-center relative overflow-hidden">
                    <div className="relative z-10">
                        <h3 className="text-emerald-100 text-sm font-bold uppercase tracking-widest mb-2">Profit Margin</h3>
                        <h2 className="text-5xl font-black mb-4">
                            {data.totalGrossRevenue > 0 ? Math.round((data.totalProfit / data.totalGrossRevenue) * 100) : 0}%
                        </h2>
                        <p className="text-emerald-100/80 text-sm leading-relaxed">
                            Your net profit is ৳{data.totalProfit?.toLocaleString()} after deducting all costs and fees.
                        </p>
                        <div className="mt-8 pt-6 border-t border-white/20">
                            <div className="flex justify-between text-xs font-bold">
                                <span>Efficiency Rate</span>
                                <span>High</span>
                            </div>
                        </div>
                    </div>
                    {/* Decorative Circle */}
                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                </div>
            </div>
        </div>
    );
};

export default ProfitTabContent;