import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { resetPassword } from "./authService";

// আমাদের তৈরি করা UI Components ইমপোর্ট করুন
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Lock, KeyRound } from "lucide-react";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleReset = async (e) => {
    e.preventDefault();

    // প্রাথমিক ভ্যালিডেশন
    if (!token) {
      toast.error("Invalid or missing reset link");
      return navigate("/login");
    }

    if (!newPassword) {
      setError("Please enter a new password");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { success, message } = await resetPassword(token, {
        password: newPassword,
      });

      if (success) {
        toast.success(message || "Password reset successfully");
        navigate("/login");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Invalid or expired token");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[70vh] px-4 dark:bg-transparent">
      <Card className="max-w-md w-full p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
            <KeyRound size={32} />
          </div>
          <h2 className="text-2xl font-black text-gray-800">
            Reset Password
          </h2>
          <p className="text-gray-500 mt-2 text-sm">
            আপনার নতুন পাসওয়ার্ডটি সেট করুন।
          </p>
        </div>

        <form onSubmit={handleReset} className="space-y-6">
          <Input
            label="New Password"
            type="password"
            placeholder="••••••••"
            value={newPassword}
            onChange={(e) => {
                setNewPassword(e.target.value);
                if(error) setError(null);
            }}
            icon={Lock}
            error={error}
            disabled={loading}
          />

          <Button
            type="submit"
            variant="primary" // অথবা আপনি সবুজ চাইলে className="bg-green-600 hover:bg-green-700" দিতে পারেন
            loading={loading}
            className="w-full py-3 shadow-lg bg-green-600 hover:bg-green-700 text-white"
          >
            Update Password
          </Button>
          
          <div className="text-center">
            <button 
              type="button"
              onClick={() => navigate('/login')}
              className="text-sm text-gray-500 hover:text-indigo-600 font-medium transition-colors"
            >
              Back to Login
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default ResetPassword;