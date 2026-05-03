import React, { useState, useEffect, useMemo } from "react";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { Save, Plus, Trash2, Image as ImageIcon, Loader2, AlertCircle } from "lucide-react";
import useCategory from "../../../../../hooks/useCategory";

const ProductForm = ({ initialData, onSubmit, isLoading }) => {
  const { categories, loading: catLoading } = useCategory()
  const [selectedFiles, setSelectedFiles] = useState([]);

  const { register, control, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: initialData || {
      name: "",
      category: "",
      description: "",
      basePrice: "",
      variants: [{ size: "", color: "", stock: "", price: "", purchasePrice: "" }]
    }
  });

  const { fields, append, remove } = useFieldArray({ control, name: "variants" });
  const watchedVariants = useWatch({ control, name: "variants" });

  useEffect(() => {
    if (initialData) {
      // ডাটাবেজ থেকে আসা ডাটা ক্লিন করা
      const cleanedData = {
        ...initialData,
        // যদি category একটা অবজেক্ট হয়, তবে শুধু ID টা নিন
        category: initialData.category?._id || initialData.category || "",
        // নিশ্চিত করুন প্রাইস নাম্বার হিসেবে আছে
        basePrice: Number(initialData.basePrice) || 0,
        // ভেরিয়েন্টগুলো ম্যাপিং
        variants: initialData.variants?.map(v => ({
          size: v.size || "",
          color: v.color || "",
          stock: Number(v.stock) || 0,
          price: Number(v.price) || 0,
          purchasePrice: Number(v.purchasePrice) || 0,
        })) || [{ size: "", color: "", stock: 0, price: 0, purchasePrice: 0 }]
      };

      reset(cleanedData);
    }
  }, [initialData, reset, categories]);

  const previews = useMemo(() => {
    if (selectedFiles.length > 0) {
      return selectedFiles.map(file => URL.createObjectURL(file));
    }
    return initialData?.images?.map(img => img.url) || [];
  }, [selectedFiles, initialData?.images]);

  const handleImageChange = (e) => {
    setSelectedFiles(Array.from(e.target.files));
  };

  // onSubmit এ ইমেজগুলো পাঠাতে setSelectedFiles ব্যবহার করবেন
  const onFormSubmit = (data) => {
    onSubmit({ ...data, newImages: selectedFiles });
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-8 max-w-5xl mx-auto">

      {/* ১. বেসিক প্রোডাক্ট ইনফো */}
      <div className="bg-white p-4 rounded-4xl border border-gray-100 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-blue-600">
          <h3 className="text-sm font-black uppercase tracking-widest">Product Information</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-gray-500 uppercase ml-1">Product Name</label>
            <input
              {...register("name", { required: "নাম দেওয়া বাধ্যতামূলক" })}
              placeholder="e.g. Premium Leather Shoe"
              className={`w-full bg-gray-50 p-4 rounded-2xl outline-none focus:ring-2 transition-all ${errors.name ? 'ring-2 ring-red-500 focus:ring-red-500' : 'focus:ring-blue-500'}`}
            />
            {errors.name && <p className="text-red-500 text-[10px] font-bold flex items-center gap-1 uppercase ml-1"><AlertCircle size={12} /> {errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold text-gray-500 uppercase ml-1">Base Price (BDT)</label>
            <input
              type="number"
              {...register("basePrice", { required: "মূল্য নির্ধারণ করুন", min: { value: 1, message: "মূল্য অবশ্যই ১ এর বেশি হতে হবে" } })}
              className="w-full bg-gray-50 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.basePrice && <p className="text-red-500 text-[10px] font-bold uppercase ml-1">{errors.basePrice.message}</p>}
          </div>

          <div className="md:col-span-2 space-y-2">
            <label className="text-[11px] font-bold text-gray-500 uppercase ml-1">Description</label>
            <textarea
              {...register("description", { required: "ডেসক্রিপশন প্রয়োজন" })}
              rows="3"
              placeholder="পণ্য সম্পর্কে বিস্তারিত লিখুন..."
              className="w-full bg-gray-50 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.description && <p className="text-red-500 text-[10px] font-bold uppercase ml-1">{errors.description.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold text-gray-500 uppercase ml-1">Category</label>
            <select
              {...register("category", { required: "Category is required" })}
              disabled={catLoading}
              className="w-full bg-gray-50 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 appearance-none font-bold text-gray-700 disabled:opacity-50"
            >
              <option value="">{catLoading ? "Loading..." : "সিলেক্ট ক্যাটাগরি"}</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ২. ডাইনামিক ইনভেন্টরি ও ভ্যারিয়েন্ট */}
      <div className="bg-white p-4 rounded-4xl border border-gray-100 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest text-orange-600">Inventory & Variants</h3>
            <p className="text-[10px] text-gray-400 font-bold uppercase">Active Variations: {watchedVariants?.length || 0}</p>
          </div>
          <button
            type="button"
            onClick={() => append({ size: "", color: "", stock: "", price: "", purchasePrice:"" })}
            className="flex items-center gap-2 text-xs font-black bg-orange-50 text-orange-600 px-5 py-2.5 rounded-2xl hover:bg-orange-100 transition-all active:scale-95"
          >
            <Plus size={16} /> ADD VARIANT
          </button>
        </div>

        <div className=" space-y-4">
          {fields.map((field, index) => (
            <div key={field.id} className="grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-4 p-1 bg-gray-50 rounded-3xl items-start border border-transparent hover:border-orange-200 transition-all">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Size</label>
                <input
                  {...register(`variants.${index}.size`, { required: "Size required" })}
                  placeholder="e.g. XL / 42"
                  className="w-full bg-white p-3 rounded-xl outline-none shadow-sm focus:ring-2 focus:ring-orange-300"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Color</label>
                <input
                  {...register(`variants.${index}.color`)}
                  placeholder="e.g. Black"
                  className="w-full bg-white p-3 rounded-xl outline-none shadow-sm focus:ring-2 focus:ring-orange-300"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Stock</label>
                <input
                  type="number"
                  {...register(`variants.${index}.stock`, { required: true, min: 0 })}
                  className="w-full bg-white p-3 rounded-xl outline-none shadow-sm focus:ring-2 focus:ring-orange-300"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Price</label>
                <input
                  type="number"
                  {...register(`variants.${index}.price`)}
                  className="w-full bg-white p-3 rounded-xl outline-none shadow-sm focus:ring-2 focus:ring-orange-300"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Coasting</label>
                <input
                  type="number"
                  {...register(`variants.${index}.purchasePrice`)}
                  className="w-full bg-white p-3 rounded-xl outline-none shadow-sm focus:ring-2 focus:ring-orange-300"
                />
              </div>
              <div className="flex justify-center items-center h-full pt-6">
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="p-2.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ৩. ইমেজ ম্যানেজমেন্ট */}
      <div className="bg-white p-4 rounded-4xl border border-gray-100 shadow-sm space-y-4">
        <h3 className="text-sm font-black uppercase tracking-widest text-purple-600">Media Gallery</h3>
        <div className="flex flex-wrap gap-4">
          {previews.map((src, i) => (
            <div key={i} className="relative group">
              <img src={src} className="w-28 h-28 object-cover rounded-[20px] border-2 border-gray-100 shadow-sm" alt="product-preview" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-[20px] flex items-center justify-center">
                <p className="text-white text-[10px] font-bold uppercase">Image {i + 1}</p>
              </div>
            </div>
          ))}
          <label className="w-28 h-28 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-[20px] cursor-pointer hover:bg-purple-50 hover:border-purple-300 transition-all group">
            <ImageIcon className="text-gray-400 group-hover:text-purple-500 mb-1" size={28} />
            <span className="text-[10px] font-black text-gray-400 group-hover:text-purple-500 uppercase">Add Photo</span>
            <input type="file" multiple onChange={handleImageChange} className="hidden" accept="image/*" />
          </label>
        </div>
      </div>

      {/* স্টিকি সেভ বাটন */}
      <div className="flex justify-center">
        <button
          type="submit"
          disabled={isLoading}
          className="flex items-center gap-3 bg-black text-white p-5 rounded-full font-black shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:scale-105 active:scale-95 disabled:bg-gray-400 transition-all border border-white/10 group"
        >
          {isLoading ? <Loader2 className="animate-spin" size={22} /> : <Save size={22} className="group-hover:rotate-12 transition-transform" />}
          <span className="tracking-tighter uppercase text-lg">
            {initialData ? "Update Product" : "Publish Product"}
          </span>
        </button>
      </div>
    </form>
  );
};

export default ProductForm;