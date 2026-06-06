import React from "react";
import {
    Menu, X, LayoutDashboard, List, Calendar, Home, Receipt, Utensils, BookOpen, Users, LogOut, Sparkles
} from "lucide-react";

export default function Sidebar({ setPage, currentPage }) {
    const [isOpen, setIsOpen] = React.useState(false);
    const [activePage, setActivePage] = React.useState(currentPage || "main_dashboard");
    const [confirmDialog, setConfirmDialog] = React.useState({ isOpen: false, title: "", message: "" });

    const role = sessionStorage.getItem("role") || "STAFF";

    const menuItems = [
        { id: "main_dashboard", label: "Quản lý bàn", icon: <Home size={18} />, allowedRoles: ["ADMIN", "MANAGER", "CASHIER"] },
        { id: "reservations", label: "Lịch đặt bàn", icon: <Calendar size={18} />, allowedRoles: ["ADMIN", "MANAGER", "CASHIER"] },
        { id: "invoice_history", label: "Lịch sử hóa đơn", icon: <Receipt size={18} />, allowedRoles: ["ADMIN", "MANAGER", "CASHIER"] },
        { id: "statistics", label: "Thống kê", icon: <LayoutDashboard size={18} />, allowedRoles: ["ADMIN", "MANAGER"] },
        { id: "categories", label: "Quản lý danh mục", icon: <List size={18} />, allowedRoles: ["ADMIN", "MANAGER"] },
        { id: "foods", label: "Quản lý món ăn", icon: <Utensils size={18} />, allowedRoles: ["ADMIN", "MANAGER"] },
        { id: "articles", label: "Bài viết", icon: <BookOpen size={18} />, allowedRoles: ["ADMIN", "MANAGER"] },
        { id: "users", label: "Quản lý tài khoản", icon: <Users size={18} />, allowedRoles: ["ADMIN", "MANAGER", "CASHIER"] }
    ];

    const handleNav = (id, allowedRoles) => {
        if (allowedRoles.includes(role)) {
            setPage(id);
            setActivePage(id);
            setIsOpen(false);
        } else {
            setConfirmDialog({
                isOpen: true,
                title: "Từ chối truy cập 🚫",
                message: "Bạn không có quyền truy cập chức năng này!",
                isAlert: true
            });
        }
    };

    return (
        <>
            {/* Tích hợp hiệu ứng Premium Glow & Custom Scrollbar */}
            <style>{`
                @keyframes goldShimmer {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                .active-premium-gold {
                    background: linear-gradient(90deg, rgba(196, 154, 108, 0.15) 0%, rgba(26, 19, 14, 0.05) 100%);
                    border-color: rgba(196, 154, 108, 0.4) !important;
                    box-shadow: inset 0 1px 4px rgba(196, 154, 108, 0.15), 0 4px 12px rgba(196, 154, 108, 0.05);
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(196, 154, 108, 0.15);
                    border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(196, 154, 108, 0.3);
                }
            `}</style>

            {/* Header cho Mobile */}
            <div className="md:hidden bg-[#1A130E] text-[#ECE7E0] p-4 flex justify-between items-center sticky top-0 z-50 border-b border-[#332A21]">
                <h2 className="font-serif font-bold tracking-widest text-[#C49A6C] text-lg uppercase">CELESTÉ</h2>
                <button onClick={() => setIsOpen(!isOpen)} className="p-2 bg-[#261C15] rounded-xl border border-[#332A21] text-[#B5A89A]">
                    {isOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
            </div>

            {/* Lớp nền mờ khi mở Sidebar trên Mobile */}
            {isOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-[99] md:hidden" onClick={() => setIsOpen(false)}></div>
            )}

            {/* Nội dung Sidebar Premium Đậm Đà Hơn */}
            <aside
                className={`
                    fixed md:static inset-y-0 left-0 z-[100]
                    w-68 bg-gradient-to-b from-[#160E0A] to-[#1F1510] text-[#B5A89A] transform transition-all duration-300 ease-in-out
                    ${isOpen ? "translate-x-0" : "-translate-x-full"} 
                    md:translate-x-0 md:flex md:flex-col min-h-screen border-r border-[#2C211A] shadow-2xl
                `}
            >
                {/* Brand Logo Vàng Gold Đồng Bộ Tuyệt Đối */}
                <div className="p-6 border-b border-[#2C211A] hidden md:block">
                    <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#C49A6C] to-[#9A7346] flex items-center justify-center shadow-lg shadow-[#C49A6C]/10">
                            <Utensils size={18} className="text-[#1A130E] font-black" />
                        </div>
                        <div>
                            <h2 className="font-serif font-bold text-lg tracking-widest text-[#ECE7E0] uppercase">CELESTÉ HOUSE</h2>
                            <p className="text-[9px] text-[#C49A6C] tracking-[0.2em] font-extrabold uppercase mt-0.5">Restaurant Management</p>
                        </div>
                    </div>
                </div>

                {/* Danh sách các mục điều hướng sắc nét */}
                <nav className="flex-1 mt-8 px-4 space-y-2 overflow-y-auto custom-scrollbar">
                    <div className="px-3 flex items-center gap-1.5 mb-3">
                        <Sparkles size={10} className="text-[#C49A6C]/70" />
                        <p className="text-[9px] font-black text-[#5C4D41] uppercase tracking-[0.2em]">Hệ thống quản lý</p>
                    </div>
                    
                    <ul>
                        {menuItems.map((item) => {
                            const isActive = activePage === item.id;
                            return (
                                <li key={item.id} className="mb-1.5">
                                    <button
                                        onClick={() => handleNav(item.id, item.allowedRoles)}
                                        className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl transition-all duration-300 relative group text-left overflow-hidden border
                                            ${isActive 
                                                ? "text-[#C49A6C] font-bold border-[#C49A6C]/40 active-premium-gold" 
                                                : "bg-transparent hover:bg-[#261D17] text-[#918173] hover:text-[#ECE7E0] border-transparent hover:border-[#332A21]"
                                            }`}
                                    >
                                        {/* Vạch chỉ trang màu mật ong sắc nét */}
                                        {isActive && (
                                            <span className="absolute left-0 top-1/4 bottom-1/4 w-0.5 rounded-r-full bg-[#C49A6C] shadow-sm shadow-[#C49A6C]"></span>
                                        )}

                                        <span className={`transition-transform duration-300 group-hover:scale-110 ${isActive ? "text-[#C49A6C]" : "text-[#5C4D41] group-hover:text-[#918173]"}`}>
                                            {item.icon}
                                        </span>
                                        <span className="text-sm tracking-wide font-medium">{item.label}</span>
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {/* Phần chân tài khoản hệ thống */}
                <div className="p-4 border-t border-[#2C211A] bg-[#110A07]">
                    <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[#1A130E] border border-[#2C211A]">
                        <div className="w-9 h-9 rounded-lg bg-[#C49A6C] flex items-center justify-center font-bold text-[#1A130E] text-sm shadow-md">
                            {(sessionStorage.getItem("fullName") || "A")[0].toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <span className="block font-semibold text-sm text-[#ECE7E0] truncate">
                                {sessionStorage.getItem("fullName") || "Quản trị viên"}
                            </span>
                            <span className="inline-flex px-2 py-0.5 rounded text-[9px] font-bold bg-[#C49A6C]/10 text-[#C49A6C] border border-[#C49A6C]/20 uppercase tracking-wider mt-0.5">
                                {role}
                            </span>
                        </div>
                    </div>
                    
                    <button
                        onClick={() => {
                            sessionStorage.removeItem("token");
                            sessionStorage.removeItem("role");
                            sessionStorage.removeItem("fullName");
                            window.location.href = "/login";
                        }}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-rose-500/5 hover:bg-rose-500/10 border border-rose-500/10 hover:border-rose-500/20 text-rose-400 transition-all duration-300 group text-xs font-bold uppercase tracking-wider mt-2"
                    >
                        <LogOut size={13} />
                        <span>Đăng xuất hệ thống</span>
                    </button>
                </div>
            </aside>

            {/* Dialog thông báo lỗi quyền truy cập quyền lực */}
            {confirmDialog.isOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex justify-center items-center z-[100] p-4">
                    <div className="bg-[#1A130E] border border-[#2C211A] rounded-2xl w-full max-w-sm overflow-hidden p-8 text-center shadow-2xl">
                        <div className="w-14 h-14 bg-rose-500/10 border border-rose-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-rose-400">
                            <span className="text-xl block">🚫</span>
                        </div>
                        <h3 className="text-lg font-bold text-[#ECE7E0] mb-1.5">{confirmDialog.title}</h3>
                        <p className="text-xs text-[#918173] mb-6 leading-relaxed">{confirmDialog.message}</p>
                        <button
                            onClick={() => setConfirmDialog({ isOpen: false, title: "", message: "" })}
                            className="w-full py-3 bg-gradient-to-r from-[#C49A6C] to-[#9A7346] text-[#1A130E] font-bold rounded-xl text-xs tracking-wider uppercase shadow-lg transition-all active:scale-95"
                        >
                            Xác nhận thông tin
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}