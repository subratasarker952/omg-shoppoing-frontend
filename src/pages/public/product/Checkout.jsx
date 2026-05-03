import { useEffect, useMemo, useState } from "react";
import {
    CheckCircle2, Truck, CreditCard, Ticket,
    ShoppingBasket, Globe, Plus, ArrowRight,
    Loader2, ShoppingBag,
    Zap
} from "lucide-react";
import { useCart } from "../../../context/CartContext";
import toast from 'react-hot-toast';
import { useAddresses } from "../../../hooks/useAddresses";
import { useNavigate, Link } from "react-router-dom";
import api from "../../../services/axios";
import AddAddressModal from "./component/AddAddressModal";
import AddressCard from "./component/AddressCard";
import { useConfig } from "../../../context/ConfigContext";

const Checkout = () => {
    const navigate = useNavigate();
    const { cart, cartTotal, clearCart } = useCart();
    const { addresses, loading: addressLoading, addAddress, deleteAddress, updateAddress } = useAddresses();

    // States
    const [showModal, setShowModal] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState(null);
    const [couponCode, setCouponCode] = useState("");
    const [discount, setDiscount] = useState(0);
    const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
    const [isOrdering, setIsOrdering] = useState(false);

    // নতুন একটি স্টেট যোগ করুন
    const [addressToEdit, setAddressToEdit] = useState(null);

    // এডিট করার জন্য এই ফাংশনটি ব্যবহার করুন
    const handleEditAddress = (addr) => {
        setAddressToEdit(addr); // এডিটের জন্য ডাটা সেট হলো
        setShowModal(true);
    };

    // নতুন অ্যাড্রেস যোগ করার সময় ডাটা ক্লিন করে নিন
    const handleAddNewClick = () => {
        setAddressToEdit(null); // ডাটা নাল মানেই এটা 'Add' মোড
        setShowModal(true);
    };

    // মডাল ক্লোজ করার সময় স্টেট ক্লিন করুন
    const handleCloseModal = () => {
        setShowModal(false);
        setAddressToEdit(null);
    };

    // অটোমেটিক প্রথম অ্যাড্রেস সিলেক্ট করা
    useEffect(() => {
        if (addresses.length > 0 && !selectedAddress) {
            setSelectedAddress(addresses[0]);
        }
    }, [addresses, selectedAddress]);


    const { freeShippingThreshold, shippingInsideDhaka, shippingOutsideDhaka } = useConfig(); // গ্লোবাল সেটিংস (freeShippingThreshold ইত্যাদি)
    const [shippingZones, setShippingZones] = useState([]);
    const [dynamicShippingCharge, setDynamicShippingCharge] = useState(0);

    // ১. ব্যাকএন্ড থেকে সব শিপিং জোন ফেচ করা
    useEffect(() => {
        const fetchZones = async () => {
            try {
                const { data } = await api.get('/api/shipping-zones');
                setShippingZones(data.zones);
            } catch (err) {
                console.error(err);
                console.error("Shipping zones load failed");
            }
        };
        fetchZones();
    }, []);

    // ২. শিপিং চার্জ ক্যালকুলেশন লজিক (রিয়েল ডাটা অনুযায়ী)
    useEffect(() => {
        if (!selectedAddress || !shippingZones.length) {
            setDynamicShippingCharge(0);
            return;
        }

        // ১. ফ্রি শিপিং চেক
        if (freeShippingThreshold && cartTotal >= freeShippingThreshold) {
            setDynamicShippingCharge(0);
            return;
        }

        // ২. জেলা ম্যাচ করা (Case match নিশ্চিত করে)
        const userDistrict = selectedAddress.state; // ধরা যাক "Khulna"

        const matchedZone = shippingZones.find(zone =>
            zone.districts.some(d => d.toLowerCase() === userDistrict?.toLowerCase())
        );

        if (matchedZone) {
            setDynamicShippingCharge(matchedZone.deliveryCharge);
        } else {
            // ৩. ফ্যালব্যাক লজিক
            const isDhaka = userDistrict?.toLowerCase() === "dhaka";
            const fallbackCharge = isDhaka
                ? (shippingInsideDhaka || 60)
                : (shippingOutsideDhaka || 120);
            setDynamicShippingCharge(fallbackCharge);
        }
    }, [selectedAddress, shippingZones, cartTotal, freeShippingThreshold, shippingInsideDhaka, shippingOutsideDhaka]);

    // ৩. ফাইনাল টোটাল (মেমোরাইজড যাতে বারবার ক্যালকুলেট না হয়)
    const finalTotal = useMemo(() => {
        return (cartTotal + dynamicShippingCharge) - discount;
    }, [cartTotal, dynamicShippingCharge, discount]);


    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) return toast.error("কুপন কোড লিখুন");
        setIsApplyingCoupon(true);

        try {
            // কার্ট থেকে আইটেমগুলো ম্যাপ করে পাঠানো
            const items = cart.map(item => ({
                productId: item._id,
                price: item.price, // ডিসকাউন্ট সহ প্রাইস
                quantity: item.quantity,
                isFlashSale: item.isFlashSale || false // এই ফ্ল্যাগটি কার্টে থাকতে হবে
            }));

            const res = await api.post('/api/coupons/validate', {
                code: couponCode,
                cartItems: items
            });

            setDiscount(res.data.discount);
            toast.success(`৳${res.data.discount} ডিসকাউন্ট অ্যাপ্লাই হয়েছে!`);
        } catch (err) {
            toast.error(err.response?.data?.message || "ভুল কুপন কোড");
            setDiscount(0);
        } finally {
            setIsApplyingCoupon(false);
        }
    };

    const handlePlaceOrder = async () => {
        if (!selectedAddress) return toast.error("শিপিং অ্যাড্রেস সিলেক্ট করুন!");
        if (!paymentMethod) return toast.error("Payment method সিলেক্ট করুন!");
        if (cart.length === 0) return toast.error("আপনার কার্ট খালি!");

        // ব্যাকএন্ডের Schema অনুযায়ী ডেটা ফরম্যাট করা
        const orderData = {
            items: cart.map(item => ({
                productId: item.productId,
                variantId: item.variantId || item.variant._id, // স্টক ম্যানেজমেন্টের জন্য মাস্ট
                name: item.name,
                variant: {
                    size: item.variant.size,
                    color: item.variant.color
                },
                price: item.variant.pricing.current,
                purchasePrice: item.variant.purchasePrice,
                quantity: item.quantity,
                isFlashSale:item.isFlashSale
            })),
            shippingAddress: { ...selectedAddress },
            summary: {
                subtotal: cartTotal,
                shippingCharge: dynamicShippingCharge,
                discount,
                totalAmount: finalTotal
            },
            paymentMethod: paymentMethod,
            couponCode: couponCode
        };

        setIsOrdering(true);
        try {
            const res = await api.post('/api/orders', orderData);

            if (res.data.success) {
                clearCart();
                navigate('/dashboard/my-orders');
            }
        } catch (err) {
            // ব্যাকএন্ড থেকে আসা স্টক আউট এরর হ্যান্ডলিং
            toast.error(err.response?.data?.message || "অর্ডার প্লেস করতে সমস্যা হয়েছে");
        } finally {
            setIsOrdering(false);
        }
    };

    // কার্ট খালি থাকলে শো করবে
    if (cart.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center  space-y-4">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center">
                    <ShoppingBag size={40} className="text-gray-200" />
                </div>
                <h2 className="text-2xl font-black uppercase tracking-tighter">Your bag is empty</h2>
                <Link to="/products" className="bg-black text-white px-8 py-3 rounded-2xl font-bold uppercase text-xs tracking-widest hover:bg-violet-600 transition-all">
                    Return to Shop
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-1 min-h-screen bg-gray-50 text-black">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* বাম পাশ: ফর্ম সেকশন (8 Columns) */}
                <div className="lg:col-span-8 space-y-12">

                    {/* ১. শিপিং অ্যাড্রেস */}
                    <section>
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-black">1</div>
                            <h3 className="text-2xl font-black uppercase tracking-tighter">Shipping Address</h3>
                        </div>

                        {addressLoading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="h-40 bg-gray-50 animate-pulse rounded-3xl" />
                                <div className="h-40 bg-gray-50 animate-pulse rounded-3xl" />
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {addresses.map((addr) => (
                                    <AddressCard
                                        key={addr._id}
                                        address={addr}
                                        isSelected={selectedAddress?._id === addr._id}
                                        onSelect={setSelectedAddress}
                                        deleteAddress={deleteAddress}
                                        editAddress={handleEditAddress}
                                    />
                                ))}

                                <button
                                    onClick={handleAddNewClick}
                                    className="group border-2 border-dashed border-gray-200 rounded-4xl p-8 flex flex-col items-center justify-center gap-3  hover:border-violet-600 hover:bg-violet-50/30 hover:text-violet-600 transition-all duration-500"
                                >
                                    <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-violet-100 transition-colors">
                                        <Plus size={24} />
                                    </div>
                                    <span className="font-bold text-sm tracking-tight">Add New Address</span>
                                </button>
                            </div>
                        )}
                    </section>

                    {/* ২. পেমেন্ট মেথড */}
                    <section>
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-black">2</div>
                            <h3 className="text-2xl font-black uppercase tracking-tighter">Payment Method</h3>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {[
                                { id: 'COD', label: 'Cash on Delivery', icon: <Truck size={20} /> },
                                { id: 'sslcommerz', label: 'Digital Payment', icon: <CreditCard size={20} /> },
                                { id: 'stripe', label: 'International Card', icon: <Globe size={20} /> }
                            ].map((method) => (
                                <label
                                    key={method.id}
                                    className={`relative p-6 rounded-3xl cursor-pointer border-2 transition-all duration-300 ${paymentMethod === method.id
                                        ? 'border-violet-600 bg-violet-50/50 ring-4 ring-violet-50'
                                        : 'border-gray-100 bg-white hover:border-gray-300'
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        name="payment"
                                        className="hidden"
                                        onChange={() => setPaymentMethod(method.id)}
                                    />
                                    <div className={`mb-3 ${paymentMethod === method.id ? 'text-violet-600' : ''}`}>
                                        {method.icon}
                                    </div>
                                    <p className={`font-black text-[10px] uppercase tracking-widest ${paymentMethod === method.id ? 'text-violet-600' : 'text-gray-900'}`}>
                                        {method.label}
                                    </p>
                                    {paymentMethod === method.id && (
                                        <CheckCircle2 className="absolute top-4 right-4 text-violet-600" size={18} />
                                    )}
                                </label>
                            ))}
                        </div>
                    </section>
                </div>

                {/* ডান পাশ: অর্ডার সামারি (4 Columns) */}
                <div className="lg:col-span-4">
                    <div className="bg-white border border-gray-100 p-8 rounded-[2.5rem] sticky top-24 shadow-sm">
                        <div className="flex items-center gap-2 mb-8">
                            <ShoppingBasket size={20} className="text-violet-600" />
                            <h2 className="text-xl font-black uppercase tracking-tighter text-black">Order Summary</h2>
                        </div>

                        {/* ১. কার্ট আইটেমস - নতুন প্রাইসিং লজিকসহ */}
                        <div className="max-h-64 overflow-y-auto no-scrollbar space-y-5 mb-8 pr-2">
                            {cart.map(item => (
                                <div key={item.variantId} className="flex justify-between items-start gap-4 group">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <h4 className="text-sm font-bold text-gray-900 line-clamp-1">{item.name}</h4>
                                            {item.isFlashSale && <Zap size={12} className="text-red-500 fill-current" />}
                                        </div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase mt-0.5 tracking-widest">
                                            {item.variant.color} / {item.variant.size} × {item.quantity}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        {/* সরাসরি item.price ব্যবহার হচ্ছে যা ব্যাকএন্ড থেকে ক্যালকুলেটেড */}
                                        <p className="font-black text-sm text-black">৳{(item.price * item.quantity).toLocaleString()}</p>
                                        {item.isFlashSale && (
                                            <p className="text-[10px] text-gray-400 line-through font-bold">
                                                ৳{(item.variant.price * item.quantity).toLocaleString()}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* ২. কুপন সেকশন - ক্লিন ডিজাইন */}
                        <div className="relative mb-8">
                            <Ticket className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="PROMO CODE"
                                className="w-full bg-gray-50 border border-gray-100 pl-12 pr-24 py-4 rounded-2xl outline-none focus:border-violet-600 focus:bg-white transition-all font-black text-xs tracking-widest"
                                value={couponCode}
                                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                            />
                            <button
                                onClick={handleApplyCoupon}
                                disabled={isApplyingCoupon || !couponCode}
                                className="absolute right-2 top-2 bottom-2 bg-black text-white px-5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-violet-600 transition-all disabled:opacity-30"
                            >
                                {isApplyingCoupon ? '...' : 'Apply'}
                            </button>
                        </div>

                        {/* ৩. ক্যালকুলেশন কার্ড */}
                        <div className="bg-gray-50/50 p-6 rounded-3xl space-y-4 border border-gray-100">
                            {/* Subtotal - এটি ফ্ল্যাশ সেল ডিসকাউন্টসহ ভ্যালু */}
                            <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-gray-500">
                                <span>Subtotal</span>
                                <span className="text-black">৳{cartTotal.toLocaleString()}</span>
                            </div>

                            {/* Shipping */}
                            <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-gray-500">
                                <div className="flex flex-col">
                                    <span>Shipping Fee</span>
                                    {selectedAddress && (
                                        <span className="text-[9px] text-violet-600 normal-case font-black">
                                            Area: {selectedAddress.state}
                                        </span>
                                    )}
                                </div>
                                <span className={dynamicShippingCharge === 0 ? "text-green-600" : "text-black"}>
                                    {dynamicShippingCharge === 0 ? "FREE" : `৳${dynamicShippingCharge}`}
                                </span>
                            </div>

                            {/* Coupon Discount */}
                            {discount > 0 && (
                                <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-orange-600 bg-orange-50 p-2 rounded-lg border border-orange-100">
                                    <span>Coupon Discount</span>
                                    <span>- ৳{discount.toLocaleString()}</span>
                                </div>
                            )}

                            {/* Grand Total */}
                            <div className="pt-4 border-t border-dashed border-gray-200 flex justify-between items-end">
                                <div>
                                    <span className="text-[10px] font-black uppercase text-gray-400 block mb-1">Total Amount</span>
                                    <span className="text-3xl font-black tracking-tighter text-black">৳{finalTotal.toLocaleString()}</span>
                                </div>

                                {/* Payment Method Badge */}
                                <div className="flex flex-col items-end gap-1">
                                    <span className="text-[9px] font-black text-gray-400 uppercase">Payment Method</span>
                                    <span className={`px-3 py-1 rounded-full border text-[10px] font-black uppercase shadow-sm ${paymentMethod ? 'bg-violet-50 border-violet-100 text-violet-600' : 'bg-red-50 border-red-100 text-red-500'
                                        }`}>
                                        {paymentMethod ? paymentMethod.replace('_', ' ') : "Not Selected"}
                                    </span>
                                </div>
                            </div>

                            {/* Place Order Button */}
                            <button
                                onClick={handlePlaceOrder}
                                disabled={isOrdering || cart.length === 0}
                                className="w-full bg-black text-white py-5 rounded-2xl font-black uppercase text-sm tracking-[0.2em] hover:bg-violet-600 transition-all flex items-center justify-center gap-3 disabled:bg-gray-200 disabled:cursor-not-allowed shadow-xl shadow-gray-100 mt-4 active:scale-95"
                            >
                                {isOrdering ? (
                                    <Loader2 className="animate-spin" size={20} />
                                ) : (
                                    <>
                                        Confirm Order <ArrowRight size={18} />
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* মডাল সেকশন */}
            {showModal && (
                <AddAddressModal
                    isOpen={showModal}
                    onClose={handleCloseModal} // যদি addressToEdit থাকে তাহলে updateAddress, নাহলে addAddress
                    onSave={addressToEdit ? updateAddress : addAddress}
                    initialData={addressToEdit} // selectedAddress-এর বদলে addressToEdit দিন
                />
            )}
        </div>
    );
};

export default Checkout;