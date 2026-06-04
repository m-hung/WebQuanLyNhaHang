import React, { useState } from "react";
import { login, forgotPassword } from "../services/auth";

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const [forgotMode, setForgotMode] = useState(false);
    const [forgotEmail, setForgotEmail] = useState("");
    const [forgotLoading, setForgotLoading] = useState(false);
    const [forgotMessage, setForgotMessage] = useState("");

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

    const handleForgotSubmit = async (e) => {
        e.preventDefault();
        setForgotMessage("");
        setForgotLoading(true);
        try {
            const usernameToSend = forgotEmail || username;
            await forgotPassword(usernameToSend);
            setForgotMessage("Đã gửi yêu cầu. Hãy kiểm tra email.");
        } catch (err) {
            setForgotMessage(err.message || "Quên mật khẩu thất bại");
        } finally {
            setForgotLoading(false);
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

                {/* FORM ĐĂNG NHẬP BÌNH THƯỜNG */}
                {!forgotMode && (
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
                )}

                {/* FORM QUÊN MẬT KHẨU */}
                {forgotMode && (
                    <form onSubmit={handleForgotSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                Địa chỉ Email đã đăng ký
                            </label>
                            <input
                                type="email" // Bật type email để trình duyệt tự kiểm tra định dạng @
                                value={forgotEmail}
                                onChange={(e) => setForgotEmail(e.target.value)}
                                autoComplete="off"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:border-blue-500 text-sm"
                                placeholder="Nhập email của bạn (vd: admin@gmail.com)..."
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={forgotLoading}
                            className={`w-full py-3 rounded-lg text-white font-semibold transition ${
                                forgotLoading ? "bg-gray-400 cursor-not-allowed" : "bg-yellow-600 hover:bg-yellow-700"
                            }`}
                        >
                            {forgotLoading ? "Đang gửi Email..." : "Gửi link khôi phục"}
                        </button>
                    </form>
                )}

                {/* NÚT CHUYỂN ĐỔI GIỮA 2 FORM */}
                <div className="mt-4 text-center">
                    {!forgotMode ? (
                        <button
                            onClick={() => { setForgotMode(true); setForgotEmail(""); setForgotMessage(""); setError(""); }}
                            className="text-sm text-blue-600 hover:underline"
                        >
                            Quên mật khẩu?
                        </button>
                    ) : (
                        <button
                            onClick={() => { setForgotMode(false); setForgotMessage(""); setError(""); }}
                            className="text-sm text-gray-600 hover:underline"
                        >
                            Quay lại đăng nhập
                        </button>
                    )}
                </div>

                {/* THÔNG BÁO THÀNH CÔNG KHI QUÊN MẬT KHẨU */}
                {forgotMessage && (
                    <div className="bg-green-50 text-green-700 px-4 py-3 rounded-lg text-sm mt-4 text-center">
                        {forgotMessage}
                    </div>
                )}

            </div>
        </div>
    );
}