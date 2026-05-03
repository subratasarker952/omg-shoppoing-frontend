import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import api from "../services/axios";
import { DEFAULT_SETTINGS } from "../constants/appData";

const ConfigContext = createContext(null);

export const ConfigProvider = ({ children }) => {
    // লোডিং স্টেটসহ ইনিশিয়াল কনফিগ
    const [config, setConfig] = useState({ ...DEFAULT_SETTINGS, isLoading: true });

    const fetchConfig = useCallback(async () => {
        try {
            const { data } = await api.get("/api/settings");
                        
            if (data.success) {
                // সরাসরি অবজেক্ট মার্জ করছি, কোনো লুপ বা রিডিউস দরকার নেই
                setConfig({
                    ...DEFAULT_SETTINGS,
                    ...(data.settings || {}),
                    isLoading: false
                });
            }
        } catch (error) {
            console.error("Failed to fetch settings:", error);
            setConfig(prev => ({ ...prev, isLoading: false }));
        }
    }, []);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchConfig();
    }, [fetchConfig]);

    // পারফরম্যান্স অপ্টিমাইজেশনের জন্য ভ্যালু মেমোইজ করা
    const value = useMemo(() => ({
        ...config,
        refreshConfig: fetchConfig
    }), [config, fetchConfig]);

    return (
        <ConfigContext.Provider value={value}>
            {children}
        </ConfigContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useConfig = () => {
    const context = useContext(ConfigContext);
    if (!context) {
        throw new Error("useConfig must be used within a ConfigProvider");
    }
    return context;
};