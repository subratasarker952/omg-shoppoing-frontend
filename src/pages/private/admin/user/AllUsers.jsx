import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Search, UserX, UserCheck, Loader2, Users, Mail, ShieldCheck } from "lucide-react";
import api from "../../../../services/axios";
import toast from "react-hot-toast";

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");
  const [actionLoading, setActionLoading] = useState(null);

  // ১. ডেবউন্স লজিক (পারফরম্যান্সের জন্য)
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedTerm(searchTerm), 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // ২. এপিআই কল
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/users/admin");
      setUsers(res.data.users || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // ৩. স্ট্যাটাস টগল
  const toggleStatus = async (id) => {
    try {
      setActionLoading(id);
      await api.patch(`/api/users/admin/${id}/status`);

      setUsers((prev) =>
        prev.map((user) =>
          user._id === id ? { ...user, isBlocked: !user.isBlocked } : user
        )
      );
      toast.success("User status synchronized");
    } catch (error) {
      console.error(error);
      toast.error("Operation failed");
    } finally {
      setActionLoading(null);
    }
  };

  // ৪. মেমোইজড ফিল্টারিং
  const filteredUsers = useMemo(() => {
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(debouncedTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(debouncedTerm.toLowerCase())
    );
  }, [debouncedTerm, users]);

  return (
    <div className="p-2 bg-gray-50 min-h-screen space-y-4">
      <div className="container mx-auto">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-extrabold text-black flex items-center gap-2">
              <div className="p-2 bg-violet-100 rounded-lg">
                <Users className="text-violet-600" size={24} />
              </div>
              User Directory
            </h1>
            <p className="text-gray-500 mt-1 font-medium">
              Oversee and manage {users?.length || 0} registered members.
            </p>
          </div>


          <div className="relative group w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-black group-focus-within:text-violet-500 transition-colors" size={20} />
            <input
              type="text"
              placeholder="Search by name, email..."
              className="w-full pl-11 pr-4 py-2.5 bg-white border text-black border-gray-200 rounded-xl focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 outline-none transition-all shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* User Table Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <TableSkeleton />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/80 border-b border-gray-100">
                    <th className="px-6 py-4 text-[11px] font-black uppercase text-gray-500 tracking-widest">Identiy</th>
                    <th className="px-6 py-4 text-[11px] font-black uppercase text-gray-500 tracking-widest">Role</th>
                    <th className="px-6 py-4 text-[11px] font-black uppercase text-gray-500 tracking-widest text-center">Status</th>
                    <th className="px-6 py-4 text-[11px] font-black uppercase text-gray-500 tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <tr key={user._id} className="hover:bg-violet-50/20 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="w-11 h-11 rounded-xl bg-linear-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-bold shadow-sm">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="text-sm font-bold text-gray-800">{user.name}</div>
                              <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-0.5">
                                <Mail size={12} /> {user.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="p-1 bg-blue-50 rounded text-blue-600">
                              <ShieldCheck size={14} />
                            </div>
                            <span className="text-sm font-semibold text-gray-600 capitalize">
                              {user.role?.name || 'Customer'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border ${!user.isBlocked
                              ? "bg-green-50 text-green-700 border-green-100"
                              : "bg-red-50 text-red-700 border-red-100"
                            }`}>
                            {!user.isBlocked ? "Active" : "Suspended"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => toggleStatus(user._id)}
                            disabled={actionLoading === user._id}
                            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm flex items-center gap-2 ml-auto ${user.isBlocked
                                ? "bg-green-600 hover:bg-green-700 text-white shadow-green-200"
                                : "bg-white border border-gray-200 hover:bg-red-50 hover:text-red-600 text-gray-600"
                              }`}
                          >
                            {actionLoading === user._id ? (
                              <Loader2 size={14} className="animate-spin" />
                            ) : user.isBlocked ? (
                              <UserCheck size={14} />
                            ) : (
                              <UserX size={14} />
                            )}
                            {user.isBlocked ? "Restore User" : "Suspend"}
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <EmptyState />
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ছোট হেল্পার কম্পোনেন্টস
const TableSkeleton = () => (
  <div className="p-6 space-y-4">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="flex items-center gap-4 animate-pulse">
        <div className="w-12 h-12 bg-gray-200 rounded-xl" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-1/4" />
          <div className="h-3 bg-gray-100 rounded w-1/3" />
        </div>
        <div className="w-20 h-8 bg-gray-100 rounded-lg" />
      </div>
    ))}
  </div>
);

const EmptyState = () => (
  <tr>
    <td colSpan="4" className="py-20 text-center">
      <div className="flex flex-col items-center">
        <div className="p-4 bg-gray-50 rounded-full mb-4">
          <Users size={40} className="text-gray-300" />
        </div>
        <h3 className="text-gray-900 font-bold">No users found</h3>
        <p className="text-gray-500 text-sm">Try adjusting your search criteria.</p>
      </div>
    </td>
  </tr>
);

export default AllUsers;