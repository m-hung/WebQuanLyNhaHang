import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, X } from "lucide-react";

export default function UserManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({
        username: "", password: "", fullName: "", role: "STAFF", status: "ACTIVE"
    });
    const [submitting, setSubmitting] = useState(false);

    const token = localStorage.getItem("token");

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const res = await fetch("http://localhost:8080/api/users", {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            setUsers(data);
        } catch (err) {
            console.error("Lỗi lấy users:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleOpenAdd = () => {
        setEditingUser(null);
        setFormData({ username: "", password: "", fullName: "", role: "STAFF", status: "ACTIVE" });
        setShowModal(true);
    };

    const handleOpenEdit = (user) => {
        setEditingUser(user);
        setFormData({
            username: user.username,
            password: "",
            fullName: user.fullName || "",
            role: user.role,
            status: user.status
        });
        setShowModal(true);
    };

    const handleSubmit = async () => {
        if (!formData.username || (!editingUser && !formData.password) || !formData.fullName) {
            alert("Vui lòng nhập đầy đủ thông tin!");
            return;
        }
        setSubmitting(true);
        try {
            const url = editingUser
                ? `http://localhost:8080/api/users/${editingUser.userId}`
                : "http://localhost:8080/api/users";
            const method = editingUser ? "PUT" : "POST";
            const body = { ...formData };
            if (editingUser && !formData.password) delete body.password;

            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(body)
            });

            if (res.ok) {
                fetchUsers();
                setShowModal(false);
            } else {
                alert("Lưu thất bại!");
            }
        } catch (err) {
            console.error("Lỗi:", err);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (userId) => {
        if (!window.confirm("Xóa tài khoản này?")) return;
        try {
            await fetch(`http://localhost:8080/api/users/${userId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchUsers();
        } catch (err) {
            console.error("Lỗi xóa:", err);
        }
    };

    const handleToggleStatus = async (user) => {
        const newStatus = user.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
        try {
            await fetch(`http://localhost:8080/api/users/${user.userId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ ...user, password: undefined, status: newStatus })
            });
            fetchUsers();
        } catch (err) {
            console.error("Lỗi:", err);
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen p-6 rounded-2xl">
            {/* HEADER */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800">Quản lý tài khoản</h2>
                    <p className="text-gray-500 mt-1">Quản lý tài khoản admin và nhân viên</p>
                </div>
                <button
                    onClick={handleOpenAdd}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl flex items-center gap-2 transition"
                >
                    <Plus size={18} /> Thêm tài khoản
                </button>
            </div>

            {/* TABLE */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-100">
                    <tr className="text-gray-600">
                        <th className="px-5 py-4 text-left font-semibold">Họ tên</th>
                        <th className="px-5 py-4 text-left font-semibold">Username</th>
                        <th className="px-5 py-4 text-center font-semibold">Role</th>
                        <th className="px-5 py-4 text-center font-semibold">Trạng thái</th>
                        <th className="px-5 py-4 text-center font-semibold">Ngày tạo</th>
                        <th className="px-5 py-4 text-center font-semibold">Hành động</th>
                    </tr>
                    </thead>
                    <tbody>
                    {loading ? (
                        <tr><td colSpan="6" className="text-center py-10 text-gray-400">Đang tải...</td></tr>
                    ) : users.length === 0 ? (
                        <tr><td colSpan="6" className="text-center py-10 text-gray-400">Không có dữ liệu</td></tr>
                    ) : (
                        users.map((user) => (
                            <tr key={user.userId} className="border-b border-gray-100 hover:bg-gray-50 transition">
                                <td className="px-5 py-4 font-semibold text-gray-800">{user.fullName || "—"}</td>
                                <td className="px-5 py-4 text-gray-600">{user.username}</td>
                                <td className="px-5 py-4 text-center">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                            user.role === "ADMIN"
                                                ? "bg-purple-100 text-purple-700"
                                                : "bg-blue-100 text-blue-700"
                                        }`}>
                                            {user.role}
                                        </span>
                                </td>
                                <td className="px-5 py-4 text-center">
                                    <button
                                        onClick={() => handleToggleStatus(user)}
                                        className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
                                            user.status === "ACTIVE"
                                                ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                                                : "bg-red-100 text-red-700 hover:bg-red-200"
                                        }`}
                                    >
                                        {user.status === "ACTIVE" ? "Hoạt động" : "Đã khóa"}
                                    </button>
                                </td>
                                <td className="px-5 py-4 text-center text-gray-500 text-xs">
                                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString("vi-VN") : "—"}
                                </td>
                                <td className="px-5 py-4">
                                    <div className="flex justify-center gap-3">
                                        <button
                                            onClick={() => handleOpenEdit(user)}
                                            className="text-blue-600 hover:text-blue-800"
                                        >
                                            <Edit size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(user.userId)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>

            {/* MODAL */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden flex flex-col">
                        <div className="flex justify-between items-center px-6 py-4 border-b bg-blue-50">
                            <h3 className="text-lg font-bold text-blue-800">
                                {editingUser ? "Sửa tài khoản" : "Thêm tài khoản"}
                            </h3>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-red-500">
                                <X size={22} />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Họ và tên <span className="text-red-500">*</span></label>
                                <input type="text" value={formData.fullName}
                                       onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                       className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500 text-sm"
                                       placeholder="Nhập họ và tên..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Username <span className="text-red-500">*</span></label>
                                <input type="text" value={formData.username}
                                       onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                       disabled={!!editingUser}
                                       className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500 text-sm disabled:bg-gray-100"
                                       placeholder="Nhập username..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">
                                    Mật khẩu {editingUser && <span className="text-gray-400 font-normal">(để trống nếu không đổi)</span>}
                                    {!editingUser && <span className="text-red-500"> *</span>}
                                </label>
                                <input type="password" value={formData.password}
                                       onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                       className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500 text-sm"
                                       placeholder="Nhập mật khẩu..."
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Role</label>
                                    <select value={formData.role}
                                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500 text-sm bg-white"
                                    >
                                        <option value="ADMIN">ADMIN</option>
                                        <option value="STAFF">STAFF</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Trạng thái</label>
                                    <select value={formData.status}
                                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500 text-sm bg-white"
                                    >
                                        <option value="ACTIVE">Hoạt động</option>
                                        <option value="INACTIVE">Khóa</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="px-6 py-4 border-t flex justify-end gap-3 bg-gray-50">
                            <button onClick={() => setShowModal(false)}
                                    className="px-5 py-2 border rounded-lg text-gray-600 hover:bg-gray-100 text-sm font-medium">
                                Hủy
                            </button>
                            <button onClick={handleSubmit} disabled={submitting}
                                    className={`px-5 py-2 rounded-lg text-white text-sm font-medium transition ${submitting ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}>
                                {submitting ? "Đang lưu..." : editingUser ? "Cập nhật" : "Thêm mới"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}