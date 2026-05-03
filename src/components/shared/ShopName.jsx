import React from 'react';
import { useConfig } from '../../context/ConfigContext';

const ShopName = () => {
    const { siteName } = useConfig()
    return (
        <div className="relative">
            <h1 className="text-3xl font-black uppercase tracking-tighter italic leading-none">
                {siteName}<span className="text-violet-600">.</span>
            </h1>
            <div className="absolute -bottom-2 left-0 w-12 h-1 bg-violet-600 rounded-full"></div>
        </div>
    );
};

export default ShopName;