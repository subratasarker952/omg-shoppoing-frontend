import { AlertCircle, CheckCircle, Info } from "lucide-react";

export const Alert = ({ type = "info", message }) => {
  const styles = {
    info: "bg-blue-50 text-blue-700 border-blue-100",
    success: "bg-green-50 text-green-700 border-green-100",
    warning: "bg-amber-50 text-amber-700 border-amber-100",
    error: "bg-red-50 text-red-700 border-red-100"
  };

  const icons = {
    info: <Info size={18} />,
    success: <CheckCircle size={18} />,
    warning: <AlertCircle size={18} />,
    error: <AlertCircle size={18} />
  };

  return (
    <div className={`flex items-center gap-3 p-4 rounded-xl border ${styles[type]}`}>
      {icons[type]}
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
};