import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { loginUser } from './authService';
import { useAuth } from '../../context/AuthContext';

// আপনার নতুন বানানো রিইউজেবল কম্পোনেন্টগুলো ইমপোর্ট করুন

import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Mail, Lock, LogIn } from 'lucide-react';

const Login = () => {
  const location = useLocation();
  const from = location?.state?.from || '/dashboard'
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({}); // ফিল্ড লেভেল এরর দেখানোর জন্য

  const { refetchUser } = useAuth();

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    // টাইপ করার সময় এরর মেসেজ মুছে ফেলা
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleSubmit = async e => {
    e.preventDefault();

    // ভ্যালিডেশন চেক
    if (!form.email || !form.password) {
      setErrors({
        email: !form.email ? 'ইমেইল প্রয়োজন' : null,
        password: !form.password ? 'পাসওয়ার্ড প্রয়োজন' : null
      });
      toast.error('সব ফিল্ড পূরণ করুন');
      return;
    }

    try {
      setLoading(true);
      const { refreshToken, accessToken } = await loginUser(form);

      if (refreshToken && accessToken) {
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('accessToken', accessToken);

        await refetchUser();
        toast.success('লগইন সফল হয়েছে');
        navigate(from);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'লগইন ব্যর্থ হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 dark:bg-transparent">
      <Card className="max-w-md w-full p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 text-indigo-600 mb-4">
            <LogIn size={32} />
          </div>
          <h2 className="text-3xl font-black text-gray-800">Welcome Back</h2>
          <p className="text-gray-500 mt-2">আপনার অ্যাকাউন্ট লগইন করুন</p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <Input
            label="Email Address"
            type="email"
            name="email"
            placeholder="example@gmail.com"
            value={form.email}
            onChange={handleChange}
            icon={Mail}
            error={errors.email}
            disabled={loading}
          />

          <Input
            label="Password"
            type="password"
            name="password"
            placeholder="••••••••"
            value={form.password}
            onChange={handleChange}
            icon={Lock}
            error={errors.password}
            disabled={loading}
          />

          <div className="flex items-center justify-end">
            <Link to="/forgot-password" size="sm" className="text-xs font-bold text-indigo-600 hover:underline">
              পাসওয়ার্ড ভুলে গেছেন?
            </Link>
          </div>

          <Button
            type="submit"
            variant="primary"
            loading={loading}
            className="w-full py-3 text-base shadow-lg shadow-indigo-200"
          >
            লগইন করুন
          </Button>

          <p className="text-center text-sm text-gray-500 mt-6">
            অ্যাকাউন্ট নেই?{' '}
            <Link to="/register" className="font-bold text-indigo-600 hover:underline">
              রেজিস্ট্রেশন করুন
            </Link>
          </p>
        </form>
      </Card>
    </div>
  );
};

export default Login;