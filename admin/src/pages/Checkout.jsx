import React, { useState } from "react";
 
export default function Checkout({ setPage, invoice, onPaymentSuccess }) {
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
 
  const [showInvoice, setShowInvoice] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
 
  const [currentTime] = useState(() => {
    const now = new Date();
    return (
      now.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }) +
      " · " +
      now.toLocaleDateString("vi-VN")
    );
  });
 
  const currentUserName =
    sessionStorage.getItem("fullName") ||
    sessionStorage.getItem("username") ||
    invoice?.cashierName ||
    "Thu ngân";
 
  // VALIDATION FUNCTIONS
  const isValidName = (name) => {
    const trimmedName = name.trim();
    if (trimmedName.length < 2 || trimmedName.length > 100) return false;
    return !/[0-9!@#$%^&*()_+\-=[\]{};:'"|,.<>?\\]/.test(trimmedName);
  };
 
  const isValidPhone = (phone) => {
    const phoneOnly = phone.trim().replace(/\s/g, "");
    const phoneRegex = /^(0\d{9}|\+84\d{9,11})$/;
    return phoneRegex.test(phoneOnly);
  };
 
  const isFormValid = isValidName(customerName) && isValidPhone(customerPhone);
 
  const rawItems = invoice?.cart || invoice?.orderItems || [];
 
  const BANK_ID = "BIDV";
  const ACCOUNT_NO = "8876088284";
  const ACCOUNT_NAME = "NGUYEN KHANH HUNG";
  const amount = invoice?.totalPrice || 0;
  const description = `Thanh toan don hang ${invoice?.id || "VN"}`;
  const qrUrl = `https://img.vietqr.io/image/${BANK_ID}-${ACCOUNT_NO}-compact2.png?amount=${amount}&addInfo=${encodeURIComponent(description)}&accountName=${encodeURIComponent(ACCOUNT_NAME)}`;
 
  const formatCurrency = (amount) => {
    if (amount == null) return "0 đ";
    return amount.toLocaleString("vi-VN") + " đ";
  };
 
  const handlePrint = () => { window.print(); };
  const handleShowInvoice = () => { setSelectedOrder(invoice); setShowInvoice(true); };
 
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&family=DM+Sans:wght@300;400;500&display=swap');
 
        .ck-root {
          font-family: 'DM Sans', sans-serif;
          background: #FAF8F5;
          min-height: 100vh;
          color: #2A1F15;
        }
        .ck-serif { font-family: 'Playfair Display', serif; }
 
        @keyframes ckSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes ckFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .ck-anim-1 { animation: ckSlideUp 0.5s cubic-bezier(.16,1,.3,1) both; }
        .ck-anim-2 { animation: ckSlideUp 0.5s .08s cubic-bezier(.16,1,.3,1) both; }
        .ck-anim-3 { animation: ckSlideUp 0.5s .16s cubic-bezier(.16,1,.3,1) both; }
        .ck-anim-4 { animation: ckSlideUp 0.5s .24s cubic-bezier(.16,1,.3,1) both; }
        .ck-anim-5 { animation: ckSlideUp 0.5s .32s cubic-bezier(.16,1,.3,1) both; }
 
        .ck-card {
          background: #FFFFFF;
          border: 1px solid #EDE7DD;
          border-radius: 20px;
          box-shadow: 0 4px 24px -8px rgba(80,55,30,0.07);
        }
        .ck-divider {
          border: none;
          border-top: 1px solid #EDE7DD;
          margin: 0;
        }
 
        /* Input styling */
        .ck-input {
          background: #FDFAF7;
          border: 1.5px solid #DDD5C8;
          border-radius: 10px;
          padding: 10px 14px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          color: #2A1F15;
          outline: none;
          transition: border-color .2s;
          width: 100%;
        }
        .ck-input:focus { border-color: #C49A6C; box-shadow: 0 0 0 3px rgba(196,154,108,.12); }
        .ck-input.valid { border-color: #59A883; }
        .ck-input.invalid { border-color: #D97049; }
 
        /* Payment method cards */
        .ck-pay-card {
          border: 2px solid #EDE7DD;
          border-radius: 14px;
          padding: 16px 20px;
          cursor: pointer;
          transition: all .2s;
          background: #FDFAF7;
          flex: 1;
          min-width: 160px;
        }
        .ck-pay-card:hover { border-color: #C49A6C; background: #FDF6EE; }
        .ck-pay-card.selected {
          border-color: #C49A6C;
          background: linear-gradient(135deg, #FDF6EE 0%, #FFF9F3 100%);
          box-shadow: 0 4px 16px -4px rgba(196,154,108,0.25);
        }
 
        /* Table rows */
        .ck-item-row { transition: background .15s; }
        .ck-item-row:hover { background: #FAF6F1; }
 
        /* Buttons */
        .ck-btn-ghost {
          border: 1.5px solid #DDD5C8;
          background: transparent;
          color: #7A6A5A;
          border-radius: 12px;
          padding: 10px 22px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all .2s;
        }
        .ck-btn-ghost:hover { background: #F5EFE7; border-color: #C49A6C; color: #2A1F15; }
 
        .ck-btn-secondary {
          border: 1.5px solid #C49A6C;
          background: transparent;
          color: #A07842;
          border-radius: 12px;
          padding: 10px 22px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all .2s;
        }
        .ck-btn-secondary:hover { background: #C49A6C; color: white; }
 
        .ck-btn-primary {
          background: linear-gradient(135deg, #C49A6C 0%, #A07842 100%);
          color: white;
          border: none;
          border-radius: 12px;
          padding: 11px 28px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all .2s;
          box-shadow: 0 4px 14px -4px rgba(160,120,66,0.5);
        }
        .ck-btn-primary:hover { transform: translateY(-1px); box-shadow: 0 6px 18px -4px rgba(160,120,66,0.55); }
        .ck-btn-primary:disabled {
          background: linear-gradient(135deg, #D4C8BC 0%, #BEB2A6 100%);
          box-shadow: none; cursor: not-allowed; transform: none;
        }
 
        /* QR area */
        .ck-qr-wrap {
          animation: ckFadeIn .35s ease both;
        }
 
        /* Ornament line */
        .ck-ornament {
          display: flex; align-items: center; gap: 12px; color: #C49A6C; font-size: 11px;
          letter-spacing: .14em; text-transform: uppercase; font-weight: 600;
        }
        .ck-ornament::before, .ck-ornament::after {
          content: ''; flex: 1; height: 1px; background: linear-gradient(90deg, transparent, #DDD5C8, transparent);
        }
 
        /* Invoice modal */
        .ck-modal-overlay {
          position: fixed; inset: 0; background: rgba(30,20,10,0.55);
          display: flex; align-items: center; justify-content: center; z-index: 50; padding: 16px;
          backdrop-filter: blur(2px);
          animation: ckFadeIn .2s ease both;
        }
        .ck-invoice-modal {
          background: white;
          border-radius: 20px;
          width: 100%; max-width: 480px;
          max-height: 90vh;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          box-shadow: 0 32px 64px -16px rgba(30,20,10,0.35);
          animation: ckSlideUp .3s cubic-bezier(.16,1,.3,1) both;
        }
 
 
        @media (max-width: 640px) {
          .ck-modal-overlay { align-items: flex-end; padding: 0; }
          .ck-invoice-modal {
            border-radius: 20px 20px 0 0;
            max-height: 95vh;
            max-width: 100%;
          }
          .ck-pay-card { min-width: 0; }
        }
        @media print {
          .print\\:hidden { display: none !important; }
        }
      `}</style>
 
      <div className="ck-root p-6 md:p-10 print:hidden">
        <div style={{ maxWidth: 920, margin: "0 auto" }}>
 
          {/* ── HEADER ── */}
          <div className="ck-anim-1 mb-8">
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
              <div>
                <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#C49A6C", marginBottom: 6 }}>
                  ✦ Thanh toán
                </p>
                <h1 className="ck-serif" style={{ fontSize: "clamp(22px, 5vw, 32px)", fontWeight: 500, color: "#1A130E", lineHeight: 1.15, margin: 0 }}>
                  Hóa đơn #{invoice?.id || "N/A"}
                </h1>
              </div>
              <div className="ck-card" style={{ padding: "10px 18px", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 2 }}>
                <span style={{ fontSize: 11, color: "#A39688", letterSpacing: "0.05em" }}>Thu ngân: <strong style={{ color: "#2A1F15" }}>{currentUserName}</strong></span>
                <span style={{ fontSize: 11, color: "#A39688" }}>{currentTime}</span>
              </div>
            </div>
          </div>
 
          {/* ── LAYOUT 2 CỘT ── */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))", gap: 24, alignItems: "start" }}>
 
            {/* CỘT TRÁI */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
 
              {/* BẢNG MÓN ĂN */}
              <div className="ck-card ck-anim-2" style={{ overflow: "hidden" }}>
                <div style={{ padding: "18px 24px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <h2 className="ck-serif" style={{ fontSize: 18, fontWeight: 600, margin: 0, color: "#2A1F15" }}>Danh sách món</h2>
                  <span style={{ fontSize: 12, color: "#A39688", background: "#F5EFE7", padding: "3px 10px", borderRadius: 20 }}>
                    {rawItems.length} món
                  </span>
                </div>
                <hr className="ck-divider" />
 
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ background: "#FAF6F1" }}>
                        <th style={{ padding: "10px 24px", textAlign: "left", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#A39688", whiteSpace: "nowrap" }}>Tên món</th>
                        <th style={{ padding: "10px 16px", textAlign: "right", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#A39688", whiteSpace: "nowrap" }}>Đơn giá</th>
                        <th style={{ padding: "10px 16px", textAlign: "center", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#A39688" }}>SL</th>
                        <th style={{ padding: "10px 24px 10px 16px", textAlign: "right", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#A39688", whiteSpace: "nowrap" }}>Thành tiền</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rawItems.length > 0 ? rawItems.map((item, index) => {
                        const itemName = item.menuItem?.nameVi || item.menuItem?.name || item.nameVi || item.nameEn || item.name || "Tên món ăn";
                        const basePrice = item.menuItem?.price ?? item.price ?? 0;
                        const discount = item.menuItem?.discount ?? item.discount ?? 0;
                        const effectivePrice = Math.max(0, basePrice - discount);
                        const itemQty = item.quantity || item.qty || 1;
                        const itemTotal = item.subtotal !== undefined ? item.subtotal : effectivePrice * itemQty;
                        return (
                          <tr key={index} className="ck-item-row" style={{ borderTop: "1px solid #F0EAE2" }}>
                            <td style={{ padding: "13px 24px", color: "#2A1F15", fontWeight: 500, fontSize: 14 }}>{itemName}</td>
                            <td style={{ padding: "13px 16px", color: "#7A6A5A", fontSize: 13, textAlign: "right", whiteSpace: "nowrap" }}>{effectivePrice.toLocaleString()} đ</td>
                            <td style={{ padding: "13px 16px", textAlign: "center" }}>
                              <span style={{ background: "#F5EFE7", color: "#A07842", fontWeight: 700, fontSize: 13, borderRadius: 8, padding: "2px 10px", minWidth: 28, display: "inline-block" }}>{itemQty}</span>
                            </td>
                            <td style={{ padding: "13px 24px 13px 16px", textAlign: "right", fontWeight: 700, fontSize: 14, color: "#2A1F15", whiteSpace: "nowrap" }}>{itemTotal.toLocaleString()} đ</td>
                          </tr>
                        );
                      }) : (
                        <tr>
                          <td colSpan="4" style={{ padding: "32px 24px", textAlign: "center", color: "#A39688", fontSize: 14 }}>
                            Không có món ăn nào trong hóa đơn
                          </td>
                        </tr>
                      )}
                    </tbody>
                    <tfoot>
                      <tr style={{ borderTop: "2px solid #EDE7DD", background: "#FDF9F5" }}>
                        <td colSpan="3" style={{ padding: "16px 24px", fontSize: 13, fontWeight: 600, color: "#7A6A5A", letterSpacing: "0.04em" }}>TỔNG TIỀN THANH TOÁN</td>
                        <td style={{ padding: "16px 24px 16px 16px", textAlign: "right" }}>
                          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 22, fontWeight: 700, color: "#A07842", letterSpacing: "0" }}>
                            {formatCurrency(invoice?.totalPrice || 0)}
                          </span>
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
 
              {/* HÌNH THỨC THANH TOÁN */}
              <div className="ck-card ck-anim-3" style={{ padding: "20px 24px 24px" }}>
                <h2 className="ck-serif" style={{ fontSize: 18, fontWeight: 600, margin: "0 0 16px", color: "#2A1F15" }}>Hình thức thanh toán</h2>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  <div
                    className={`ck-pay-card ${paymentMethod === "Cash" ? "selected" : ""}`}
                    onClick={() => setPaymentMethod("Cash")}
                  >
                    <div style={{ fontSize: 22, marginBottom: 8 }}>💵</div>
                    <div style={{ fontWeight: 600, fontSize: 14, color: "#2A1F15" }}>Tiền mặt</div>
                    <div style={{ fontSize: 12, color: "#A39688", marginTop: 2 }}>Thanh toán trực tiếp</div>
                  </div>
                  <div
                    className={`ck-pay-card ${paymentMethod === "VNPAY" ? "selected" : ""}`}
                    onClick={() => setPaymentMethod("VNPAY")}
                  >
                    <div style={{ fontSize: 22, marginBottom: 8 }}>📲</div>
                    <div style={{ fontWeight: 600, fontSize: 14, color: "#2A1F15" }}>Chuyển khoản</div>
                    <div style={{ fontSize: 12, color: "#A39688", marginTop: 2 }}>Ví VNPAY / QR</div>
                  </div>
                </div>
 
                {paymentMethod === "VNPAY" && (
                  <div className="ck-qr-wrap" style={{ marginTop: 20, display: "flex", gap: 20, alignItems: "flex-start", flexWrap: "wrap" }}>
                    <div style={{
                      background: "white", border: "1.5px dashed #C49A6C", borderRadius: 16,
                      padding: "16px", display: "flex", flexDirection: "column", alignItems: "center", gap: 10
                    }}>
                      <img src={qrUrl} alt="Mã QR Thanh Toán" style={{ width: 180, height: 180, objectFit: "contain" }} />
                      <p style={{ fontSize: 12, color: "#A39688", textAlign: "center", maxWidth: 200, margin: 0 }}>
                        Dùng app ngân hàng quét mã để thanh toán
                      </p>
                    </div>
                    <div style={{ flex: 1, minWidth: 180 }}>
                      <div style={{ background: "#FAF6F1", borderRadius: 12, padding: "14px 18px", display: "flex", flexDirection: "column", gap: 10 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                          <span style={{ color: "#A39688" }}>Ngân hàng</span>
                          <span style={{ fontWeight: 600, color: "#2A1F15" }}>{BANK_ID}</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                          <span style={{ color: "#A39688" }}>Số tài khoản</span>
                          <span style={{ fontWeight: 600, color: "#2A1F15", letterSpacing: "0.05em" }}>{ACCOUNT_NO}</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                          <span style={{ color: "#A39688" }}>Chủ tài khoản</span>
                          <span style={{ fontWeight: 600, color: "#2A1F15" }}>{ACCOUNT_NAME}</span>
                        </div>
                        <hr className="ck-divider" style={{ margin: "2px 0" }} />
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                          <span style={{ color: "#A39688" }}>Số tiền</span>
                          <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 16, color: "#A07842" }}>{formatCurrency(amount)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
 
            {/* CỘT PHẢI */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
 
              {/* THÔNG TIN KHÁCH HÀNG */}
              <div className="ck-card ck-anim-2" style={{ padding: "20px 24px 24px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 10, background: "linear-gradient(135deg,#F5EFE7,#EDE2D4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>👤</div>
                  <h2 className="ck-serif" style={{ fontSize: 18, fontWeight: 600, margin: 0, color: "#2A1F15" }}>Khách hàng</h2>
                </div>
 
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#A39688", display: "block", marginBottom: 6 }}>Họ và tên</label>
                    <input
                      type="text"
                      placeholder="Nhập tên khách hàng..."
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      minLength="2" maxLength="100" required
                      className={`ck-input ${customerName.trim() === "" ? "" : isValidName(customerName) ? "valid" : "invalid"}`}
                    />
                    {customerName.trim() !== "" && !isValidName(customerName) && (
                      <p style={{ fontSize: 11, color: "#D97049", marginTop: 4 }}>Tên 2–100 ký tự, chỉ chứa chữ cái</p>
                    )}
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#A39688", display: "block", marginBottom: 6 }}>Số điện thoại</label>
                    <input
                      type="tel"
                      placeholder="0xxxxxxxxx"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      pattern="(0\d{9}|\+84\d{9,11})" required
                      className={`ck-input ${customerPhone.trim() === "" ? "" : isValidPhone(customerPhone) ? "valid" : "invalid"}`}
                    />
                    {customerPhone.trim() !== "" && !isValidPhone(customerPhone) && (
                      <p style={{ fontSize: 11, color: "#D97049", marginTop: 4 }}>VD: 0912345678 hoặc +84912345678</p>
                    )}
                  </div>
                </div>
              </div>
 
              {/* TÓM TẮT ĐƠN */}
              <div className="ck-card ck-anim-3" style={{ padding: "20px 24px" }}>
                <h2 className="ck-serif" style={{ fontSize: 18, fontWeight: 600, margin: "0 0 16px", color: "#2A1F15" }}>Tóm tắt đơn</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#7A6A5A" }}>
                    <span>Số món</span>
                    <span style={{ fontWeight: 600, color: "#2A1F15" }}>{rawItems.length} món</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#7A6A5A" }}>
                    <span>Thanh toán qua</span>
                    <span style={{ fontWeight: 600, color: "#2A1F15" }}>{paymentMethod === "Cash" ? "Tiền mặt" : "VNPAY"}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#7A6A5A" }}>
                    <span>Bàn số</span>
                    <span style={{ fontWeight: 600, color: "#2A1F15" }}>{invoice?.tableId || "—"}</span>
                  </div>
                  <hr className="ck-divider" style={{ margin: "4px 0" }} />
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#A39688" }}>Tổng cộng</span>
                    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 24, fontWeight: 700, color: "#A07842" }}>{formatCurrency(invoice?.totalPrice || 0)}</span>
                  </div>
                </div>
              </div>
 
              {/* ACTION BUTTONS */}
              <div className="ck-anim-4" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <button className="ck-btn-primary" disabled={!isFormValid} title={!isFormValid ? "Vui lòng nhập Họ tên và SĐT" : ""}
                  onClick={() => {
                    const now = new Date();
                    const pad = (n) => String(n).padStart(2, "0");
                    const localDateTime = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
                    const paymentPayload = {
                      order: { orderId: invoice?.id },
                      amountPaid: invoice?.totalPrice,
                      paymentMethod: paymentMethod,
                      paymentTime: localDateTime,
                      customerName: customerName,
                      phone: customerPhone,
                    };
                    fetch("http://localhost:8080/api/payments", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(paymentPayload),
                    })
                      .then(() => fetch(`http://localhost:8080/api/orders/${invoice?.id}/status`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ status: "Paid" }),
                      }))
                      .then(() => fetch(`http://localhost:8080/api/tables/${invoice?.tableId}/status`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ status: "Available" }),
                      }))
                      .then(() => { if (onPaymentSuccess) onPaymentSuccess(invoice?.id); })
                      .catch((err) => {
                        console.error("Lỗi khi thanh toán:", err);
                        alert("Có lỗi xảy ra khi lưu thanh toán! Vui lòng kiểm tra F12.");
                      });
                  }}
                  style={{ width: "100%", padding: "13px", fontSize: 15 }}
                >
                  ✓ Xác nhận thanh toán
                </button>
                <button className="ck-btn-secondary" onClick={handleShowInvoice} style={{ width: "100%" }}>
                  🧾 Xem & In hóa đơn
                </button>
                <button className="ck-btn-ghost" onClick={() => setPage("main_dashboard")} style={{ width: "100%" }}>
                  ← Trở lại
                </button>
              </div>
 
            </div>
          </div>
        </div>
      </div>
 
      {/* ── MODAL HÓA ĐƠN ── */}
      {showInvoice && selectedOrder && (
        <div className="ck-modal-overlay">
          <div className="ck-invoice-modal">
            {/* Header modal */}
            <div style={{ textAlign: "center", padding: "28px 28px 20px", borderBottom: "1px dashed #CCC5BA", position: "relative" }}>
              <p style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "#C49A6C", fontWeight: 700, margin: "0 0 6px" }}>✦ Nhà hàng ✦</p>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 600, color: "#1A130E", margin: "0 0 4px", letterSpacing: "0.04em" }}>CELESTÉ HOUSE</h2>
              <p style={{ fontSize: 12, color: "#A39688", margin: "0 0 2px" }}>Lê Văn Việt, Quận 9, TP. Hồ Chí Minh</p>
              <p style={{ fontSize: 12, color: "#A39688", margin: 0 }}>Hotline: +84 123 456 789</p>
              <div style={{ margin: "16px 0 0" }}>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", margin: "0 0 6px", color: "#2A1F15" }}>Hóa đơn thanh toán</h3>
                <p style={{ fontSize: 12, color: "#7A6A5A", margin: "0 0 2px" }}>Mã HĐ: HD-{selectedOrder.id}</p>
                <p style={{ fontSize: 12, color: "#7A6A5A", margin: 0 }}>{currentTime}</p>
              </div>
            </div>
 
            {/* Body */}
            <div style={{ padding: "20px 28px", overflowY: "auto", flex: 1 }}>
              {/* Thông tin khách */}
              <div style={{ fontSize: 13, borderBottom: "1px dashed #CCC5BA", paddingBottom: 14, marginBottom: 16, display: "flex", flexDirection: "column", gap: 6 }}>
                {[
                  ["Khách hàng", customerName],
                  ["Số điện thoại", customerPhone],
                  ["Thanh toán", paymentMethod === "Cash" ? "Tiền mặt" : "Chuyển khoản (VNPAY)"],
                ].map(([label, val]) => (
                  <div key={label} style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#A39688" }}>{label}</span>
                    <span style={{ fontWeight: 500, color: "#2A1F15" }}>{val}</span>
                  </div>
                ))}
              </div>
 
              {/* Danh sách món */}
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#A39688", margin: "0 0 10px" }}>Danh sách món</p>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #2A1F15" }}>
                    {["#", "Món ăn", "SL", "Đơn giá", "T. tiền"].map((h, i) => (
                      <th key={h} style={{ padding: "6px 4px", textAlign: i === 0 ? "center" : i < 2 ? "left" : i === 2 ? "center" : "right", fontWeight: 700, fontSize: 12 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rawItems.map((item, idx) => {
                    const itemName = item.menuItem?.nameVi || item.menuItem?.name || item.nameVi || item.name || "Tên món";
                    const itemNameEn = item.menuItem?.nameEn || item.menuItem?.englishName || item.nameEn || item.englishName || "";
                    const basePrice = item.menuItem?.price ?? item.price ?? 0;
                    const discount = item.menuItem?.discount ?? item.discount ?? 0;
                    const effectivePrice = Math.max(0, basePrice - discount);
                    const itemQty = item.quantity || item.qty || 1;
                    const itemTotal = item.subtotal ?? effectivePrice * itemQty;
                    return (
                      <tr key={idx} style={{ borderBottom: "1px dashed #DDD5C8" }}>
                        <td style={{ padding: "10px 4px", textAlign: "center", color: "#A39688" }}>{idx + 1}</td>
                        <td style={{ padding: "10px 4px" }}>
                          <p style={{ fontWeight: 500, margin: 0, color: "#1A130E" }}>{itemName}</p>
                          {itemNameEn && <p style={{ fontSize: 11, color: "#A39688", margin: 0 }}>{itemNameEn}</p>}
                        </td>
                        <td style={{ padding: "10px 4px", textAlign: "center" }}>{itemQty}</td>
                        <td style={{ padding: "10px 4px", textAlign: "right", color: "#7A6A5A", whiteSpace: "nowrap" }}>{formatCurrency(effectivePrice)}</td>
                        <td style={{ padding: "10px 4px", textAlign: "right", fontWeight: 700, whiteSpace: "nowrap" }}>{formatCurrency(itemTotal)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
 
              {/* Tổng */}
              <div style={{ borderTop: "1px solid #2A1F15", marginTop: 12, paddingTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: 700, fontSize: 14 }}>Tổng cộng</span>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 22, color: "#A07842" }}>{formatCurrency(invoice?.totalPrice || 0)}</span>
              </div>
 
              <p style={{ textAlign: "center", fontSize: 12, color: "#A39688", fontStyle: "italic", marginTop: 20 }}>Cảm ơn quý khách và hẹn gặp lại! ✦</p>
            </div>
 
            {/* Footer modal */}
            <div className="print:hidden" style={{ padding: "14px 24px", borderTop: "1px solid #EDE7DD", background: "#FAF8F5", display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button className="ck-btn-secondary" onClick={handlePrint}>🖨 In hóa đơn</button>
              <button className="ck-btn-ghost" onClick={() => setShowInvoice(false)}>Đóng</button>
            </div>
          </div>
        </div>
      )}
        {/* In modal ── */}
        {showInvoice && selectedOrder && (
            <div className="print-area" style={{ display: "none" }}>
                <div style={{ textAlign: "center", padding: "28px 28px 20px", borderBottom: "1px dashed #CCC5BA" }}>
                    <p style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "#C49A6C", fontWeight: 700, margin: "0 0 6px" }}>✦ Nhà hàng ✦</p>
                    <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 600, color: "#1A130E", margin: "0 0 4px" }}>CELESTÉ HOUSE</h2>
                    <p style={{ fontSize: 12, color: "#A39688", margin: "0 0 2px" }}>Lê Văn Việt, Quận 9, TP. Hồ Chí Minh</p>
                    <p style={{ fontSize: 12, color: "#A39688", margin: 0 }}>Hotline: +84 123 456 789</p>
                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", margin: "16px 0 6px", color: "#2A1F15" }}>Hóa đơn thanh toán</h3>
                    <p style={{ fontSize: 12, color: "#7A6A5A", margin: "0 0 2px" }}>Mã HĐ: HD-{selectedOrder.id}</p>
                    <p style={{ fontSize: 12, color: "#7A6A5A", margin: 0 }}>{currentTime}</p>
                </div>

                <div style={{ padding: "20px 28px" }}>
                    <div style={{ fontSize: 13, borderBottom: "1px dashed #CCC5BA", paddingBottom: 14, marginBottom: 16, display: "flex", flexDirection: "column", gap: 6 }}>
                        {[
                            ["Khách hàng", customerName],
                            ["Số điện thoại", customerPhone],
                            ["Thanh toán", paymentMethod === "Cash" ? "Tiền mặt" : "Chuyển khoản (VNPAY)"],
                        ].map(([label, val]) => (
                            <div key={label} style={{ display: "flex", justifyContent: "space-between" }}>
                                <span style={{ color: "#A39688" }}>{label}</span>
                                <span style={{ fontWeight: 500, color: "#2A1F15" }}>{val}</span>
                            </div>
                        ))}
                    </div>

                    <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#A39688", margin: "0 0 10px" }}>Danh sách món</p>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                        <thead>
                        <tr style={{ borderBottom: "1px solid #2A1F15" }}>
                            {["#", "Món ăn", "SL", "Đơn giá", "T. tiền"].map((h, i) => (
                                <th key={h} style={{ padding: "6px 4px", textAlign: i === 0 ? "center" : i < 2 ? "left" : i === 2 ? "center" : "right", fontWeight: 700, fontSize: 12 }}>{h}</th>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        {rawItems.map((item, idx) => {
                            const itemName = item.menuItem?.nameVi || item.menuItem?.name || item.nameVi || item.name || "Tên món";
                            const itemNameEn = item.menuItem?.nameEn || item.menuItem?.englishName || item.nameEn || item.englishName || "";
                            const basePrice = item.menuItem?.price ?? item.price ?? 0;
                            const discount = item.menuItem?.discount ?? item.discount ?? 0;
                            const effectivePrice = Math.max(0, basePrice - discount);
                            const itemQty = item.quantity || item.qty || 1;
                            const itemTotal = item.subtotal ?? effectivePrice * itemQty;
                            return (
                                <tr key={idx} style={{ borderBottom: "1px dashed #DDD5C8" }}>
                                    <td style={{ padding: "10px 4px", textAlign: "center", color: "#A39688" }}>{idx + 1}</td>
                                    <td style={{ padding: "10px 4px" }}>
                                        <p style={{ fontWeight: 500, margin: 0, color: "#1A130E" }}>{itemName}</p>
                                        {itemNameEn && <p style={{ fontSize: 11, color: "#A39688", margin: 0 }}>{itemNameEn}</p>}
                                    </td>
                                    <td style={{ padding: "10px 4px", textAlign: "center" }}>{itemQty}</td>
                                    <td style={{ padding: "10px 4px", textAlign: "right", color: "#7A6A5A", whiteSpace: "nowrap" }}>{formatCurrency(effectivePrice)}</td>
                                    <td style={{ padding: "10px 4px", textAlign: "right", fontWeight: 700, whiteSpace: "nowrap" }}>{formatCurrency(itemTotal)}</td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>

                    <div style={{ borderTop: "1px solid #2A1F15", marginTop: 12, paddingTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontWeight: 700, fontSize: 14 }}>Tổng cộng</span>
                        <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 22, color: "#A07842" }}>{formatCurrency(invoice?.totalPrice || 0)}</span>
                    </div>
                    <p style={{ textAlign: "center", fontSize: 12, color: "#A39688", fontStyle: "italic", marginTop: 20 }}>Cảm ơn quý khách và hẹn gặp lại! ✦</p>
                </div>
            </div>
        )}
    </>
  );
}