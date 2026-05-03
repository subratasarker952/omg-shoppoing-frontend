import React from "react";
import { XCircle } from "lucide-react";
import { Link } from "react-router-dom";

const PaymentFailed = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-red-50 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full text-center -mt-50">
        
        <XCircle size={80} className="mx-auto text-red-500 mb-4" />

        <h1 className="text-2xl font-bold text-red-600 mb-2">
          Payment Failed
        </h1>

        <p className="text-gray-600 mb-6">
          Something went wrong. Please try again.
        </p>

        <Link
          to="/"
          className="inline-block bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition"
        >
          Try Again
        </Link>
      </div>
    </div>
  );
};

export default PaymentFailed;