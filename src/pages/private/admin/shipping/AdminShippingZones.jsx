import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Plus, Trash2, Edit3, Loader2, MapPin } from 'lucide-react';
import api from '../../../../services/axios';
import { BANGLADESH_DISTRICTS, BANGLADESH_DIVISIONS } from '../../../../constants/appData';

const AdminShippingZones = () => {
    const [zones, setZones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(null);
    const { register, handleSubmit, reset, setValue, watch } = useForm();
    const selectedDistricts = watch("districts") || [];
    const [division, setDivision] = useState('')

    const fetchZones = async () => {
        try {
            const { data } = await api.get('/api/shipping-zones');
            setZones(data.zones);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load zones");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchZones(); }, []);

    const onSubmit = async (data) => {
        try {
            if (isEditing) {
                await api.put(`/api/shipping-zones/${isEditing}`, data);
                toast.success("Zone updated!");
            } else {
                await api.post('/api/shipping-zones', data);
                toast.success("Zone created!");
            }
            reset();
            setIsEditing(null);
            fetchZones();
        } catch (err) {
            toast.error(err.response?.data?.message || "Operation failed");
        }
    };

    const handleEdit = (zone) => {
        setIsEditing(zone._id);
        setValue("name", zone.name);
        setValue("deliveryCharge", zone.deliveryCharge);
        setValue("districts", zone.districts);
        setValue("estimatedDays", zone.estimatedDays);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure?")) return;
        try {
            await api.delete(`/api/shipping-zones/${id}`);
            toast.success("Zone removed");
            fetchZones();
        } catch (err) {
            console.error(err);
            toast.error("Delete failed");
        }
    };

    const FILTERED_DISTRICTS = BANGLADESH_DISTRICTS.filter(d => {
        const isSelected = selectedDistricts.includes(d.name);
        const matchesDivision = division ? d.division_id === division : true;
        return matchesDivision || isSelected;
    });

    const selectAllOfDivision = () => {
        const currentDivDistricts = BANGLADESH_DISTRICTS
            .filter(d => d.division_id === division)
            .map(d => d.name);

        // আগের সিলেক্ট করা গুলোর সাথে নতুন গুলো ইউনিকলি যোগ করা
        const combined = Array.from(new Set([...selectedDistricts, ...currentDivDistricts]));
        setValue("districts", combined);
    };

    if (loading) return <Loader2 className="animate-spin mx-auto mt-20" />;

    return (
        <div className="container mx-auto p-2 space-y-4 min-h-screen bg-gray-50">
            <div className="flex justify-between items-center gap-2">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <MapPin className="text-violet-600" /> {isEditing ? "Edit Zone" : "Create Zone"}
                    </h1>
                    <p className="text-gray-500 text-sm font-medium">Manage shipping Zone ({zones?.length || 0})</p>
                </div>

                <div className="flex gap-2">
                    <select
                        className='border-2 border-gray-100 p-2 text-black rounded-xl text-sm font-bold outline-none focus:border-black transition-all'
                        onChange={(e) => setDivision(e.target.value)}
                    >
                        <option value={''}>All Divisions</option>
                        {BANGLADESH_DIVISIONS.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                    </select>
                </div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-md">

                {division && (
                    <button
                        type="button"
                        onClick={selectAllOfDivision}
                        className="text-[10px] flex justify-self-end mt-2 font-bold bg-blue-100 text-blue-700 px-3 py-1 rounded-full uppercase hover:bg-blue-200"
                    >
                        Select All In Division
                    </button>
                )}


                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 text-black">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-gray-500">Zone Name</label>
                            <input {...register("name", { required: true })} className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 ring-blue-500" placeholder="e.g. Dhaka Metro" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-gray-500">Charge (BDT)</label>
                            <input type="number" {...register("deliveryCharge", { required: true })} className="w-full p-4 bg-gray-50 rounded-2xl outline-none" placeholder="60" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-gray-500">Est. Delivery Time</label>
                            <input {...register("estimatedDays")} className="w-full p-4 bg-gray-50 rounded-2xl outline-none" placeholder="2-3 Days" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <label className="text-xs font-bold uppercase text-gray-500">
                                Select Districts ({selectedDistricts.length} selected)
                            </label>
                            {selectedDistricts.length > 0 && (
                                <button
                                    type="button"
                                    onClick={() => setValue("districts", [])}
                                    className="text-[10px] font-bold text-red-500 uppercase hover:underline"
                                >
                                    Clear All
                                </button>
                            )}
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 p-4 bg-gray-50 rounded-2xl max-h-90 overflow-y-auto border border-dashed border-gray-300">
                            {FILTERED_DISTRICTS.map(dist => (
                                <label
                                    key={dist.id}
                                    className={`flex items-center gap-2 p-3 rounded-xl cursor-pointer transition-all border ${selectedDistricts.includes(dist.name)
                                        ? "bg-black text-white border-black"
                                        : "bg-white hover:border-gray-400 border-transparent shadow-md"
                                        }`}
                                >
                                    <input type="checkbox" value={dist.name} {...register("districts")} className="hidden" />
                                    <span className={`text-[11px] font-bold uppercase ${selectedDistricts.includes(dist.name) ? "text-white" : "text-gray-700"}`}>
                                        {dist.name}
                                    </span>
                                </label>
                            ))}
                            {FILTERED_DISTRICTS.length === 0 && (
                                <div className="col-span-full py-10 text-center text-gray-400 text-xs font-bold uppercase tracking-widest">
                                    No districts found for this division
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button type="submit" className="flex-1 bg-black text-white p-4 rounded-2xl font-bold uppercase hover:bg-gray-800">
                            {isEditing ? "Update Zone" : "Create Zone"}
                        </button>
                        {isEditing && <button onClick={() => { setIsEditing(null); reset(); }} className="bg-gray-200 p-4 rounded-2xl font-bold uppercase">Cancel</button>}
                    </div>
                </form>
            </div>

            {/* List Section {zone.districts.length > 5 && "..."} */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {zones.map(zone => (
                    <div key={zone._id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-md flex justify-between items-start">
                        <div>
                            <h3 className="text-lg font-black text-gray-900">{zone.name}</h3>
                            <p className="text-blue-600 font-bold">Charge: ৳{zone.deliveryCharge}</p>
                            <p className="text-xs text-gray-500 mt-1">Districts: {zone.districts.join(", ")}</p>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => handleEdit(zone)} className="p-2 bg-gray-100 rounded-xl hover:bg-blue-100 text-blue-600"><Edit3 size={18} /></button>
                            <button onClick={() => handleDelete(zone._id)} className="p-2 bg-gray-100 rounded-xl hover:bg-red-100 text-red-600"><Trash2 size={18} /></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminShippingZones;