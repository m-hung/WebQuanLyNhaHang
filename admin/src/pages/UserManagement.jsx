import React, {useState, useEffect} from "react";
import {Plus, Edit, Trash2, X} from "lucide-react";

export default function UserManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({
        username: "", password: "", confirmPassword: "", oldPassword: "", fullName: "", role: "", status: "ACTIVE"
    });
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState({
        type: "", text: ""
    });
    const [confirmDialog, setConfirmDialog] = useState({isOpen: false, title: "", message: "", onConfirm: null});

    const currentUserRole = sessionStorage.getItem("role") || "STAFF";
    const currentUsername = sessionStorage.getItem("username") || "";
    const token = sessionStorage.getItem("token");

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
        setMessage({
            type: "", text: ""
        });
        setEditingUser(null);
        setFormData({
            username: "", password: "", confirmPassword: "", oldPassword: "", fullName: "", role: "", status: ""
        });
        setShowModal(true);
    };

    const handleOpenEdit = (user) => {
        setMessage({
            type: "", text: ""
        });
        setEditingUser(user);
        setFormData({
            username: user.username,
            password: "",
            oldPassword: "",
            fullName: user.fullName || "",
            role: user.role,
            status: user.status
        });
        setShowModal(true);
    };

    const handleSubmit = async () => {
        if (!formData.username || (!editingUser && !formData.password) || !formData.fullName) {
            setMessage({
                type: "error", text: "Vui lòng nhập đầy đủ thông tin!"
            });
            return;
        }
        if (!editingUser && formData.password !== formData.confirmPassword) {
            setMessage({type: "error", text: "Mật khẩu xác nhận không khớp!"});
            return;
        }
        if (!formData.role) {
            setMessage({
                type: "error", text: "Vui lòng chọn phân quyền!"
            });
            return;
        }
        if (!formData.status) {
            setMessage({
                type: "error", text: "Vui lòng chọn trạng thái!"
            });
            return;
        }

        setSubmitting(true);
        try {
            const url = editingUser ? `http://localhost:8080/api/users/${editingUser.userId}` : "http://localhost:8080/api/users";
            const method = editingUser ? "PUT" : "POST";
            const body = { ...formData };
            if (editingUser && !formData.password) delete body.password;

            const res = await fetch(url, {
                method, headers: {
                    "Content-Type": "application/json", Authorization: `Bearer ${token}`
                }, body: JSON.stringify(body)
            });

            if (res.ok) {
                fetchUsers();
                setMessage({
                    type: "success", text: editingUser ? "Cập nhật tài khoản thành công!" : "Thêm tài khoản thành công!"
                });

                setTimeout(() => {
                    setShowModal(false);
                }, 1000);
            } else {
                const errorMsg = await res.text();
                setMessage({
                    type: "error", text: errorMsg || "Lưu thất bại!"
                });
            }
        } catch (err) {
            console.error("Lỗi:", err);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = (userId) => {
        setConfirmDialog({
            isOpen: true,
            title: "Xác nhận xóa?",
            message: "Bạn có chắc chắn muốn xóa tài khoản này không?",
            onConfirm: async () => {
                try {
                    await fetch(`http://localhost:8080/api/users/${userId}`, {
                        method: "DELETE", headers: {Authorization: `Bearer ${token}`}
                    });
                    fetchUsers();
                } catch (err) {
                    console.error("Lỗi xóa:", err);
                }
            }
        });
    };

    const handleToggleStatus = async (user) => {
        if (user.role === "ADMIN") return;

        const newStatus = user.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
        try {
            await fetch(`http://localhost:8080/api/users/${user.userId}`, {
                method: "PUT", headers: {
                    "Content-Type": "application/json", Authorization: `Bearer ${token}`
                }, body: JSON.stringify({...user, password: undefined, status: newStatus})
            });
            fetchUsers();
        } catch (err) {
            console.error("Lỗi:", err);
        }
    };

    return (<div className="bg-gray-50 min-h-screen p-6 rounded-2xl">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
            <div>
                <h2 className="text-3xl font-bold text-gray-800">Quản lý tài khoản</h2>
            </div>
            {currentUserRole === "ADMIN" && (<button
                onClick={handleOpenAdd}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl flex items-center gap-2 transition"
            >
                <Plus size={18}/> Thêm tài khoản
            </button>)}
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
                {loading ? (<tr>
                    <td colSpan="6" className="text-center py-10 text-gray-400">Đang tải...</td>
                </tr>) : users.length === 0 ? (<tr>
                    <td colSpan="6" className="text-center py-10 text-gray-400">Không có dữ liệu</td>
                </tr>) : ((currentUserRole === "ADMIN" ? users
                        : currentUserRole === "MANAGER" ? users.filter(u => u.role !== "ADMIN")
                            : users.filter(u => u.username === currentUsername))
                    .sort((a, b) => {
                        if (a.username === currentUsername) return -1;
                        if (b.username === currentUsername) return 1;
                        return 0;
                    }).map((user) => (<tr key={user.userId}
                                                                                                    className={`border-b border-gray-100 transition ${user.status === "INACTIVE" ? "bg-gray-100 opacity-60 grayscale-[50%]" : "hover:bg-gray-50"}`}>
                    <td className="px-5 py-4 font-semibold text-gray-800">{user.fullName || "—"}</td>
                    <td className="px-5 py-4 text-gray-600">{user.username}</td>
                    <td className="px-5 py-4 text-center">
                        <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${user.role === "ADMIN" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}>
                            {user.role}
                        </span>
                    </td>
                    <td className="px-5 py-4 text-center">
                        {user.role === "ADMIN" ? (<span
                            className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                                Hoạt động
                            </span>) : (<button
                            onClick={() => handleToggleStatus(user)}
                            disabled={currentUserRole !== "ADMIN"}
                            className={`px-3 py-1 rounded-full text-xs font-semibold transition ${currentUserRole !== "ADMIN" ? "opacity-60 cursor-not-allowed" : ""} ${user.status === "ACTIVE" ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200" : "bg-red-100 text-red-700 hover:bg-red-200"}`}
                        >
                            {user.status === "ACTIVE" ? "Hoạt động" : "Khóa"}
                        </button>)}
                    </td>

                    <td className="px-5 py-4 text-center text-gray-500 text-xs">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString("vi-VN") : "—"}
                    </td>
                    <td className="px-5 py-4">
                        <div className="flex justify-center gap-3">
                            {/* CHỈ HIỆN NÚT SỬA NẾU LÀ ADMIN HOẶC ĐANG LÀ TÀI KHOẢN CỦA CHÍNH MÌNH */}
                            {(currentUserRole === "ADMIN" || user.username === currentUsername) && (<button
                                onClick={() => handleOpenEdit(user)}
                                className="text-blue-600 hover:text-blue-800"
                                title="Sửa"
                            >
                                <Edit size={18}/>
                            </button>)}

                            {/* CHỈ ADMIN MỚI ĐƯỢC THẤY NÚT XÓA (VÀ KHÔNG ĐƯỢC TỰ XÓA ADMIN) */}
                            {(currentUserRole === "ADMIN" && user.role !== "ADMIN") && (<button
                                onClick={() => handleDelete(user.userId)}
                                className="text-red-500 hover:text-red-700"
                                title="Xóa"
                            >
                                <Trash2 size={18}/>
                            </button>)}
                        </div>
                    </td>
                </tr>)))}
                </tbody>
            </table>
        </div>

        {/* MODAL */}
        {showModal && (<div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden flex flex-col">
                <div className="flex justify-between items-center px-6 py-4 border-b bg-blue-50">
                    <h3 className="text-lg font-bold text-blue-800">
                        {editingUser ? "Sửa tài khoản" : "Thêm tài khoản"}
                    </h3>
                    <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-red-500">
                        <X size={22}/>
                    </button>
                </div>
                <div className="p-6 space-y-4">
                    {message.text && (<div
                        className={`px-4 py-3 rounded-xl text-sm font-medium border ${message.type === "success" ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"}`}
                    >
                        {message.text}
                    </div>)}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Họ và tên <span
                            className="text-red-500">*</span></label>
                        <input type="text" value={formData.fullName}
                               onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                               disabled={currentUserRole !== "ADMIN"}
                               className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500 text-sm disabled:bg-gray-100"
                               placeholder="Nhập họ và tên..."
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Username <span
                            className="text-red-500">*</span></label>
                        <input type="text" value={formData.username}
                               onChange={(e) => setFormData({...formData, username: e.target.value})}
                               disabled={!!editingUser}
                               autoComplete="off"
                               className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500 text-sm disabled:bg-gray-100"
                               placeholder="Nhập username..."
                        />
                    </div>

                    {/* XỬ LÝ GIAO DIỆN MẬT KHẨU/RESET */}
                    {!editingUser ? (<div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                Mật khẩu <span className="text-red-500">*</span>
                            </label>
                            <input type="password" value={formData.password}
                                   onChange={(e) => setFormData({...formData, password: e.target.value})}
                                   autoComplete="new-password" placeholder="Nhập mật khẩu..."
                                   className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500 text-sm"/>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                Xác nhận mật khẩu <span className="text-red-500">*</span>
                            </label>
                            <input type="password" value={formData.confirmPassword}
                                   onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                                   autoComplete="new-password" placeholder="Nhập lại mật khẩu..."
                                   className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500 text-sm"/>
                        </div>
                    </div>) : editingUser.username === currentUsername ? (
                        <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Mật khẩu cũ </label>
                                <input type="password" value={formData.oldPassword}
                                       onChange={(e) => setFormData({...formData, oldPassword: e.target.value})}
                                       autoComplete="new-password" placeholder="Nhập mật khẩu cũ..."
                                       className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500 text-sm"/>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Đổi mật khẩu
                                    mới</label>
                                <input type="password" value={formData.password}
                                       onChange={(e) => setFormData({...formData, password: e.target.value})}
                                       autoComplete="new-password" placeholder="Để trống nếu không đổi"
                                       className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500 text-sm"/>
                            </div>
                        </div>) : currentUserRole === "ADMIN" ? (<div
                        className="p-4 bg-orange-50 border border-orange-100 rounded-xl flex items-center justify-between col-span-1 md:col-span-2 mt-2">
                        <div>
                            <p className="text-sm font-bold text-orange-800">Khôi phục mật khẩu</p>
                            <p className="text-xs text-orange-600 mt-0.5">Mật khẩu sẽ bị đặt lại thành <b>123456</b>
                            </p>
                        </div>
                        <button type="button"
                                onClick={() => {
                                    setConfirmDialog({
                                        isOpen: true,
                                        title: "Khôi phục mật khẩu?",
                                        message: `Bạn có chắc muốn reset mật khẩu của ${editingUser.username} về 123456?`,
                                        onConfirm: async () => {
                                            try {
                                                const res = await fetch(`http://localhost:8080/api/users/${editingUser.userId}/reset-password`, {
                                                    method: "PUT", headers: {Authorization: `Bearer ${token}`}
                                                });
                                                if (res.ok) {
                                                    setMessage({type: "success", text: "Đã reset mật khẩu về 123456"});
                                                    setTimeout(() => setShowModal(false), 1000);
                                                } else {
                                                    setMessage({type: "error", text: "Lỗi khi reset mật khẩu!"});
                                                }
                                            } catch (err) {
                                                console.error(err);
                                            }
                                        }
                                    });
                                }}
                                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-lg transition-colors shadow-sm">
                            Reset ngay
                        </button>
                    </div>) : null}

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Role</label>
                            <select value={formData.role}
                                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                                    disabled={editingUser?.role === "ADMIN"}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500 text-sm bg-white disabled:bg-gray-100 disabled:text-gray-500"
                            >
                                <option value="" disabled hidden>-- Chọn phân quyền --</option>
                                <option value="ADMIN">ADMIN</option>
                                <option value="MANAGER">MANAGER (Quản lý)</option>
                                <option value="CASHIER">CASHIER (Thu ngân)</option>
                                <option value="WAITER">WAITER (Phục vụ bàn)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Trạng thái</label>
                            <select value={formData.status}
                                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                                    disabled={editingUser?.role === "ADMIN"}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500 text-sm bg-white disabled:bg-gray-100 disabled:text-gray-500"
                            >
                                <option value="" disabled hidden>-- Chọn trạng thái --</option>
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
        </div>)}
        {confirmDialog.isOpen && (
            <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-[60] p-4">
                <div className="bg-white rounded-xl w-full max-w-sm overflow-hidden p-6 text-center shadow-2xl">
                    <div className="text-4xl mb-3">{confirmDialog.title.includes("xóa") ? "🗑️" : "⚠️"}</div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">{confirmDialog.title}</h3>
                    <p className="text-sm text-gray-500 mb-6">{confirmDialog.message}</p>

                    <div className="flex justify-center gap-3">
                        <button
                            onClick={() => setConfirmDialog({isOpen: false, title: "", message: "", onConfirm: null})}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium text-sm"
                        >
                            Hủy bỏ
                        </button>
                        <button
                            onClick={() => {
                                confirmDialog.onConfirm();
                                setConfirmDialog({isOpen: false, title: "", message: "", onConfirm: null});
                            }}
                            className={`px-4 py-2 text-white rounded-lg font-medium text-sm ${confirmDialog.title.includes("xóa") ? "bg-red-600 hover:bg-red-700" : "bg-orange-600 hover:bg-orange-700"}`}
                        >
                            Xác nhận
                        </button>
                    </div>
                </div>
            </div>)}
    </div>);
}