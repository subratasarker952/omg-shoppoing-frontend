import React, { useState, useEffect } from 'react';
import { BarChart3, DollarSign, ShoppingCart, Users, Package, ArrowUpRight, RefreshCw, X, Calendar } from 'lucide-react';
import api from '../../../../services/axios';
import ProfitTabContent from './components/ProfitTabContent';
import SalesTabContent from './components/SalesTabContent';
import InventoryTabContent from './components/InventoryTabContent';
import UserTabContent from './components/UserTabContent';

const AdminReports = () => {
    const [activeTab, setActiveTab] = useState('profit');

    const [profitData, setProfitData] = useState(null);
    const [salesData, setSalesData] = useState(null);
    const [inventoryData, setInventoryData] = useState(null);
    const [userData, setUserData] = useState(null);

    const [startDate, SetStartDate] = useState('')
    const [endDate, SetEndDate] = useState('')

    const [loading, setLoading] = useState(true);

    // ডাটা লোড করার ফাংশন
    const fetchReport = async (tab) => {
        if (!tab) return;

        try {
            setLoading(true);
            let endpoint;

            // ১. এন্ডপয়েন্ট সিলেক্ট করা
            switch (tab) {
                case 'profit': endpoint = '/api/reports/profit-summary'; break;
                case 'sales': endpoint = '/api/reports/sales-summary'; break;
                case 'inventory': endpoint = '/api/reports/inventory-summary'; break;
                case 'users': endpoint = '/api/reports/users-summary'; break;
                default: return;
            }

            // ২. কুয়েরি প্যারামিটার হিসেবে ডেট পাঠানো
            const params = {};

            // শুধুমাত্র যদি ভ্যালু থাকে তখনই অবজেক্টে অ্যাড হবে
            if (startDate) params.startDate = startDate;
            if (endDate) params.endDate = endDate;

            const response = await api.get(endpoint, { params });

            if (response.data.success) {
                const result = response.data.data;
                // ৩. ডাইনামিকভাবে সঠিক স্টেটে ডাটা সেট করা
                const setterMap = {
                    'profit': setProfitData,
                    'sales': setSalesData,
                    'inventory': setInventoryData,
                    'users': setUserData
                };

                if (setterMap[tab]) {
                    setterMap[tab](result);
                }
            }
        } catch (error) {
            console.error("Report Load Error", error);
        } finally {
            setLoading(false);
        }
    };

    // ৪. ট্যাব অথবা ডেট পরিবর্তন হলে ডাটা ফেচ হবে
    useEffect(() => {
        fetchReport(activeTab);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTab, startDate, endDate]); // dependency তে ডেট যোগ করা হয়েছে

    const tabs = [
        { id: 'profit', label: 'Profit Analysis', icon: <DollarSign size={18} /> },
        { id: 'sales', label: 'Sales Reports', icon: <ShoppingCart size={18} /> },
        { id: 'inventory', label: 'Inventory Status', icon: <Package size={18} /> },
        { id: 'users', label: 'User Growth', icon: <Users size={18} /> },
    ];

    return (
        <div className="p-2 bg-gray-50 min-h-screen text-black container mx-auto space-y-4">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Header Section */}
                <div>
                    <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                        <BarChart3 className="text-violet-600" /> Business Analytics
                    </h1>
                    <p className="text-gray-500 font-medium text-sm sm:text-base">Detailed insights into your store's performance</p>
                </div>

                {/* Date Filter Section - Mobile Responsive Fix */}
                <div className="flex flex-wrap items-center gap-2 bg-white p-1.5 sm:p-2 rounded-2xl border border-gray-100 shadow-sm w-full lg:w-auto">
                    <div className="flex items-center flex-1 sm:flex-initial gap-2 px-2 sm:px-3 border-r border-gray-100 overflow-x-auto">
                        {/* Start Date */}
                        <div className="flex items-center gap-1">
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => SetStartDate(e.target.value)}
                                className="outline-none text-xs sm:text-sm font-semibold bg-transparent cursor-pointer min-w-25"
                            />
                        </div>



                        {/* End Date */}
                        <div className="flex items-center gap-1">
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => SetEndDate(e.target.value)}
                                className="outline-none text-xs sm:text-sm font-semibold bg-transparent cursor-pointer min-w-25"
                            />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-1 ml-auto">
                        {(startDate || endDate) ? (
                            <button
                                onClick={() => { SetStartDate(''); SetEndDate(''); }}
                                className="p-2 hover:bg-red-50 text-red-500 rounded-xl transition-colors"
                                title="Clear Filters"
                            >
                                <X size={18} />
                            </button>
                        ) : (

                            <button
                                onClick={() => fetchReport(activeTab)}
                                className="p-2 hover:bg-violet-50 text-violet-600 rounded-xl transition-colors"
                                title="Refresh Data"
                            >
                                <RefreshCw size={18} className={loading ? "animate-spin scale-200" : ""} />
                            </button>
                        )
                        }
                    </div>
                </div>
            </div>

            {/* Tabs Navigation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold transition-all ${activeTab === tab.id
                            ? "bg-violet-600 text-white shadow-lg shadow-violet-200"
                            : "text-gray-500 hover:bg-gray-100"
                            }`}
                    >
                        {tab.icon} {tab.label}
                    </button>
                ))}
            </div>

            {/* Main Content Area */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm min-h-100">

                {activeTab === 'profit' && <ProfitTabContent data={profitData} />}
                {activeTab === 'sales' && <SalesTabContent data={salesData} />}
                {activeTab === 'inventory' && <InventoryTabContent data={inventoryData} />}
                {activeTab === 'users' && <UserTabContent data={userData} />}
                
            </div>
        </div>
    );
};

export default AdminReports;