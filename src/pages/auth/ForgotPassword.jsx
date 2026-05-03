import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { forgotPassword } from './authService';

// আমাদের রিইউজেবল UI Components
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Mail, Fingerprint, ArrowLeft } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setError('দয়া করে আপনার ইমেইলটি দিন');
      return toast.error('ইমেইল প্রয়োজন');
    }

    try {
      setLoading(true);
      setError(null);
      
      const { success, message } = await forgotPassword({ email });
      
      if (success) {
        toast.success(message || 'রিসেট লিঙ্ক আপনার ইমেইলে পাঠানো হয়েছে');
        setEmail('');
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'কিছু একটা ভুল হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4 dark:bg-transparent">
      <Card className="max-w-md w-full p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-4">
            <Fingerprint size={32} />
          </div>
          <h2 className="text-2xl font-black text-gray-800">Forgot Password?</h2>
          <p className="text-gray-500 mt-2 text-sm">
            চিন্তা করবেন না! আপনার ইমেইল দিন, একটি পাসওয়ার্ড রিসেট লিঙ্ক পাঠিয়ে দেব।
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Email Address"
            type="email"
            placeholder="admin@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError(null);
            }}
            icon={Mail}
            error={error}
            disabled={loading}
          />

          <Button
            type="submit"
            variant="primary"
            loading={loading}
            className="w-full py-3 shadow-lg bg-blue-600 hover:bg-blue-700"
          >
            Send Reset Link
          </Button>

          <div className="text-center mt-6">
            <Link 
              to="/login" 
              className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft size={16} /> লগইন পেজে ফিরে যান
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default ForgotPassword;