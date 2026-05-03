import React from 'react'

const Unauthorized = () => {
    return (
        <div className="h-[70vh] flex items-center justify-center text-center">
            <div>
                <h1 className="text-3xl font-bold text-red-600">⚠️ Access Denied</h1>
                <p className="mt-2 text-gray-500">You are not authorized to view this page.</p>
            </div>
        </div>
    );
}

export default Unauthorized
