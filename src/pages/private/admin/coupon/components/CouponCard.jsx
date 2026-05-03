import { Calendar, DollarSign, Edit3, ShieldCheck, Trash2, Users } from "lucide-react";
import moment from "moment";

const CouponCard = ({handleEdit, handleDelete, coupon, type }) => {
    const usagePercent = Math.min(100, Math.round((coupon.usedCount / coupon.usageLimit) * 100));
    const isFullyUsed = coupon.usedCount >= coupon.usageLimit;

    return (
        <div className={`relative bg-white p-5 rounded-3xl border transition-all duration-300 shadow-md group 
                ${type === 'expired' ? 'border-gray-200 grayscale-[0.5]' : 'border-violet-100'}`}>

            {/* Status Indicator */}
            <div className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm
                    ${type === 'expired' ? 'bg-gray-500 text-white' : isFullyUsed ? 'bg-rose-500 text-white' : 'bg-emerald-500 text-white'}`}>
                {type === 'expired' ? 'Expired' : isFullyUsed ? 'Sold Out' : 'Active'}
            </div>

            <div className="flex justify-between items-start mb-4 mt-2">
                <div className="px-3 py-1 bg-violet-50 text-violet-700 rounded-xl text-xs font-black tracking-widest border border-violet-100 uppercase">
                    {coupon.code}
                </div>
                <div className="flex gap-1">
                    <button onClick={() => handleEdit(coupon)} className="p-2 text-blue-500 bg-blue-50 rounded-xl transition-colors"><Edit3 size={16} /></button>
                    <button onClick={() => handleDelete(coupon._id)} className="p-2 text-rose-500 bg-rose-50 rounded-xl transition-colors"><Trash2 size={16} /></button>
                </div>
            </div>

            <div className="space-y-4">
                <div>
                    <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-black text-gray-900">
                            {coupon.discountType === 'percentage' ? `${coupon.discountAmount}%` : `৳${coupon.discountAmount}`}
                        </span>
                        <span className="text-[10px] font-bold text-gray-400 uppercase">Discount</span>
                    </div>
                    {coupon.discountType === 'percentage' && (
                        <p className="text-[10px] font-bold text-violet-600 uppercase tracking-tighter">Up to ৳{coupon.maxDiscountAmount}</p>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-y-3 border-y border-dashed border-gray-100 py-4">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-500 uppercase">
                        <Calendar size={14} className="text-violet-400" /> {moment(coupon.expiryDate).format('DD MMM YYYY')}
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-500 uppercase">
                        <DollarSign size={14} className="text-violet-400" /> Min: ৳{coupon.minOrderAmount}
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-500 uppercase">
                        <Users size={14} className="text-violet-400" /> Limit: {coupon.usageLimit}
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 uppercase">
                        <ShieldCheck size={14} className="text-emerald-500" /> Used: {coupon.usedCount}
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-black uppercase text-gray-400">
                        <span>Usage Load</span>
                        <span className={isFullyUsed ? 'text-rose-500' : 'text-violet-600'}>{usagePercent}%</span>
                    </div>
                    <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                        <div
                            className={`h-full transition-all duration-700 ease-out ${isFullyUsed ? 'bg-rose-500' : 'bg-violet-600'}`}
                            style={{ width: `${usagePercent}%` }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CouponCard