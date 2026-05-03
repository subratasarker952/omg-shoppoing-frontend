import { useState, useEffect } from "react";
import api from "../services/axios";

const useCategory = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/categories");
      // আপনার এপিআই রেসপন্স অনুযায়ী ডেটা সেট করুন
      if (res.data.success) {
        setCategories(res.data.categories);
      }
    } catch (err) {
      setError(err.response?.data?.message || "ক্যাটাগরি লোড করতে সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // ক্যাটাগরি লিস্ট রিফ্রেশ করার জন্য রিকল করার অপশন রাখা ভালো
  return { categories, loading, error, refresh: fetchCategories };
};

export default useCategory;