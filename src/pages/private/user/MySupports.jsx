import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Headphones, Plus, MessageCircle, Clock, CheckCircle, AlertCircle, Search, MessageSquare } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../../../services/axios';
import { useAuth } from '../../../context/AuthContext';
import TicketDetailsModal from '../admin/supports/component/TicketDetailsModal';

const MySupports = () => {
    const { register, handleSubmit, reset } = useForm();
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
    const fetchTickets = async () => {
        const { data } = await api.get('/api/supports/my-tickets');
        setTickets(data.tickets);
    };

    // eslint-disable-next-line react-hooks/set-state-in-effect
    useEffect(() => { fetchTickets(); }, []);

    const onSubmit = async (formData) => {
        try {
            await api.post('/api/supports', formData);
            toast.success("টিকিট ওপেন হয়েছে!");
            reset();
            fetchTickets();
        } catch (error) { console.error(error); toast.error("Error creating ticket"); }
    };

    const filteredTickets = tickets.filter(t => {
        const matchesSearch = t.subject.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === "all" ? true : t.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="p-1 space-y-4 container mx-auto">
            <header className="flex flex-col justify-between md:items-center gap-2 md:flex-row bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
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

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="md:col-span-4 bg-white p-6 rounded-2xl border border-slate-100  space-y-4 h-fit">
                    <h3 className="font-bold text-slate-700">Open New Ticket</h3>
                    <input {...register("subject", { required: true })} placeholder="Subject" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
                    <select {...register("priority")} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none">
                        <option value="low">Low Priority</option>
                        <option value="medium">Medium Priority</option>
                        <option value="high">High Priority</option>
                    </select>
                    <textarea {...register("message", { required: true })} placeholder="Describe your issue..." className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl h-32 outline-none" />
                    <button className="w-full py-3 bg-cyan-600 text-white rounded-xl font-bold hover:bg-cyan-700 transition-all">Submit Ticket</button>
                </form>


                <div className="md:col-span-8 bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                                <th className="p-4 font-bold text-slate-600">Ticket ID</th>
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
                                    <td className="p-4 text-slate-600">{ticket.subject}</td>
                                    <td className="p-4">
                                        <span className={`text-[10px] font-bold px-2 py-1 rounded-md ${ticket.priority === 'high' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'}`}>
                                            {ticket.priority.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="p-4 capitalize">{ticket.status} </td>
                                    <td className="p-4 flex justify-self-center">
                                        {ticket.status == "closed" ? <CheckCircle size={24} className='text-green-600'/> : <button onClick={() => openTicketDetails(ticket)} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all">
                                            <MessageSquare size={18} />
                                        </button>}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <TicketDetailsModal
                isOpen={isModalOpen}
                ticket={selectedTicket}
                onClose={() => setIsModalOpen(false)}
                onReplySuccess={fetchTickets}
                currentUser={user}
            />
        </div>
    );
};

export default MySupports;