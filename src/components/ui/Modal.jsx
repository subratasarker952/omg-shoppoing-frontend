import { X } from "lucide-react";
import { useEffect } from "react";

export const Modal = ({ isOpen, onClose, title, children, maxWidth = "max-w-lg" }) => {
  
  // মডাল ওপেন থাকলে ব্যাকগ্রাউন্ড স্ক্রল বন্ধ রাখা (Best Practice)
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 transition-all"
      onClick={onClose} // বাইরে ক্লিক করলে মডাল ক্লোজ হবে
    >
      <div 
        className={`bg-white rounded-4xl shadow-2xl w-full ${maxWidth} overflow-hidden animate-in fade-in zoom-in duration-300 flex flex-col max-h-[95vh]`}
        onClick={(e) => e.stopPropagation()} // ভেতরের ক্লিকে যাতে মডাল ক্লোজ না হয়
      >
        {/* Header */}
        <div className="bg-gray-50 border-b border-gray-100 p-5 flex justify-between items-center">
          <div>
            <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">{title}</h3>
            <div className="h-1 w-10 bg-violet-600 rounded-full mt-1"></div>
          </div>
          <button 
            onClick={onClose} 
            className="bg-white shadow-sm border border-gray-100 text-gray-400 hover:text-red-500 hover:rotate-90 p-2 rounded-2xl transition-all duration-300"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Area - Scrollable for long forms */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
};