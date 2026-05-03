import { useEffect, useState, useCallback, useMemo } from "react";
import { PlusCircle, ShieldCheck, UserCheck, Trash2, Loader2, Pencil, X, Search } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../../../services/axios";
import { scrollTOTop } from "../../../../utils/helperFunction";

const Roles = () => {
    const [roles, setRoles] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [permissions, setPermissions] = useState([]);
    const [name, setName] = useState("");
    const [selectedPermissions, setSelectedPermissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Edit state logic
    const [editingId, setEditingId] = useState(null);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const [roleRes, permRes] = await Promise.all([
                api.get("/api/roles"),
                api.get("/api/permissions")
            ]);
            setRoles(roleRes.data?.data || []);
            setPermissions(permRes.data?.data || []);
        } catch (error) {
            console.error(error);
            toast.error("Failed to sync data");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const togglePermission = (id) => {
        setSelectedPermissions(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    // Edit button click korle form fill-up hobe
    const handleEdit = (role) => {
        setEditingId(role._id);
        setName(role.name);
        setSelectedPermissions(role.permissions.map(p => p._id));
        scrollTOTop()
    };

    // Reset Form
    const resetForm = () => {
        setEditingId(null);
        setName("");
        setSelectedPermissions([]);
    };

    const handleSubmit = async () => {
        if (!name.trim()) return toast.error("Role name is required");
        if (selectedPermissions.length === 0) return toast.error("Select at least one permission");

        try {
            setIsSubmitting(true);
            const payload = {
                name: name.toLowerCase(),
                permissions: selectedPermissions,
            };

            if (editingId) {
                // Update Logic
                await api.put(`/api/roles/${editingId}`, payload);
                toast.success("Role updated successfully");
            } else {
                // Create Logic
                await api.post("/api/roles", payload);
                toast.success("Role created successfully");
            }

            resetForm();
            fetchData();
        } catch (error) {
            toast.error(error.response?.data?.message || "Operation failed");
        } finally {
            setIsSubmitting(false);
        }
    };

    const deleteRole = async (id) => {
        if (!window.confirm("Are you sure you want to delete this role?")) return;
        try {
            await api.delete(`/api/roles/${id}`);
            toast.success("Role deleted");
            fetchData();
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete");
        }
    };

    // প্রোডাক্ট ফিল্টারিং লজিক (Search inside Form)
    const filteredPermissions = useMemo(() => {
        return permissions.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [permissions, searchTerm]);


    if (loading) return <div className="p-10 text-center text-gray-500">Initializing Role Manager...</div>;

    return (
        <div className="p-2 container mx-auto bg-gray-50 min-h-screen space-y-4">
            <header >
                <h1 className="text-2xl font-bold flex items-center gap-2 text-gray-800">
                    <UserCheck className="text-green-600" /> User Roles & Access
                </h1>
                <p className="text-sm text-gray-500">Assign permissions to roles for access control ({roles?.length || 0}).</p>
            </header>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Form Section */}
                <div className="xl:col-span-1">
                    <div className="bg-white p-6 rounded-2xl text-black shadow-md border border-gray-200 sticky top-8">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold">
                                {editingId ? "Edit Role" : "Create New Role"}
                            </h2>
                            {editingId && (
                                <button onClick={resetForm} className="text-red-500">
                                    <X size={18} />
                                </button>
                            )}
                        </div>

                        <div className=" space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Role Name</label>
                                <input
                                    className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition-all"
                                    placeholder="e.g. Moderator"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>

                            <div>

                                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Permissions</label>
                                <div className="relative mb-2">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 z-10" size={14} />
                                    <input
                                        type="text"
                                        placeholder="Search products..."
                                        className="input input-bordered pl-10 w-full text-black focus:ring-primary h-11 bg-white rounded-2xl shadow-md"
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>

                                <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto p-1 border rounded-lg">
                                    {filteredPermissions.map((p) => (
                                        <label
                                            key={p._id}
                                            className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all ${selectedPermissions.includes(p._id)
                                                    ? "bg-green-50 text-green-700"
                                                    : "hover:bg-gray-50 text-gray-600"
                                                }`}
                                        >
                                            <input
                                                type="checkbox"
                                                className="w-4 h-4 accent-green-600"
                                                checked={selectedPermissions.includes(p._id)}
                                                onChange={() => togglePermission(p._id)}
                                            />
                                            <span className="text-sm">{p.name}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className={`w-full ${editingId ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'} text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50`}
                            >
                                {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : (editingId ? <Pencil size={20} /> : <PlusCircle size={20} />)}
                                {editingId ? "Update Role" : "Create Role"}
                            </button>
                        </div>
                    </div>
                </div>

                {/* List Section */}
                <div className="xl:col-span-2  space-y-4">
                    <h2 className="text-lg font-semibold px-2">Existing System Roles</h2>
                    <div className="grid gap-4">
                        {roles.map((role) => (
                            <div key={role._id} className="bg-white p-5 rounded-xl border border-gray-200 shadow-md hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center gap-2">
                                        <ShieldCheck className={role.name === 'admin' ? "text-red-500" : "text-blue-500"} size={20} />
                                        <h3 className="font-bold text-gray-800 capitalize text-lg">{role.name}</h3>
                                    </div>

                                    {role.name !== 'admin' && (
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => handleEdit(role)}
                                                className="text-blue-600 transition-colors"
                                            >
                                                <Pencil size={18} />
                                            </button>
                                            <button
                                                onClick={() => deleteRole(role._id)}
                                                className="text-red-500 transition-colors"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-wrap gap-1.5">
                                    {role.name === "admin" ? (
                                        <span className="bg-red-50 text-red-600 px-3 py-1 text-xs font-bold rounded-full border border-red-100 uppercase tracking-tighter">
                                            Master Access (All Permissions)
                                        </span>
                                    ) : (
                                        role.permissions?.map((p) => (
                                            <span key={p._id} className="bg-gray-100 text-gray-600 px-2.5 py-1 text-[11px] font-semibold rounded-md border border-gray-200">
                                                {p.name}
                                            </span>
                                        ))
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Roles;