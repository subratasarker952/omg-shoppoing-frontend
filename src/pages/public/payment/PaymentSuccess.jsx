import React from "react";
import Confetti from 'react-confetti-boom';
import { CheckCircle } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams()
    const orderId = searchParams.get('orderId')
    return (
        <div className="min-h-screen flex items-center justify-center bg-green-50 px-4">
            <Confetti mode="fall" shapeSize={15} />
            <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full text-center -mt-50">

                <CheckCircle size={80} className="mx-auto text-green-500 mb-4" />

                <h1 className="text-2xl font-bold text-green-600 mb-2">
                    Payment Successful!
                </h1>

                <p className="text-gray-600 mb-6">
                    Your payment has been completed.
                </p>

                <p className="text-gray-600 mb-6">
                    Order Id:   {orderId}
                </p>

                    <Link
                        to="/"
                        className="mr-1 inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition"
                    >
                        Go to Home
                    </Link>
                    <Link
                        to="/dashboard/my-orders"
                        className="ml-1 inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition"
                    >
                        Go to Orders
                    </Link>
            </div>
        </div>
    );
};

export default PaymentSuccess;