import React, { useState, useEffect } from "react";
import { Plus, Search, Filter, ChevronLeft, ChevronRight, Loader2, Package } from "lucide-react";
import api from "../../../../services/axios";
import ProductCard from "./component/ProductCard";
import { Modal } from "../../../../../src/components/ui/Modal";
import AdminProductAction from "./component/AdminProductAction";
import { Pagination } from "../../../../components/shared/Pagination";
import toast from "react-hot-toast";

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    // Pagination & Filter States
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalProducts, setTotalProducts] = useState(0);
    const [search, setSearch] = useState("");

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const { data } = await api.get(`/api/products?page=${page}&search=${search}&limit=8`);
            if (data.success) {
                setProducts(data.products);
                setTotalProducts(data.totalProducts);
                setTotalPages(data.totalPages);
            }
        } catch (error) {
            console.error("Error fetching products", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchProducts();
        }, 500); // সার্চে ডিবনসিং দেওয়া হয়েছে পারফরম্যান্সের জন্য

        return () => clearTimeout(delayDebounceFn);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, search]);

    const handleEdit = (product) => {
        setEditingProduct(product);
        setShowModal(true);
    };

    const handleAdd = () => {
        setEditingProduct(null);
        setShowModal(true);
    };

    const handleDeleteSuccess = async (id) => {
        const confirmDelete = window.confirm("Are you sure? This will clear images from Cloudinary too!");

        if (confirmDelete) {
            try {
                // আপনার হার্ড ডিলিট API কল
                const { data } = await api.delete(`/api/products/hard/${id}`);

                if (data.success) {
                    toast.error(data?.message || "Delete failed");
                    fetchProducts();
                }
            } catch (error) {
                toast.error(error.response?.data?.message || "Delete failed");
                fetchProducts();
            }
        }
    };

    return (
        <div className="p-2 container mx-auto bg-gray-50 min-h-screen space-y-4">
            {/* Header Section */}
            <div className="flex justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-black flex items-center gap-2">
                        <Package className="text-violet-600" /> Products
                    </h1>
                    <p className="text-gray-500 text-sm font-medium">Manage your Products ({totalProducts})</p>
                </div>

                <div>
                    <button
                        onClick={handleAdd}
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

            {/* Products Grid */}
            {loading ? (
                <div className="flex flex-col items-center justify-center h-64 gap-3">
                    <Loader2 className="animate-spin text-violet-600" size={40} />
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <ProductCard
                            key={product._id}
                            product={product}
                            onEdit={() => handleEdit(product)}
                            onDeleteSuccess={handleDeleteSuccess}
                        />
                    ))}
                </div>
            )}

            <div className="fixed bottom-0 left-1/2 -translate-x-1/2">
                <Pagination
                    currentPage={page}
                    onPageChange={setPage}
                    totalPages={totalPages}
                />
            </div>

            {/* Modal for Add/Edit Form */}
            {showModal && (
                <Modal
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                    title={editingProduct ? "Edit Product" : "Add New Product"}
                    maxWidth="max-w-4xl" // প্রোডাক্ট ফর্মের জন্য একটু বড় সাইজ
                >
                    <AdminProductAction
                        editingProduct={editingProduct}
                        onSuccess={() => {
                            setShowModal(false);
                            fetchProducts();
                        }}
                    />
                </Modal>
            )}
        </div>
    );
};

export default AdminProducts;