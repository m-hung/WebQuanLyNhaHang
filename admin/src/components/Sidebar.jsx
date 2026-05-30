import React from "react";
import {
    Menu, X, LayoutDashboard, List, Calendar, Home, Receipt, Utensils, BookOpen, Users, LogOut
} from "lucide-react";

export default function Sidebar({setPage, currentPage}) {
    const [isOpen, setIsOpen] = React.useState(false);
    const [activePage, setActivePage] = React.useState(currentPage || "main_dashboard");
    const [confirmDialog, setConfirmDialog] = React.useState({isOpen: false, title: "", message: ""});

    // Lấy role từ sessionStorage (Mặc định là STAFF nếu chưa có)
    const role = sessionStorage.getItem("role") || "STAFF";

    // 1. Cấu hình mảng menu cố định và chỉ định các Role được phép truy cập cho từng chức năng
    const menuItems = [{
        id: "main_dashboard",
        label: "Quản lý bàn",
        icon: <Home size={20}/>,
        allowedRoles: ["ADMIN", "MANAGER", "CASHIER", "WAITER"]
    }, {
        id: "reservations",
        label: "Lịch đặt bàn",
        icon: <Calendar size={20}/>,
        allowedRoles: ["ADMIN", "MANAGER", "CASHIER", "WAITER"]
    }, {
        id: "invoice_history",
        label: "Lịch sử hóa đơn",
        icon: <Receipt size={20}/>,
        allowedRoles: ["ADMIN", "MANAGER", "CASHIER"]
    }, {
        id: "statistics",
        label: "Thống kê",
        icon: <LayoutDashboard size={20}/>,
        allowedRoles: ["ADMIN", "MANAGER"]
    }, {
        id: "categories",
        label: "Quản lý danh mục",
        icon: <List size={20}/>,
        allowedRoles: ["ADMIN", "MANAGER"]
    }, {
        id: "foods",
        label: "Quản lý món ăn",
        icon: <Utensils size={20}/>,
        allowedRoles: ["ADMIN", "MANAGER"]
    }, {
        id: "articles",
        label: "Bài viết",
        icon: <BookOpen size={20}/>,
        allowedRoles: ["ADMIN", "MANAGER"]
    }, {
        id: "users",
        label: "Quản lý tài khoản",
        icon: <Users size={20}/>,
        allowedRoles: ["ADMIN", "MANAGER", "CASHIER", "WAITER"] // ĐÃ THÊM QUYỀN
    }
    ];

    // 2. Hàm xử lý khi bấm vào Menu
    const handleNav = (id, allowedRoles) => {
        // Kiểm tra xem role của user hiện tại có nằm trong danh sách cho phép không
        if (allowedRoles.includes(role)) {
            setPage(id);
            setActivePage(id);
            setIsOpen(false);
        } else {
            // Báo lỗi nếu không có quyền
            setConfirmDialog({
                isOpen: true,
                title: "Từ chối truy cập 🚫",
                message: "Bạn không có quyền truy cập chức năng này!",
                isAlert: true
            });
        }
    };

    return (<>
        {/* Header cho Mobile */}
        <div className="md:hidden bg-gray-800 text-white p-4 flex justify-between items-center sticky top-0 z-50">
            <h2 className="font-bold text-lg">Admin Panel</h2>
            <button onClick={() => setIsOpen(!isOpen)} className="p-1">
                {isOpen ? <X size={24}/> : <Menu size={24}/>}
            </button>
        </div>

        {/* Lớp nền mờ khi mở Sidebar trên Mobile */}
        {isOpen && (<div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setIsOpen(false)}
        ></div>)}

        {/* Nội dung Sidebar chính */}
        <aside
            className={`
        fixed md:static inset-y-0 left-0 z-50
        w-64 bg-gray-800 text-white transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0 md:flex md:flex-col min-h-screen shadow-xl
      `}
        >
            <div className="p-6 text-2xl font-bold border-b border-gray-700 hidden md:block">
                Admin
            </div>

            {/* Danh sách các mục điều hướng */}
            <nav className="flex-1 mt-4 px-3">
                <ul className="space-y-1">
                    {menuItems.map((item) => (<li key={item.id}>
                        <button
                            onClick={() => handleNav(item.id, item.allowedRoles)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group text-left
                    ${activePage === item.id ? "bg-blue-600 text-white shadow-lg shadow-blue-900/30" : "hover:bg-gray-700 text-gray-300 hover:text-white"}`}
                        >
                  <span
                      className={`transition-colors duration-200 ${activePage === item.id ? "text-white" : "text-gray-400 group-hover:text-white"}`}>
                    {item.icon}
                  </span>
                            <span className="font-medium">{item.label}</span>
                            {activePage === item.id && (
                                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white opacity-80"></span>)}
                        </button>
                    </li>))}
                </ul>
            </nav>

            {/* Phần chân Sidebar */}
            <div className="p-4 border-t border-gray-700">
                <div className="text-sm text-gray-400 mb-3">
                <span className="block font-medium text-gray-300 uppercase">
                    {sessionStorage.getItem("fullName") || "Admin"}
                </span>
                    <span className="text-xs font-semibold text-blue-400">{role}</span>
                </div>
                <button
                    onClick={() => {
                        sessionStorage.removeItem("token");
                        sessionStorage.removeItem("role");
                        sessionStorage.removeItem("fullName");
                        window.location.href = "/login";
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-all duration-200"
                >
                    <LogOut size={18}/>
                    <span className="font-medium text-sm">Đăng xuất</span>
                </button>
            </div>
        </aside>
        {confirmDialog.isOpen && (
            <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-[70] p-4">
                <div className="bg-white rounded-xl w-full max-w-sm overflow-hidden p-6 text-center shadow-2xl">
                    <div className="text-4xl mb-3">🚫</div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">{confirmDialog.title}</h3>
                    <p className="text-sm text-gray-500 mb-6">{confirmDialog.message}</p>

                    <div className="flex justify-center">
                        <button
                            onClick={() => setConfirmDialog({isOpen: false, title: "", message: ""})}
                            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition-colors"
                        >
                            Đã hiểu
                        </button>
                    </div>
                </div>
            </div>)}
    </>);
}