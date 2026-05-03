import React, { useState, useEffect } from "react";
import { Plus, Search, Loader2, Trash2, Layers, Edit3 } from "lucide-react";
import { Modal } from "../../../../../src/components/ui/Modal";
import CategoryForm from "./component/CategoryForm";
import toast from "react-hot-toast";
import api from "../../../../services/axios";

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [search, setSearch] = useState("");

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/api/categories/admin?search=${search}`);
      if (data.success) setCategories(data.categories);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(fetchCategories, 500);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure? Products under this category might be affected!")) {
      try {
        await api.delete(`/api/categories/${id}`);
        toast.success("Category deleted");
        fetchCategories();
      } catch (error) {
        console.error(error);
        toast.error("Error deleting category");
      }
    }
  };

  return (
    <div className="p-2 container mx-auto bg-gray-50 min-h-screen space-y-4">
      {/* Header */}
      <div className="flex justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-black flex items-center gap-2">
            <Layers className="text-violet-600" /> Categories
          </h1>
          <p className="text-gray-500 text-sm font-medium">Organize products by Category ({categories?.length || 0})</p>
        </div>

        <div>
          <button
            onClick={() => { setEditingCategory(null); setShowModal(true); }}
            className="flex items-center justify-center gap-2 bg-black text-white p-3 w-full rounded-2xl font-bold shadow-lg hover:scale-105 transition-all active:scale-95"
          >
            <Plus size={20} /> ADD
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search categories..."
          className="w-full bg-gray-50 pl-14 pr-4 py-3 rounded-2xl outline-none focus:ring-2 text-black focus:ring-violet-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Categories Table/List */}
      <div className="bg-white rounded-4xl border border-gray-100 overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-20 flex justify-center"><Loader2 className="animate-spin text-violet-600" size={40} /></div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="p-5 text-[11px] font-black uppercase text-gray-400 tracking-widest">Icon & Name</th>
                <th className="p-5 text-[11px] font-black uppercase text-gray-400 tracking-widest">Slug</th>
                <th className="p-5 text-[11px] font-black uppercase text-gray-400 tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="p-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-2xl overflow-hidden border border-gray-100 shadow-sm shrink-0">
                        <img
                          src={cat.image?.url || "https://via.placeholder.com/50"}
                          alt={cat.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-800 leading-none mb-1">{cat.name}</span>
                        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full w-fit ${cat.isActive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                          {cat.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="p-5 font-mono text-xs text-gray-500">{cat.slug}</td>
                  <td className="p-5">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => { setEditingCategory(cat); setShowModal(true); }}
                        className="p-2 bg-gray-100 text-gray-600 rounded-xl hover:bg-violet-600 hover:text-white transition-all"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(cat._id)}
                        className="p-2 bg-gray-100 text-gray-400 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal for Add/Edit */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingCategory ? "Edit Category" : "Add Category"}
        maxWidth="max-w-md"
      >
        <CategoryForm
          initialData={editingCategory}
          onSuccess={() => { setShowModal(false); fetchCategories(); }}
        />
      </Modal>
    </div>
  );
};

export default AdminCategories;