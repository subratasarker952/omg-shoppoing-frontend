import api from "../../services/axios";

export const getCurrentUser = async () => {
    const res = await api.get("/api/auth/current-user");
    return res.data;
};

export const registerUser = async (data) => {
    const res = await api.post("/api/auth/register", data);
    return res.data;
};

export const loginUser = async (data) => {
    const res = await api.post("/api/auth/login", data);
    return res.data;
};

export const verifyEmail = async (token) => {
    const res = await api.get(`/api/auth/verify-email/${token}`);
    return res.data;
};

export const forgotPassword = async (data) => {
    const res = await api.post(`/api/auth/forgot-password`, data);
    return res.data;
};

export const resetPassword = async (token, data) => {
    const res = await api.post(`/api/auth/reset-password/${token}`, data);
    return res.data;
};

export const refreshToken = async (data) => {
    const res = await api.post(`/api/auth/refresh-token`, data);
    return res.data;
};

export const logoutByRefreshToken = async () => {
    const res = await api.post(`/api/auth/logout`);
    return res.data;
};