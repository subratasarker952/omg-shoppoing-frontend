import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Loader from "../../components/shared/Loader";

const SpecificRoute = ({ roles }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <Loader fullScreen={true} />; // পুরো স্ক্রিন জুড়ে স্পিনার দেখাবে
  }

  // ইউজার না থাকলে লগইনে পাঠাবে
  if (!user) return <Navigate to="/login" replace />;

  // রোল চেক করার সময় একটু বেশি সতর্ক থাকা ভালো (Case-insensitive check)
  const userRole = user?.role?.name || user?.role; // যদি role সরাসরি string হয় তার জন্য safe check
  
  const hasAccess = roles.some(role => role.toLowerCase() === userRole?.toLowerCase());

  if (roles && !hasAccess) {
    // এক্সেস না থাকলে ড্যাশবোর্ডে পাঠাবে অথবা একটি 'Unauthorized' পেজে
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default SpecificRoute;