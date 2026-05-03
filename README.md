# Multi-Vendor Marketplace (Bangladesh) 🛒🇧🇩

একটি আধুনিক, স্কেলেবল এবং পারফরম্যান্স-অপ্টিমাইজড মাল্টি-ভেন্ডর ই-কমার্স প্ল্যাটফর্ম যা বিশেষ করে বাংলাদেশের প্রেক্ষাপটে (COD, Steadfast Courier, Local Shipping Zones) তৈরি করা হয়েছে।

## 🚀 মূল ফিচারসমূহ (Core Features)

### 👥 ইউজার রোলস (Role-based Access)
- **Admin:** রোডাক্ট লিস্টিং (ভ্যারিয়েন্টসহ), অর্ডার ম্যানেজমেন্ট, প্ল্যাটফর্ম কন্ট্রোল, সেলস অ্যানালিটিক্স।
- **Buyer:** প্রোডাক্ট ব্রাউজিং, উইশলিস্ট, কার্ট এবং ট্র্যাকিং।

### 💳 পেমেন্ট ও লজিস্টিকস
- **Payment:** অনলাইন পেমেন্ট (SSLCommerz/bKash) এবং ক্যাশ অন ডেলিভারি (COD)।
- **Courier:** Steadfast API ইন্টিগ্রেশন (সেলার অ্যাড্রেস থেকে সরাসরি পিকআপ)। // not complete


---

## 🛠️ টেক স্ট্যাক (Tech Stack)

- **Frontend:** React.js, Tailwind CSS, TanStack Query (React Query), Axios.
- **Backend:** Node.js, Express.js.
- **Database:** MongoDB (Mongoose).
- **Security:** JWT Authentication, Role-based Access Control (RBAC), Zod Validation.
- **Others:** Sharp (Image Compression), Cloudinary (Image Hosting).

---

## 📂 প্রোজেক্ট স্ট্রাকচার (Folder Structure)

```text
/root
├── /backend
│   ├── /controllers     # বিজনেস লজিক
│   ├── /models          # MongoDB স্কিমা (User, Product, Store, Order)
│   ├── /routes          # API এন্ডপয়েন্টস
│   ├── /middleware      # Auth & Role verification
│   └── server.js
├── /frontend
│   ├── /src
│   │   ├── /components  # রি-ইউজেবল UI এলিমেন্টস
│   │   ├── /pages       # Admin, Seller, Buyer পেজসমূহ
│   │   ├── /hooks       # কাস্টম রিয়্যাক্ট হুকস
│   │   └── /api         # Axios কনফিগারেশন
└── README.md



admin= admin@example.com
pass= admin@example

user = subratasarker952@gmail.com
pass = 123456
