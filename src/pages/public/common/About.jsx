import React from 'react';
import { ShieldCheck, Zap, Globe, Users, Target } from "lucide-react";

const About = () => {
    const stats = [
        { label: "Active Users", value: "10K+", icon: <Users size={20} /> },
        { label: "Total Sales", value: "৳50M+", icon: <Zap size={20} /> },
        { label: "Reliability", value: "99.9%", icon: <ShieldCheck size={20} /> },
    ];

    const values = [
        { 
            title: "Scalability", 
            desc: "Built with a high-performance MERN stack to handle thousands of concurrent transactions.",
            icon: <Zap className="text-violet-500" />
        },
        { 
            title: "Multi-Tenancy", 
            desc: "Isolated store management for sellers with secure role-based access control.",
            icon: <Globe className="text-blue-500" />
        },
        { 
            title: "Security", 
            desc: "Advanced JWT authentication and encrypted payment integrations for safe trading.",
            icon: <ShieldCheck className="text-emerald-500" />
        }
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="py-20 px-6 container mx-auto text-center">
                <h1 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tighter mb-6">
                    Empowering Commerce <br /> 
                    <span className="text-violet-600">Across Bangladesh.</span>
                </h1>
                <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed">
                    We provide a cutting-edge multi-vendor marketplace solution designed for scale, 
                    security, and seamless user experiences.
                </p>
            </section>

            {/* Stats */}
            <section className="bg-gray-50 py-16">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                    {stats.map((s, i) => (
                        <div key={i} className="flex flex-col items-center p-8 bg-white rounded-3xl shadow-sm border border-gray-100">
                            <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-violet-600 mb-4">
                                {s.icon}
                            </div>
                            <h3 className="text-3xl font-black text-gray-900">{s.value}</h3>
                            <p className="text-gray-400 font-bold uppercase text-xs tracking-widest mt-1">{s.label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Values Section */}
            <section className="py-24 px-6 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {values.map((v, i) => (
                        <div key={i} className="space-y-4">
                            <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center shadow-inner">
                                {v.icon}
                            </div>
                            <h3 className="text-xl font-black text-gray-900">{v.title}</h3>
                            <p className="text-gray-500 leading-relaxed text-sm font-medium">{v.desc}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default About;