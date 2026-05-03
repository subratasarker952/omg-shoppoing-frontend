import React from 'react';
import { useForm } from 'react-hook-form';
import { Mail, Phone, MapPin, Send } from "lucide-react";
import toast from 'react-hot-toast'; // অপশনাল, মেসেজ দেখানোর জন্য
import api from '../../../services/axios';

const Contact = () => {
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

    const onSubmit = async (data) => {
        try {
            // আপনার API endpoint অনুযায়ী URL পরিবর্তন করুন
            await api.post('/api/contacts', data);
            toast.success("Message sent successfully!");
            reset();
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-20 px-6">
            <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
                
                {/* Contact Info */}
                <div className="space-y-12">
                    <div>
                        <h2 className="text-4xl font-black text-gray-900 tracking-tight mb-4">Get in Touch</h2>
                        <p className="text-gray-500 font-medium">Have questions about our multi-vendor platform? Our team is here to help you scale your business.</p>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center gap-6 p-6 bg-white rounded-3xl border border-gray-100 shadow-sm">
                            <div className="w-12 h-12 bg-violet-50 text-violet-600 rounded-2xl flex items-center justify-center">
                                <Mail size={20} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Email Us</p>
                                <p className="text-gray-900 font-bold">support@yourplatform.com</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-6 p-6 bg-white rounded-3xl border border-gray-100 shadow-sm">
                            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                                <Phone size={20} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Call Anytime</p>
                                <p className="text-gray-900 font-bold">+880 1XXX XXXXXX</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-6 p-6 bg-white rounded-3xl border border-gray-100 shadow-sm">
                            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                                <MapPin size={20} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Office</p>
                                <p className="text-gray-900 font-bold">Dhaka, Bangladesh</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-xl shadow-gray-200/50 border border-gray-100">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase text-gray-400 ml-2">Full Name</label>
                                <input 
                                    {...register("name", { required: "Name is required" })}
                                    className={`w-full px-6 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-violet-500 transition-all font-medium ${errors.name ? 'ring-2 ring-red-500' : ''}`}
                                    placeholder="John Doe"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase text-gray-400 ml-2">Email Address</label>
                                <input 
                                    {...register("email", { 
                                        required: "Email is required",
                                        pattern: { value: /^\S+@\S+$/i, message: "Invalid email" }
                                    })}
                                    className={`w-full px-6 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-violet-500 transition-all font-medium ${errors.email ? 'ring-2 ring-red-500' : ''}`}
                                    placeholder="john@example.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase text-gray-400 ml-2">Subject</label>
                            <input 
                                {...register("subject", { required: "Subject is required" })}
                                className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-violet-500 transition-all font-medium"
                                placeholder="How can we help?"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase text-gray-400 ml-2">Message</label>
                            <textarea 
                                {...register("message", { required: "Message is required" })}
                                rows="5"
                                className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-violet-500 transition-all font-medium resize-none"
                                placeholder="Your message here..."
                            ></textarea>
                        </div>

                        <button 
                            disabled={isSubmitting}
                            className="w-full bg-gray-900 hover:bg-black text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 transition-all disabled:opacity-50"
                        >
                            {isSubmitting ? "Sending..." : "Send Message"}
                            <Send size={18} />
                        </button>
                    </form>
                </div>

            </div>
        </div>
    );
};

export default Contact;