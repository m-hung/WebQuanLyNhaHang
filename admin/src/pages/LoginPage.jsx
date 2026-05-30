import React, { useState } from "react";
import { login } from "../services/auth";

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const data = await login(username, password);
            sessionStorage.setItem("token", data.token);
            sessionStorage.setItem("role", data.role);
            sessionStorage.setItem("fullName", data.fullName);
            sessionStorage.setItem("username", username);
            window.location.href = "/";
        } catch (err) {
            setError(err.message || "Đăng nhập thất bại!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Đăng nhập</h1>
                <p className="text-gray-500 text-sm mb-6">Hệ thống quản lý nhà hàng</p>

                {error && (
                    <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Tên đăng nhập
                        </label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            autoComplete="off"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:border-blue-500 text-sm"
                            placeholder="Nhập username..."
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Mật khẩu
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="new-password"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:border-blue-500 text-sm"
                            placeholder="Nhập mật khẩu..."
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3 rounded-lg text-white font-semibold transition ${
                            loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                        }`}
                    >
                        {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                    </button>
                </form>
            </div>
        </div>
    );
}