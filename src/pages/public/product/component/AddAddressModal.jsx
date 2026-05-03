import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { X, MapPin, Phone, User, Globe, ChevronDown } from "lucide-react";
import { BANGLADESH_DISTRICTS } from "../../../../constants/appData";

const AddAddressModal = ({ isOpen, onClose, onSave, initialData }) => {
    const { register, handleSubmit, reset, formState:{errors} } = useForm();

    useEffect(() => {
        if (initialData) {
            reset(initialData);
        } else {
            reset({ name: "", phone: "", street: "", city: "", state: "", zip: "", country: "Bangladesh" });
        }
    }, [initialData, reset, isOpen]);

    const onSubmit = async (data) => {
        const payload = initialData ? { ...data, _id: initialData._id } : data;
        await onSave(payload);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-hidden">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Card */}
            <div className="relative bg-white w-full max-w-lg rounded-t-[2.5rem] sm:rounded-[2.5rem] shadow-2xl overflow-hidden transform transition-all animate-in fade-in zoom-in slide-in-from-bottom-10 duration-300 max-h-[95vh] flex flex-col">

                {/* Header - Fixed */}
                <div className="px-8 pt-8 pb-4 flex justify-between items-start bg-white z-10">
                    <div>
                        <h3 className="text-2xl font-black text-gray-900 tracking-tight">
                            {initialData ? "Edit Address" : "New Address"}
                        </h3>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
                            Where should we send your package?
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 bg-gray-50 hover:bg-gray-100 text-black rounded-full transition-all active:scale-90"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form - Scrollable */}
                <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-4 overflow-y-auto custom-scrollbar">

                    {/* Full Name */}
                    <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            {...register("name", { required: "নাম প্রয়োজন" })}
                            placeholder="Recipient Name"
                            className={`w-full bg-gray-50 border-2 ${errors?.name ? 'border-red-500' : 'border-transparent'} focus:border-violet-600 focus:bg-white px-12 py-4 rounded-2xl outline-none transition-all font-semibold text-gray-800 shadow-sm`}
                        />
                    </div>

                    {/* Phone */}
                    <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            {...register("phone", { required: "ফোন নম্বর প্রয়োজন" })}
                            placeholder="Phone Number"
                            className={`w-full bg-gray-50 border-2 ${errors?.phone ? 'border-red-500' : 'border-transparent'} focus:border-violet-600 focus:bg-white px-12 py-4 rounded-2xl outline-none transition-all font-semibold text-gray-800 shadow-sm`}
                        />
                    </div>

                    {/* Street Address */}
                    <div className="relative">
                        <MapPin className="absolute left-4 top-4 text-gray-400" size={18} />
                        <textarea
                            {...register("street", { required: "ঠিকানা প্রয়োজন" })}
                            placeholder="Street Address, House No."
                            rows="2"
                            className={`w-full bg-gray-50 border-2 ${errors?.street ? 'border-red-500' : 'border-transparent'} focus:border-violet-600 focus:bg-white px-12 py-4 rounded-2xl outline-none transition-all font-semibold text-gray-800 shadow-sm resize-none`}
                        />
                    </div>

                    {/* City & District */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase text-gray-400 ml-1">City / Area</label>
                            <input
                                {...register("city", { required: "সিটি প্রয়োজন" })}
                                placeholder="e.g. Dhanmondi"
                                className="w-full bg-gray-50 border-2 border-transparent focus:border-violet-600 focus:bg-white px-6 py-4 rounded-2xl outline-none transition-all font-semibold text-gray-800 shadow-sm"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase text-gray-400 ml-1">District</label>
                            <div className="relative">
                                <select
                                    {...register("state", { required: "জেলা সিলেক্ট করুন" })}
                                    className="w-full bg-gray-50 border-2 border-transparent focus:border-violet-600 focus:bg-white px-6 py-4 rounded-2xl outline-none transition-all font-semibold text-gray-800 shadow-sm appearance-none cursor-pointer"
                                >
                                    <option value="">Select District</option>
                                    {BANGLADESH_DISTRICTS?.map((district) => (
                                        <option key={district.id} value={district.name}>
                                            {district.name}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                            </div>
                        </div>
                    </div>

                    {/* Zip & Country */}
                    <div className="grid grid-cols-2 gap-4">
                        <input
                            {...register("zip", { required: "জিপ কোড দিন" })}
                            placeholder="Zip Code"
                            className="w-full bg-gray-50 border-2 border-transparent focus:border-violet-600 focus:bg-white px-6 py-4 rounded-2xl outline-none transition-all font-semibold text-gray-800 shadow-sm"
                        />
                        <div className="relative">
                            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                {...register("country")}
                                defaultValue="Bangladesh"
                                className="w-full bg-gray-200 border-2 border-transparent px-12 py-4 rounded-2xl font-semibold text-gray-500 shadow-sm cursor-not-allowed"
                                disabled
                            />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-4 pt-4 pb-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 border-2 border-gray-100 rounded-2xl px-6 py-4 text-gray-500 font-black uppercase tracking-widest text-xs hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-2 bg-black text-white py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-black/20 hover:bg-violet-600 transition-all active:scale-95"
                        >
                            {initialData ? "Update Address" : "Save Address"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddAddressModal;