import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { registerUser } from './authService';

// Reusable UI Components
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { User, Mail, Lock, UserPlus } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // টাইপ করার সময় এরর মুছে ফেলা
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password } = formData;

    // ক্লায়েন্ট সাইড ভ্যালিডেশন
    if (!name || !email || !password) {
      setErrors({
        name: !name ? 'নাম প্রয়োজন' : null,
        email: !email ? 'ইমেইল প্রয়োজন' : null,
        password: !password ? 'পাসওয়ার্ড প্রয়োজন' : null
      });
      toast.error('সব ঘর পূরণ করুন');
      return;
    }

    try {
      setLoading(true);
      const { success, message } = await registerUser(formData);
      
      if (success) {
        toast.success(message || 'রেজিস্ট্রেশন সফল হয়েছে');
        navigate('/login');
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'রেজিস্ট্রেশন ব্যর্থ হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 dark:bg-transparent transition-all">
      <Card className="max-w-md w-full p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 text-indigo-600 mb-4">
            <UserPlus size={32} />
          </div>
          <h2 className="text-3xl font-black text-gray-800">Create Account</h2>
          <p className="text-gray-500 mt-2">অ্যাকাউন্ট খুলতে তথ্যগুলো দিন </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="John Doe"
            icon={User}
            error={errors.name}
            disabled={loading}
            className="capitalize"
          />

          <Input
            label="Email Address"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="john@example.com"
            icon={Mail}
            error={errors.email}
            disabled={loading}
          />

          <Input
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            icon={Lock}
            error={errors.password}
            disabled={loading}
          />

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              loading={loading}
              className="w-full py-3 text-base shadow-lg shadow-indigo-200"
            >
              রেজিস্টার করুন
            </Button>
          </div>

          <p className="text-center text-sm text-gray-500 mt-6">
            ইতিমধ্যেই অ্যাকাউন্ট আছে?{' '}
            <Link to="/login" className="font-bold text-indigo-600 hover:underline">
              লগইন করুন
            </Link>
          </p>
        </form>
      </Card>
    </div>
  );
};

export default Register;