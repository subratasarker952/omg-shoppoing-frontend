import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Loader from "../../components/shared/Loader";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation(); // ইউজারের বর্তমান লোকেশন ট্র্যাক করার জন্য

  if (loading) {
    return <Loader fullScreen={true} />; // পুরো স্ক্রিন জুড়ে স্পিনার দেখাবে
  }

  if (!user) {
    // state-এ বর্তমান লোকেশন পাঠিয়ে দিচ্ছি যাতে লগইনের পর এখানে ফিরে আসতে পারে
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;