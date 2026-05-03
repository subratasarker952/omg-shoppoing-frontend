import React from "react";
import { AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";

const PaymentCancelled = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-yellow-50 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full text-center  -mt-50">
        
        <AlertCircle size={80} className="mx-auto text-yellow-500 mb-4" />

        <h1 className="text-2xl font-bold text-yellow-600 mb-2">
          Payment Cancelled
        </h1>

        <p className="text-gray-600 mb-6">
          You cancelled the payment process.
        </p>

        <Link
          to="/"
          className="inline-block bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-lg transition"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default PaymentCancelled;