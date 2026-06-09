import React, { useState, useEffect } from "react";
import { fetch } from "../services/api";
import { useSearchParams, useNavigate } from "react-router-dom";
import { resetPassword } from "../services/auth";

export default function ResetPassword() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token") || "";
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            setError("Đường link không hợp lệ hoặc không có mã xác thực.");
        }
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        if (newPassword.length < 6) {
            setError("Mật khẩu phải có ít nhất 6 ký tự");
            return;
        }
        if (newPassword !== confirmPassword) {
            setError("Mật khẩu xác nhận không khớp");
            return;
        }

        setLoading(true);
        try {
            const res = await resetPassword(token, newPassword);
            setMessage(res.message || "Đổi mật khẩu thành công! Đang chuyển về trang đăng nhập...");
            setTimeout(() => navigate('/login'), 2500); // Đợi 2.5 giây rồi chuyển về trang login
        } catch (err) {
            setError(err.message || "Lỗi khi đổi mật khẩu (Mã xác thực có thể đã hết hạn)");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Đặt lại mật khẩu</h1>
                <p className="text-gray-500 text-sm mb-6">Vui lòng nhập mật khẩu mới cho tài khoản của bạn.</p>

                {error && (<div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm mb-4">{error}</div>)}
                {message && (<div className="bg-green-50 text-green-700 px-4 py-3 rounded-lg text-sm mb-4">{message}</div>)}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Mật khẩu mới</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:border-blue-500 text-sm"
                            placeholder="Nhập mật khẩu mới..."
                            required
                            disabled={!token}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Xác nhận mật khẩu</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:border-blue-500 text-sm"
                            placeholder="Nhập lại mật khẩu..."
                            required
                            disabled={!token}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !token}
                        className={`w-full py-3 rounded-lg text-white font-semibold transition ${loading || !token ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
                    >
                        {loading ? 'Đang xử lý...' : 'Đổi mật khẩu'}
                    </button>
                </form>
            </div>
        </div>
    );
}