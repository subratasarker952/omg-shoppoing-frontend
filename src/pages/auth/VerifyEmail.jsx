import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useEffect, useState } from "react";
import { verifyEmail } from "./authService";

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleVerify = async () => {
      try {
        setLoading(true);

        const { success, message } = await verifyEmail(token);

        if (!success) return;

        toast.success(message || "Email verified successfully");

        navigate("/login");
      } catch (error) {
        console.error(error);

        toast.error(
          error?.response?.data?.message || "Verification Failed"
        );

        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    if (token) handleVerify();
  }, [navigate, token]);

  return (
    <div className="flex items-center justify-center min-h-[60vh] px-4 bg-gray-100 dark:bg-gray-900">
      {loading && <p>Verifying...</p>}
    </div>
  );
};

export default VerifyEmail;