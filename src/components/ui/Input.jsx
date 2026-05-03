export const Input = ({ label, error, icon: Icon, className = "", ...props }) => (
    <div className="w-full space-y-1.5">
      {label && <label className="text-xs font-bold text-gray-500 uppercase ml-1">{label}</label>}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Icon size={18} />
          </div>
        )}
        <input
          className={`w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm transition-all focus:bg-white text-black focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none disabled:opacity-50 ${Icon ? "pl-10" : ""} ${error ? "border-red-500 focus:ring-red-500/20" : ""} ${className}`}
          {...props}
        />
      </div>
      {error && <p className="text-[11px] text-red-500 font-medium ml-1">{error}</p>}
    </div>
  );