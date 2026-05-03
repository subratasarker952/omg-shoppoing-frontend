import { Loader2 } from "lucide-react";

export const Button = ({ 
  children, 
  onClick, 
  variant = "primary", 
  loading = false, 
  disabled = false, 
  className = "" 
}) => {
  const variants = {
    primary: "bg-violet-600 text-white hover:bg-violet-700",
    secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200",
    danger: "bg-red-500 text-white hover:bg-red-600",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-50"
  };

  return (
    <button
      onClick={onClick}
      disabled={loading || disabled}
      className={`px-4 py-2 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 ${variants[variant]} ${className}`}
    >
      {loading && <Loader2 size={16} className="animate-spin" />}
      {children}
    </button>
  );
};