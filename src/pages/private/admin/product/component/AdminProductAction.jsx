import React, { useState } from "react";
import toast from "react-hot-toast";
import api from "../../../../../services/axios";
import ProductForm from "./ProductForm";

const AdminProductAction = ({ editingProduct, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const isEditMode = !!editingProduct; // যদি editingProduct থাকে তবে এটি True

  const handleAction = async (data) => {
    setLoading(true);
    const formData = new FormData();

    // ১. ইমেজ হ্যান্ডেলিং
    if (data.newImages && data.newImages.length > 0) {
      data.newImages.forEach((file) => {
        formData.append("images", file);
      });
    }

    // ২. ফিল্ডস অ্যাপেন্ড করা
    const fields = ["name", "description", "category", "basePrice"];
    fields.forEach((field) => {
      formData.append(field, data[field]);
    });

    formData.append("variants", JSON.stringify(data.variants));

    try {
      let res;
      if (isEditMode) {
        // এডিট মোড হলে PUT রিকোয়েস্ট
        res = await api.put(`/api/products/${editingProduct._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        // অ্যাড মোড হলে POST রিকোয়েস্ট
        res = await api.post("/api/products", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      if (res.data.success) {
        toast.success(isEditMode ? "Product Updated!" : "Product Added!");
        if (onSuccess) onSuccess();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProductForm 
      initialData={editingProduct} // এডিট মোডে পুরনো ডেটা ফর্মে দেখাবে
      onSubmit={handleAction} 
      isLoading={loading} 
    />
  );
};

export default AdminProductAction;