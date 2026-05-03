import { Edit3, Trash2, MapPin, Phone, User, CheckCircle2 } from "lucide-react";

const AddressCard = ({ address, isSelected, onSelect, deleteAddress, editAddress }) => {

    const handleDelete = (e) => {
        e.stopPropagation();
        if (window.confirm("আপনি কি এই ঠিকানাটি মুছে ফেলতে চান?")) {
            deleteAddress(address._id);
        }
    };

    const handleEdit = (e) => {
        e.stopPropagation();
        editAddress(address);
    };

    return (
        <div
            onClick={onSelect ? () => onSelect(address) : null}
            className={`relative p-6 rounded-4xl cursor-pointer transition-all duration-300 group border-2 ${isSelected
                ? "border-violet-600 bg-violet-50/30 shadow-xl shadow-violet-100 ring-1 ring-violet-600/20"
                : "border-gray-100 bg-white hover:border-gray-300 hover:shadow-md"
                }`}
        >
            {/* Selected Indicator Badge */}
            <div className={`absolute -top-3 -right-3 transition-transform duration-300 ${isSelected ? "scale-100" : "scale-0"}`}>
                <div className="bg-violet-600 text-white p-1.5 rounded-full shadow-lg">
                    <CheckCircle2 size={16} strokeWidth={3} />
                </div>
            </div>

            <div className="flex flex-col h-full justify-between">
                <div>
                    {/* Header: Name and Actions */}
                    <div className="absolute top-2 right-2">
                        {/* Action Buttons */}
                        <div className="flex gap-1">
                            <button
                                onClick={handleEdit}
                                className="p-2 text-gray-400 hover:text-violet-600 hover:bg-violet-100 rounded-xl transition-all"
                                title="Edit"
                            >
                                <Edit3 size={16} />
                            </button>
                            <button
                                onClick={handleDelete}
                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-100 rounded-xl transition-all"
                                title="Delete"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>


                    {/* Contact & Address Body */}
                    <div className="space-y-3 pt-3">
                        <div className="flex items-center gap-2 text-gray-600">
                            <User size={14} />
                            <h4 className="font-black text-gray-900 uppercase tracking-tighter"> {address.name} </h4>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                            <Phone size={14} className="text-gray-400" />
                            <span className="text-sm font-bold tracking-tight">{address.phone}</span>
                        </div>

                        <div className="flex items-start gap-2 text-gray-500">
                            <MapPin size={14} className="text-gray-400 mt-1 shrink-0" />
                            <div className="text-xs font-medium leading-relaxed uppercase tracking-wide">
                                <p>{address.street}</p>
                                <p className="mt-1">
                                    {address.city}, {address.state} — {address.zip}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Country Tag */}
                <div className="mt-5 flex items-center justify-between">
                    <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-[0.15em] ${isSelected ? "bg-violet-200 text-violet-700" : "bg-gray-100 text-gray-400"
                        }`}>
                        {address.country === "bd" ? "Bangladesh" : address.country}
                    </span>

                    {!isSelected && (
                        <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                            Click to select
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AddressCard;