import React, { useState, useEffect } from 'react';
import { Search, Filter, MessageSquare, AlertCircle } from 'lucide-react';
import api from '../../../../services/axios';
import toast from 'react-hot-toast';
import { useAuth } from '../../../../context/AuthContext';
import TicketDetailsModal from './component/TicketDetailsModal';

const AdminSupports = () => {
    const { user } = useAuth();
    const [tickets, setTickets] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");

    const [selectedTicket, setSelectedTicket] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // ২. টিকিট সিলেক্ট করার ফাংশন
    const openTicketDetails = (ticket) => {
        setSelectedTicket(ticket);
        setIsModalOpen(true);
    };

    const fetchAllTickets = async () => {
        const { data } = await api.get('/api/supports/admin/all');
        setTickets(data.tickets);
    };
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchAllTickets();
    }, []);

    const handleStatusChange = async (ticketId, newStatus) => {
        try {
            await api.put(`/api/supports/reply/${ticketId}`, { status: newStatus, message: `Status updated to ${newStatus}` });
            toast.success("Status updated!");
            // লোড না করে স্টেট আপডেট করুন
            setTickets(prev => prev.map(t => t._id === ticketId ? { ...t, status: newStatus } : t));
        } catch (error) {
            console.error(error);
            toast.error("Failed to update status");
        }
    };

    const filteredTickets = tickets.filter(t => {
        const matchesSearch = t.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.user?.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === "all" ? true : t.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="p-1  space-y-4 container mx-auto bg-gray-50 min-h-screen">
            <header className="flex flex-col justify-between md:items-center gap-2 md:flex-row bg-white text-black p-4 rounded-2xl shadow-sm border border-slate-100">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <AlertCircle className="text-violet-600" /> Support Management
                    </h1>
                    <p className="text-gray-500 text-sm font-medium">Manage your shops supports  ({tickets?.length || 0})</p>
                </div>
                <div className="flex-1 flex gap-2 flex-col sm:flex-row">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
                        <input
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search user or subject..."
                            className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none w-full"
                        />
                    </div>
                    <div className='flex-1'>
                        <select onChange={(e) => setFilterStatus(e.target.value)} className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none w-full">
                            <option value="all">All Status</option>
                            <option value="open">Open</option>
                            <option value="in_progress">Open</option>
                            <option value="resolved">Resolved</option>
                            <option value="closed">Closed</option>
                        </select>
                    </div>
                </div>
            </header>

            <div className="bg-white rounded-2xl border border-slate-100 overflow-x-auto shadow-sm">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                            <th className="p-4 font-bold text-slate-600">TID</th>
                            <th className="p-4 font-bold text-slate-600">User</th>
                            <th className="p-4 font-bold text-slate-600">Subject</th>
                            <th className="p-4 font-bold text-slate-600">Priority</th>
                            <th className="p-4 font-bold text-slate-600">Status</th>
                            <th className="p-4 font-bold text-slate-600 text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {filteredTickets.map(ticket => (
                            <tr key={ticket._id} className="hover:bg-slate-50/50">
                                <td className="p-4 font-mono text-xs text-slate-500">#{ticket._id.slice(-6).toUpperCase()}</td>
                                <td className="p-4 font-medium text-slate-800">{ticket.user?.name}</td>
                                <td className="p-4 text-slate-600">{ticket.subject}</td>
                                <td className="p-4">
                                    <span className={`text-[10px] font-bold px-2 py-1 rounded-md ${ticket.priority === 'high' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'}`}>
                                        {ticket.priority.toUpperCase()}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <select
                                        value={ticket.status}
                                        onChange={(e) => handleStatusChange(ticket._id, e.target.value)}
                                        className="bg-slate-100 p-1 rounded text-xs outline-none font-bold cursor-pointer"
                                    >
                                        <option value="open">OPEN</option>
                                        <option value="progress">PROGRESS</option>
                                        <option value="resolved">RESOLVED</option>
                                        <option value="closed">CLOSED</option>
                                    </select>
                                </td>
                                <td className="p-4 text-center">
                                    <button onClick={() => openTicketDetails(ticket)} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all">
                                        <MessageSquare size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <TicketDetailsModal
                isOpen={isModalOpen}
                ticket={selectedTicket}
                onClose={() => setIsModalOpen(false)}
                onReplySuccess={fetchAllTickets}
                currentUser={user}
            />
        </div>
    );
};

export default AdminSupports;