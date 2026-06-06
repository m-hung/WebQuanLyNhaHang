import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, X, Users, Shield, UserCheck, UserX, Crown, ChevronRight, ChevronDown } from "lucide-react";
 
// ─── STYLE INJECTION ────────────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Jost:wght@300;400;500;600&display=swap');
 
  .um-root {
    --cream: #F5F0E8;
    --cream-dark: #EDE5D4;
    --cream-border: #DDD3BC;
    --gold: #B8955A;
    --gold-light: #D4AF72;
    --gold-pale: #F0E6D0;
    --dark: #2A2118;
    --muted: #7A6E5F;
    --success: #4A7C59;
    --danger: #8B3A3A;
    --danger-bg: #F5ECEC;
    --text: #3D3022;
    font-family: 'Jost', sans-serif;
  }
 
  .um-root * { box-sizing: border-box; }
 
  /* ── PAGE ── */
  .um-page {
    background: var(--cream);
    min-height: 100vh;
    padding: clamp(1rem, 3vw, 2rem) clamp(1rem, 3vw, 2.5rem);
  }
 
  /* ── HEADER ── */
  .um-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    flex-wrap: wrap;
    gap: 1rem;
    margin-bottom: 2.5rem;
    padding-bottom: 1.5rem;
    border-bottom: 1px solid var(--cream-border);
  }
  .um-header-left { display: flex; flex-direction: column; gap: 0.25rem; }
  .um-eyebrow {
    font-family: 'Jost', sans-serif;
    font-size: 0.65rem;
    font-weight: 500;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--gold);
    display: flex;
    align-items: center;
    gap: 0.4rem;
  }
  .um-eyebrow::before { content: '✦'; font-size: 0.5rem; }
  .um-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(2rem, 5vw, 2.8rem);
    font-weight: 400;
    color: var(--dark);
    line-height: 1;
    letter-spacing: -0.01em;
  }
  .um-subtitle {
    font-size: 0.8rem;
    color: var(--muted);
    letter-spacing: 0.05em;
    margin-top: 0.25rem;
  }
 
  .um-add-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: var(--dark);
    color: var(--gold-light);
    border: none;
    padding: 0.75rem 1.5rem;
    font-family: 'Jost', sans-serif;
    font-size: 0.78rem;
    font-weight: 500;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.25s;
    clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px));
  }
  .um-add-btn:hover { background: var(--gold); color: var(--dark); }
 
  /* ── STATS STRIP ── */
  .um-stats {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1px;
    background: var(--cream-border);
    margin-bottom: 2rem;
    border: 1px solid var(--cream-border);
  }
  @media(min-width: 640px) {
    .um-stats { grid-template-columns: repeat(3, 1fr); }
  }
  @media(min-width: 900px) {
    .um-stats { grid-template-columns: repeat(5, 1fr); }
  }
  .um-stat {
    flex: 1;
    background: var(--cream);
    padding: 1rem 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }
  .um-stat-icon {
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--gold-pale);
    color: var(--gold);
  }
  .um-stat-num {
    font-family: 'Jost', sans-serif;
    font-size: 1.6rem;
    font-weight: 300;
    color: var(--dark);
    line-height: 1;
    letter-spacing: 0.04em;
  }
  .um-stat-label {
    font-size: 0.7rem;
    font-weight: 500;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--muted);
  }
 
  /* ── TABLE WRAPPER ── */
  .um-table-wrap {
    background: white;
    border: 1px solid var(--cream-border);
    overflow: hidden;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
  .um-table { width: 100%; min-width: 560px; border-collapse: collapse; font-size: 0.85rem; }
  .um-table thead { background: var(--cream-dark); }
  .um-table thead th {
    padding: 1rem 1.25rem;
    text-align: left;
    font-size: 0.65rem;
    font-weight: 600;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--muted);
    border-bottom: 1px solid var(--cream-border);
  }
  .um-table thead th.center { text-align: center; }
  .um-table tbody tr {
    border-bottom: 1px solid #F5F0E8;
    transition: background 0.15s;
  }
  .um-table tbody tr:last-child { border-bottom: none; }
  .um-table tbody tr:hover { background: #FDFAF5; }
  .um-table tbody tr.inactive { opacity: 0.5; }
  .um-table td { padding: 1.1rem 1.25rem; color: var(--text); }
  .um-table td.center { text-align: center; }
 
  /* ── AVATAR ── */
  .um-avatar-cell { display: flex; align-items: center; gap: 0.875rem; }
  .um-avatar {
    width: 40px;
    height: 40px;
    background: var(--gold-pale);
    border: 1px solid var(--cream-border);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--gold);
    flex-shrink: 0;
    clip-path: polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px));
  }
  .um-avatar.admin { background: var(--dark); color: var(--gold-light); }
  .um-fullname { font-weight: 500; color: var(--dark); font-size: 0.88rem; }
  .um-username-sub { font-size: 0.72rem; color: var(--muted); margin-top: 0.1rem; letter-spacing: 0.03em; }
 
  /* ── ROLE BADGE ── */
  .um-role {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    padding: 0.3rem 0.75rem;
    font-size: 0.65rem;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }
  .um-role.admin { background: var(--dark); color: var(--gold-light); }
  .um-role.manager { background: var(--gold-pale); color: var(--gold); border: 1px solid #DDD3BC; }
  .um-role.other { background: #EEF2EE; color: #4A6B50; border: 1px solid #C8D8CA; }
 
  /* ── STATUS ── */
  .um-status-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    padding: 0.3rem 0.875rem;
    font-size: 0.7rem;
    font-weight: 500;
    letter-spacing: 0.06em;
    border: none;
    cursor: pointer;
    transition: all 0.2s;
    font-family: 'Jost', sans-serif;
  }
  .um-status-btn.active {
    background: #ECFAF2;
    color: var(--success);
    border: 1px solid #C2E0CC;
  }
  .um-status-btn.active:hover { background: #D4F0E0; }
  .um-status-btn.inactive {
    background: var(--danger-bg);
    color: var(--danger);
    border: 1px solid #E8CCCC;
  }
  .um-status-btn.inactive:hover { background: #F0DADA; }
  .um-status-btn:disabled { cursor: default; opacity: 0.8; }
  .um-status-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
  }
  .active .um-status-dot { background: var(--success); }
  .inactive .um-status-dot { background: var(--danger); }
 
  /* ── DATE ── */
  .um-date { font-size: 0.75rem; color: var(--muted); }
 
  /* ── ACTIONS ── */
  .um-actions { display: flex; justify-content: center; gap: 0.5rem; }
  .um-action-btn {
    width: 32px; height: 32px;
    display: flex; align-items: center; justify-content: center;
    border: 1px solid var(--cream-border);
    background: var(--cream);
    cursor: pointer;
    transition: all 0.2s;
    color: var(--muted);
  }
  .um-action-btn:hover.edit { background: var(--gold-pale); border-color: var(--gold); color: var(--gold); }
  .um-action-btn:hover.del { background: var(--danger-bg); border-color: #E8CCCC; color: var(--danger); }
 
  /* ── EMPTY / LOADING ── */
  .um-empty {
    text-align: center;
    padding: 4rem 2rem;
    color: var(--muted);
    font-size: 0.85rem;
    letter-spacing: 0.05em;
  }
  .um-empty-icon {
    font-family: 'Cormorant Garamond', serif;
    font-size: 3rem;
    color: var(--cream-border);
    display: block;
    margin-bottom: 0.75rem;
  }
 
  /* ── MODAL OVERLAY ── */
  .um-overlay {
    position: fixed; inset: 0;
    background: rgba(30, 20, 10, 0.55);
    display: flex; align-items: center; justify-content: center;
    z-index: 50;
    padding: 1rem;
    backdrop-filter: blur(2px);
  }
 
  /* ── MODAL ── */
  .um-modal {
    background: white;
    width: 100%;
    max-width: 480px;
    border: 1px solid var(--cream-border);
    display: flex;
    flex-direction: column;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 25px 80px rgba(0,0,0,0.25);
    animation: modalIn 0.25s ease;
  }
  @keyframes modalIn {
    from { opacity: 0; transform: translateY(16px) scale(0.98); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }
 
  .um-modal-head {
    padding: 1.5rem;
    background: var(--cream-dark);
    border-bottom: 1px solid var(--cream-border);
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    flex-shrink: 0;
  }
  .um-modal-title-eyebrow {
    font-size: 0.6rem;
    font-weight: 600;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 0.2rem;
  }
  .um-modal-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.6rem;
    font-weight: 400;
    color: var(--dark);
    line-height: 1;
  }
  .um-modal-close {
    width: 32px; height: 32px;
    display: flex; align-items: center; justify-content: center;
    background: none; border: 1px solid var(--cream-border);
    cursor: pointer; color: var(--muted);
    transition: all 0.2s; flex-shrink: 0;
  }
  .um-modal-close:hover { background: var(--danger-bg); border-color: #E8CCCC; color: var(--danger); }
 
  .um-modal-body { padding: 1.5rem; display: flex; flex-direction: column; gap: 1.1rem; }
 
  /* ── ALERT ── */
  .um-alert {
    padding: 0.75rem 1rem;
    font-size: 0.8rem;
    font-weight: 500;
    letter-spacing: 0.03em;
    border-left: 3px solid;
  }
  .um-alert.success { background: #F0FAF4; color: var(--success); border-color: var(--success); }
  .um-alert.error   { background: var(--danger-bg); color: var(--danger); border-color: var(--danger); }
 
  /* ── FORM FIELD ── */
  .um-field label {
    display: block;
    font-size: 0.68rem;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 0.45rem;
  }
  .um-field label span { color: var(--danger); }
  .um-input, .um-select {
    width: 100%;
    border: 1px solid var(--cream-border);
    background: var(--cream);
    padding: 0.65rem 2.2rem 0.65rem 0.875rem;
    font-family: 'Jost', sans-serif;
    font-size: 0.85rem;
    color: var(--dark);
    outline: none;
    transition: border-color 0.2s, background 0.2s;
    appearance: none;
    -webkit-appearance: none;
  }
  .um-select-wrap {
    position: relative;
    display: block;
  }
  .um-select-wrap .um-select {
    width: 100%;
  }
  .um-select-arrow {
    position: absolute;
    right: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
    color: var(--gold);
    display: flex;
    align-items: center;
  }
  .um-input:focus, .um-select:focus { border-color: var(--gold); background: white; }
  .um-input:disabled, .um-select:disabled { opacity: 0.6; cursor: not-allowed; background: #F5F0E8; }
  .um-input::placeholder { color: var(--cream-border); }
  .um-field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 0.875rem; }
 
  /* ── RESPONSIVE ── */
  @media(max-width: 540px) {
    .um-field-row { grid-template-columns: 1fr; }
    .um-modal { max-height: 95vh; }
    .um-confirm { padding: 1.5rem 1.25rem; }
    .um-confirm-btns { flex-direction: column; align-items: stretch; }
    .um-confirm-cancel, .um-confirm-ok { text-align: center; padding: 0.7rem; }
    .um-modal-foot { flex-direction: column-reverse; }
    .um-modal-foot button { width: 100%; text-align: center; justify-content: center; }
    .um-reset-panel { flex-direction: column; align-items: flex-start; gap: 0.75rem; }
    .um-reset-btn { width: 100%; text-align: center; }
  }
 
  @media(max-width: 640px) {
    .um-overlay { align-items: flex-end; padding: 0; }
    .um-modal {
      border-radius: 0;
      border-top-left-radius: 16px;
      border-top-right-radius: 16px;
      max-height: 95vh;
      animation: slideUp 0.3s ease;
    }
    @keyframes slideUp {
      from { transform: translateY(100%); opacity: 0; }
      to   { transform: translateY(0);    opacity: 1; }
    }
  }
 
  /* ── RESET PANEL ── */
  .um-reset-panel {
    background: #FDF8F0;
    border: 1px solid #E8D9B8;
    padding: 1rem 1.25rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }
  .um-reset-label { font-size: 0.78rem; font-weight: 600; color: var(--gold); margin-bottom: 0.15rem; }
  .um-reset-sub { font-size: 0.72rem; color: var(--muted); }
  .um-reset-btn {
    background: var(--gold);
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    font-family: 'Jost', sans-serif;
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    cursor: pointer;
    white-space: nowrap;
    transition: background 0.2s;
  }
  .um-reset-btn:hover { background: var(--gold-light); }
 
  /* ── MODAL FOOTER ── */
  .um-modal-foot {
    padding: 1rem 1.5rem;
    background: var(--cream);
    border-top: 1px solid var(--cream-border);
    display: flex;
    justify-content: flex-end;
    gap: 0.75rem;
    flex-shrink: 0;
  }
  .um-btn-cancel {
    padding: 0.65rem 1.25rem;
    border: 1px solid var(--cream-border);
    background: white;
    color: var(--muted);
    font-family: 'Jost', sans-serif;
    font-size: 0.78rem;
    font-weight: 500;
    letter-spacing: 0.06em;
    cursor: pointer;
    transition: all 0.2s;
  }
  .um-btn-cancel:hover { background: var(--cream-dark); }
  .um-btn-save {
    padding: 0.65rem 1.5rem;
    background: var(--dark);
    color: var(--gold-light);
    border: none;
    font-family: 'Jost', sans-serif;
    font-size: 0.78rem;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.2s;
    clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px));
  }
  .um-btn-save:hover { background: var(--gold); color: var(--dark); }
  .um-btn-save:disabled { opacity: 0.5; cursor: not-allowed; }
 
  /* ── CONFIRM DIALOG ── */
  .um-confirm {
    background: white;
    width: 100%;
    max-width: 380px;
    border: 1px solid var(--cream-border);
    padding: 2rem;
    text-align: center;
    box-shadow: 0 25px 80px rgba(0,0,0,0.25);
    animation: modalIn 0.2s ease;
  }
  .um-confirm-icon { font-size: 2.5rem; display: block; margin-bottom: 0.75rem; }
  .um-confirm-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.5rem;
    font-weight: 400;
    color: var(--dark);
    margin-bottom: 0.5rem;
  }
  .um-confirm-msg { font-size: 0.82rem; color: var(--muted); margin-bottom: 1.5rem; line-height: 1.6; }
  .um-confirm-btns { display: flex; justify-content: center; gap: 0.75rem; }
  .um-confirm-cancel {
    padding: 0.6rem 1.25rem;
    border: 1px solid var(--cream-border);
    background: white;
    color: var(--muted);
    font-family: 'Jost', sans-serif;
    font-size: 0.78rem;
    cursor: pointer;
    transition: background 0.2s;
  }
  .um-confirm-cancel:hover { background: var(--cream); }
  .um-confirm-ok {
    padding: 0.6rem 1.25rem;
    border: none;
    color: white;
    font-family: 'Jost', sans-serif;
    font-size: 0.78rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    cursor: pointer;
    transition: opacity 0.2s;
  }
  .um-confirm-ok.danger { background: var(--danger); }
  .um-confirm-ok.warn   { background: var(--gold); }
  .um-confirm-ok:hover  { opacity: 0.85; }
`;
 
// ─── HELPERS ────────────────────────────────────────────────────────────────
function getInitials(name) {
    if (!name) return "?";
    return name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
}
function roleLabel(role) {
    return { ADMIN: "Admin", MANAGER: "Manager", CASHIER: "Cashier", STAFF: "Staff" }[role] || role;
}
function roleClass(role) {
    return { ADMIN: "admin", MANAGER: "manager" }[role] || "other";
}
 
// ─── COMPONENT ──────────────────────────────────────────────────────────────
export default function UserManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({
        username: "", password: "", confirmPassword: "", oldPassword: "",
        fullName: "", role: "", status: "ACTIVE"
    });
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });
    const [confirmDialog, setConfirmDialog] = useState({
        isOpen: false, title: "", message: "", onConfirm: null
    });
 
    const currentUserRole = sessionStorage.getItem("role") || "STAFF";
    const currentUsername = sessionStorage.getItem("username") || "";
    const token = sessionStorage.getItem("token");
 
    // ── BACKEND (unchanged) ──────────────────────────────────────────────────
    const fetchUsers = async () => {
        try {
            setLoading(true);
            const res = await fetch("http://localhost:8080/api/users", {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            setUsers(data);
        } catch (err) { console.error("Lỗi lấy users:", err); }
        finally { setLoading(false); }
    };
 
    useEffect(() => { fetchUsers(); }, []);
 
    const handleOpenAdd = () => {
        setMessage({ type: "", text: "" });
        setEditingUser(null);
        setFormData({ username: "", password: "", confirmPassword: "", oldPassword: "", fullName: "", role: "", status: "" });
        setShowModal(true);
    };
 
    const handleOpenEdit = (user) => {
        setMessage({ type: "", text: "" });
        setEditingUser(user);
        setFormData({ username: user.username, password: "", oldPassword: "", fullName: user.fullName || "", role: user.role, status: user.status });
        setShowModal(true);
    };
 
    const handleSubmit = async () => {
        if (!formData.username || (!editingUser && !formData.password) || !formData.fullName) {
            setMessage({ type: "error", text: "Vui lòng nhập đầy đủ thông tin!" }); return;
        }
        if (!editingUser && formData.password !== formData.confirmPassword) {
            setMessage({ type: "error", text: "Mật khẩu xác nhận không khớp!" }); return;
        }
        if (!formData.role) { setMessage({ type: "error", text: "Vui lòng chọn phân quyền!" }); return; }
        if (!formData.status) { setMessage({ type: "error", text: "Vui lòng chọn trạng thái!" }); return; }
 
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
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify(body)
            });
 
            if (res.ok) {
                fetchUsers();
                setMessage({ type: "success", text: editingUser ? "Cập nhật tài khoản thành công!" : "Thêm tài khoản thành công!" });
                setTimeout(() => setShowModal(false), 1000);
            } else {
                const errorMsg = await res.text();
                setMessage({ type: "error", text: errorMsg || "Lưu thất bại!" });
            }
        } catch (err) { console.error("Lỗi:", err); }
        finally { setSubmitting(false); }
    };
 
    const handleDelete = (userId) => {
        setConfirmDialog({
            isOpen: true, title: "Xác nhận xóa?",
            message: "Bạn có chắc chắn muốn xóa tài khoản này không?",
            onConfirm: async () => {
                try {
                    await fetch(`http://localhost:8080/api/users/${userId}`, {
                        method: "DELETE", headers: { Authorization: `Bearer ${token}` }
                    });
                    fetchUsers();
                } catch (err) { console.error("Lỗi xóa:", err); }
            }
        });
    };
 
    const handleToggleStatus = async (user) => {
        if (user.role === "ADMIN") return;
        const newStatus = user.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
        setConfirmDialog({
            isOpen: true,
            title: newStatus === "INACTIVE" ? "Khóa tài khoản?" : "Mở khóa tài khoản?",
            message: newStatus === "INACTIVE"
                ? `Bạn có chắc muốn khóa tài khoản "${user.username}" không?`
                : `Bạn có chắc muốn mở khóa tài khoản "${user.username}" không?`,
            onConfirm: async () => {
                try {
                    await fetch(`http://localhost:8080/api/users/${user.userId}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                        body: JSON.stringify({ ...user, password: undefined, status: newStatus })
                    });
                    fetchUsers();
                    setMessage({ type: "success", text: newStatus === "INACTIVE" ? "Đã khóa tài khoản thành công!" : "Đã mở khóa tài khoản thành công!" });
                } catch (err) {
                    console.error("Lỗi:", err);
                    setMessage({ type: "error", text: "Có lỗi xảy ra khi cập nhật trạng thái!" });
                }
            }
        });
    };
    // ── END BACKEND ──────────────────────────────────────────────────────────
 
    // computed stats
    const visibleUsers = currentUserRole === "ADMIN" ? users
        : currentUserRole === "MANAGER" ? users.filter(u => u.role !== "ADMIN")
        : users.filter(u => u.username === currentUsername);
 
    const sortedUsers = [...visibleUsers].sort((a, b) => {
        if (a.username === currentUsername) return -1;
        if (b.username === currentUsername) return 1;
        return 0;
    });
 
    const totalActive = visibleUsers.filter(u => u.status === "ACTIVE").length;
    const totalInactive = visibleUsers.filter(u => u.status === "INACTIVE").length;
 
    // ── RENDER ──────────────────────────────────────────────────────────────
    return (
        <div className="um-root">
            <style>{styles}</style>
            <div className="um-page">
 
                {/* HEADER */}
                <div className="um-header">
                    <div className="um-header-left">
                        <span className="um-eyebrow">Hệ thống quản lý · Celeste House</span>
                        <h1 className="um-title">Quản lý tài khoản</h1>
                        <p className="um-subtitle">Phân quyền và điều hành nhân sự hệ thống</p>
                    </div>
                    {currentUserRole === "ADMIN" && (
                        <button className="um-add-btn" onClick={handleOpenAdd}>
                            <Plus size={14} /> Thêm tài khoản
                        </button>
                    )}
                </div>
 
                {/* STATS */}
                <div className="um-stats">
                    <div className="um-stat">
                        <div className="um-stat-icon"><Users size={16} /></div>
                        <div>
                            <div className="um-stat-num">{visibleUsers.length}</div>
                            <div className="um-stat-label">Tổng tài khoản</div>
                        </div>
                    </div>
                    <div className="um-stat">
                        <div className="um-stat-icon" style={{ background: "#ECFAF2", color: "#4A7C59" }}><UserCheck size={16} /></div>
                        <div>
                            <div className="um-stat-num">{totalActive}</div>
                            <div className="um-stat-label">Đang hoạt động</div>
                        </div>
                    </div>
                    <div className="um-stat">
                        <div className="um-stat-icon" style={{ background: "#F5ECEC", color: "#8B3A3A" }}><UserX size={16} /></div>
                        <div>
                            <div className="um-stat-num">{totalInactive}</div>
                            <div className="um-stat-label">Đã khóa</div>
                        </div>
                    </div>
                    <div className="um-stat">
                        <div className="um-stat-icon"><Shield size={16} /></div>
                        <div>
                            <div className="um-stat-num">{visibleUsers.filter(u => u.role === "MANAGER").length}</div>
                            <div className="um-stat-label">Quản lý</div>
                        </div>
                    </div>
                    <div className="um-stat">
                        <div className="um-stat-icon" style={{ background: "#EEF2EE", color: "#4A6B50" }}><UserCheck size={16} /></div>
                        <div>
                            <div className="um-stat-num">{visibleUsers.filter(u => u.role === "CASHIER").length}</div>
                            <div className="um-stat-label">Thu ngân</div>
                        </div>
                    </div>
                </div>
 
                {/* TABLE */}
                <div className="um-table-wrap">
                    <table className="um-table">
                        <thead>
                            <tr>
                                <th>Nhân viên</th>
                                <th>Username</th>
                                <th className="center">Phân quyền</th>
                                <th className="center">Trạng thái</th>
                                <th className="center">Ngày tạo</th>
                                <th className="center">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="6"><div className="um-empty"><span className="um-empty-icon">✦</span>Đang tải dữ liệu...</div></td></tr>
                            ) : sortedUsers.length === 0 ? (
                                <tr><td colSpan="6"><div className="um-empty"><span className="um-empty-icon">✦</span>Không có dữ liệu</div></td></tr>
                            ) : sortedUsers.map(user => (
                                <tr key={user.userId} className={user.status === "INACTIVE" ? "inactive" : ""}>
                                    <td>
                                        <div className="um-avatar-cell">
                                            <div className={`um-avatar ${user.role === "ADMIN" ? "admin" : ""}`}>
                                                {user.role === "ADMIN" ? <Crown size={14} /> : getInitials(user.fullName)}
                                            </div>
                                            <div>
                                                <div className="um-fullname">{user.fullName || "—"}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span style={{ fontSize: "0.82rem", color: "var(--muted)", fontFamily: "monospace", letterSpacing: "0.04em" }}>
                                            {user.username}
                                        </span>
                                    </td>
                                    <td className="center">
                                        <span className={`um-role ${roleClass(user.role)}`}>
                                            {roleLabel(user.role)}
                                        </span>
                                    </td>
                                    <td className="center">
                                        {user.role === "ADMIN" ? (
                                            <span className="um-status-btn active" style={{ cursor: "default" }}>
                                                <span className="um-status-dot" />
                                                Hoạt động
                                            </span>
                                        ) : (
                                            <button
                                                className={`um-status-btn ${user.status === "ACTIVE" ? "active" : "inactive"}`}
                                                onClick={() => handleToggleStatus(user)}
                                                disabled={currentUserRole !== "ADMIN"}
                                            >
                                                <span className="um-status-dot" />
                                                {user.status === "ACTIVE" ? "Hoạt động" : "Đã khóa"}
                                            </button>
                                        )}
                                    </td>
                                    <td className="center">
                                        <span className="um-date">
                                            {user.createdAt ? new Date(user.createdAt).toLocaleDateString("vi-VN") : "—"}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="um-actions">
                                            {(currentUserRole === "ADMIN" || user.username === currentUsername) && (
                                                <button className="um-action-btn edit" onClick={() => handleOpenEdit(user)} title="Chỉnh sửa">
                                                    <Edit size={14} />
                                                </button>
                                            )}
                                            {currentUserRole === "ADMIN" && user.role !== "ADMIN" && (
                                                <button className="um-action-btn del" onClick={() => handleDelete(user.userId)} title="Xóa">
                                                    <Trash2 size={14} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
 
                {/* ── MODAL ── */}
                {showModal && (
                    <div className="um-overlay">
                        <div className="um-modal">
                            <div className="um-modal-head">
                                <div>
                                    <div className="um-modal-title-eyebrow">✦ Celeste House · Hệ thống</div>
                                    <div className="um-modal-title">
                                        {editingUser ? "Chỉnh sửa tài khoản" : "Thêm tài khoản mới"}
                                    </div>
                                </div>
                                <button className="um-modal-close" onClick={() => setShowModal(false)}><X size={16} /></button>
                            </div>
 
                            <div className="um-modal-body">
                                {message.text && (
                                    <div className={`um-alert ${message.type}`}>{message.text}</div>
                                )}
 
                                {/* Họ tên */}
                                <div className="um-field">
                                    <label>Họ và tên <span>*</span></label>
                                    <input type="text" className="um-input" value={formData.fullName}
                                        onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                                        disabled={currentUserRole !== "ADMIN"}
                                        placeholder="Nhập họ và tên..." />
                                </div>
 
                                {/* Username */}
                                <div className="um-field">
                                    <label>Username <span>*</span></label>
                                    <input type="text" className="um-input" value={formData.username}
                                        onChange={e => setFormData({ ...formData, username: e.target.value })}
                                        disabled={!!editingUser}
                                        autoComplete="off"
                                        placeholder="Nhập username..." />
                                </div>
 
                                {/* Password blocks (unchanged logic) */}
                                {!editingUser ? (
                                    <div className="um-field-row">
                                        <div className="um-field">
                                            <label>Mật khẩu <span>*</span></label>
                                            <input type="password" className="um-input" value={formData.password}
                                                onChange={e => setFormData({ ...formData, password: e.target.value })}
                                                autoComplete="new-password" placeholder="Nhập mật khẩu..." />
                                        </div>
                                        <div className="um-field">
                                            <label>Xác nhận mật khẩu <span>*</span></label>
                                            <input type="password" className="um-input" value={formData.confirmPassword}
                                                onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                                                autoComplete="new-password" placeholder="Nhập lại mật khẩu..." />
                                        </div>
                                    </div>
                                ) : editingUser.username === currentUsername ? (
                                    <div className="um-field-row">
                                        <div className="um-field">
                                            <label>Mật khẩu cũ</label>
                                            <input type="password" className="um-input" value={formData.oldPassword}
                                                onChange={e => setFormData({ ...formData, oldPassword: e.target.value })}
                                                autoComplete="new-password" placeholder="Nhập mật khẩu cũ..." />
                                        </div>
                                        <div className="um-field">
                                            <label>Mật khẩu mới</label>
                                            <input type="password" className="um-input" value={formData.password}
                                                onChange={e => setFormData({ ...formData, password: e.target.value })}
                                                autoComplete="new-password" placeholder="Để trống nếu không đổi" />
                                        </div>
                                    </div>
                                ) : currentUserRole === "ADMIN" ? (
                                    <div className="um-reset-panel">
                                        <div>
                                            <div className="um-reset-label">Khôi phục mật khẩu</div>
                                            <div className="um-reset-sub">Mật khẩu sẽ bị đặt lại thành <strong>123456</strong></div>
                                        </div>
                                        <button type="button" className="um-reset-btn"
                                            onClick={() => {
                                                setConfirmDialog({
                                                    isOpen: true,
                                                    title: "Khôi phục mật khẩu?",
                                                    message: `Bạn có chắc muốn reset mật khẩu của ${editingUser.username} về 123456?`,
                                                    onConfirm: async () => {
                                                        try {
                                                            const res = await fetch(`http://localhost:8080/api/users/${editingUser.userId}/reset-password`, {
                                                                method: "PUT", headers: { Authorization: `Bearer ${token}` }
                                                            });
                                                            if (res.ok) {
                                                                setMessage({ type: "success", text: "Đã reset mật khẩu về 123456" });
                                                                setTimeout(() => setShowModal(false), 1000);
                                                            } else {
                                                                setMessage({ type: "error", text: "Lỗi khi reset mật khẩu!" });
                                                            }
                                                        } catch (err) { console.error(err); }
                                                    }
                                                });
                                            }}>
                                            Reset ngay
                                        </button>
                                    </div>
                                ) : null}
 
                                {/* Role + Status */}
                                <div className="um-field-row">
                                    <div className="um-field">
                                        <label>Phân quyền</label>
                                        <div className="um-select-wrap">
                                        <select className="um-select" value={formData.role}
                                            onChange={e => setFormData({ ...formData, role: e.target.value })}
                                            disabled={currentUserRole !== "ADMIN" || editingUser?.role === "ADMIN"}>
                                            <option value="" disabled hidden>-- Chọn role --</option>
                                            {editingUser?.role === "ADMIN" && <option value="ADMIN">ADMIN</option>}
                                            <option value="MANAGER">MANAGER</option>
                                            <option value="CASHIER">CASHIER</option>
                                        </select>
                                        <span className="um-select-arrow"><ChevronDown size={14} /></span>
                                        </div>
                                    </div>
                                    <div className="um-field">
                                        <label>Trạng thái</label>
                                        <div className="um-select-wrap">
                                        <select className="um-select" value={formData.status}
                                            onChange={e => setFormData({ ...formData, status: e.target.value })}
                                            disabled={currentUserRole !== "ADMIN" || editingUser?.role === "ADMIN"}>
                                            <option value="" disabled hidden>-- Chọn trạng thái --</option>
                                            <option value="ACTIVE">Hoạt động</option>
                                            <option value="INACTIVE">Khóa</option>
                                        </select>
                                        <span className="um-select-arrow"><ChevronDown size={14} /></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
 
                            <div className="um-modal-foot">
                                <button className="um-btn-cancel" onClick={() => setShowModal(false)}>Hủy bỏ</button>
                                <button className="um-btn-save" onClick={handleSubmit} disabled={submitting}>
                                    {submitting ? "Đang lưu..." : editingUser ? "Cập nhật" : "Thêm mới"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
 
                {/* ── CONFIRM DIALOG ── */}
                {confirmDialog.isOpen && (
                    <div className="um-overlay" style={{ zIndex: 60 }}>
                        <div className="um-confirm">
                            <span className="um-confirm-icon">
                                {confirmDialog.title.toLowerCase().includes("xóa") ? "🗑️" : "⚠️"}
                            </span>
                            <div className="um-confirm-title">{confirmDialog.title}</div>
                            <div className="um-confirm-msg">{confirmDialog.message}</div>
                            <div className="um-confirm-btns">
                                <button className="um-confirm-cancel"
                                    onClick={() => setConfirmDialog({ isOpen: false, title: "", message: "", onConfirm: null })}>
                                    Hủy bỏ
                                </button>
                                <button
                                    className={`um-confirm-ok ${confirmDialog.title.toLowerCase().includes("xóa") ? "danger" : "warn"}`}
                                    onClick={() => {
                                        confirmDialog.onConfirm();
                                        setConfirmDialog({ isOpen: false, title: "", message: "", onConfirm: null });
                                    }}>
                                    Xác nhận
                                </button>
                            </div>
                        </div>
                    </div>
                )}
 
            </div>
        </div>
    );
}