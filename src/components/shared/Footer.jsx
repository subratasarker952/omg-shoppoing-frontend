import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, ShoppingBag, Twitter, Youtube } from 'lucide-react';
import React from 'react';
import { useConfig } from '../../context/ConfigContext';

const Footer = () => {
    const currentYear = new Date().getFullYear();
    const config = useConfig(); // ভেরিয়েবল নাম সুন্দর করলাম

    // সোশ্যাল মিডিয়া লিস্ট ডায়নামিক করা
    const socialLinks = [
        { Icon: Facebook, url: config?.facebookUrl },
        { Icon: Instagram, url: config?.instagramUrl },
        { Icon: Twitter, url: config?.twitterUrl },
        { Icon: Linkedin, url: config?.linkedinUrl },
    ].filter(link => link.url); // যেগুলোর লিংক নেই সেগুলো দেখাবে না

    return (
        <footer className="bg-neutral-900 text-zinc-400 w-full font-sans border-t border-zinc-800">
            <div className="container mx-auto px-6 py-16">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">

                    {/* Brand & About */}
                    <div className='flex flex-col gap-6'>
                        <div className="flex items-center gap-2">

                            <ShoppingBag className="text-white" size={24} />

                            <h6 className="text-xl font-bold tracking-tight text-white uppercase">
                                {config?.siteName || "Peyejan"}
                            </h6>
                        </div>
                        <p className="text-[13px] leading-relaxed max-w-xs">
                            {config?.metaDescription || "বাংলাদেশের অন্যতম প্রিমিয়াম ই-commerce প্ল্যাটফর্ম। সঠিক দামে গুণগত মানের সেরা পণ্য পৌঁছে দেয়াই আমাদের লক্ষ্য।"}
                        </p>

                        {/* ডায়নামিক সোশ্যাল লিংক */}
                        <div className='flex gap-3 mt-2'>
                            {socialLinks.map(({ Icon, url }, index) => (
                                <a
                                    key={index}
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="h-9 w-9 flex items-center justify-center rounded-full border border-zinc-800 hover:bg-white hover:text-black transition-all duration-300"
                                >
                                    <Icon size={16} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Customer Support */}
                    <div className='flex flex-col gap-6'>
                        <h6 className="text-[12px] font-bold uppercase tracking-[0.2em] text-zinc-100">Support</h6>
                        <nav className="flex flex-col gap-3 text-[13px]">
                            {['Track Order', 'Return & Exchange', 'Shipping Info', 'Privacy Policy'].map((item) => (
                                <a key={item} className="hover:text-white transition-colors cursor-pointer w-fit relative group">
                                    {item}
                                    <span className="absolute -bottom-1 left-0 w-0 h-px bg-white transition-all duration-300 group-hover:w-full"></span>
                                </a>
                            ))}
                        </nav>
                    </div>

                    {/* Company Info */}
                    <div className='flex flex-col gap-6'>
                        <h6 className="text-[12px] font-bold uppercase tracking-[0.2em] text-zinc-100">Company</h6>
                        <nav className="flex flex-col gap-3 text-[13px]">
                            {['About Us', 'Terms & Conditions', 'Become a Seller', 'Contact Us'].map((item) => (
                                <a key={item} className="hover:text-white transition-colors cursor-pointer w-fit relative group">
                                    {item}
                                    <span className="absolute -bottom-1 left-0 w-0 h-px bg-white transition-all duration-300 group-hover:w-full"></span>
                                </a>
                            ))}
                        </nav>
                    </div>

                    {/* Contact Information (Fully Dynamic) */}
                    <div className='flex flex-col gap-6'>
                        <h6 className="text-[12px] font-bold uppercase tracking-[0.2em] text-zinc-100">Contact</h6>
                        <div className="flex flex-col gap-4 text-[13px]">
                            <div className="flex items-start gap-3 group">
                                <MapPin size={16} className="text-white shrink-0" />
                                <span className="group-hover:text-zinc-200 transition-colors">
                                    {config?.address || "ধানমন্ডি, ঢাকা ১২০৯, বাংলাদেশ"}
                                </span>
                            </div>
                            <div className="flex items-center gap-3 group">
                                <Phone size={16} className="text-white shrink-0" />
                                <a href={`tel:${config?.sitePhone}`} className="group-hover:text-zinc-200 transition-colors">
                                    {config?.sitePhone || "+880 1XXX-XXXXXX"}
                                </a>
                            </div>
                            <div className="flex items-center gap-3 group">
                                <Mail size={16} className="text-white shrink-0" />
                                <a href={`mailto:${config?.siteEmail}`} className="group-hover:text-zinc-200 transition-colors">
                                    {config?.siteEmail || "support@peyejan.com"}
                                </a>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Bottom Bar */}
                <div className="border-t border-zinc-800 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-medium uppercase tracking-[0.15em]">
                    <div className="text-zinc-500">
                        © {currentYear} {config?.siteName || "Peyejan"}. Built for Excellence.
                    </div>
                    <div className="flex gap-8 text-zinc-500">
                        <span className="hover:text-zinc-300 transition-colors cursor-default">
                            Status: {config?.maintenanceMode ? "Maintenance" : "Live"}
                        </span>
                        <span className="hover:text-zinc-300 transition-colors cursor-default">Version 2.0.4</span>
                    </div>
                </div>

            </div>
        </footer>
    );
};

export default Footer;