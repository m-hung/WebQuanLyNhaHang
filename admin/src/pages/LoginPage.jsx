import React, { useState } from "react";
import { fetch } from "../services/api";
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
      window.location.href = "/admin/";
    } catch (err) {
      setError(err.message || "Đăng nhập thất bại!");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setForgotMessage("");
    setError("");
    setForgotLoading(true);
    try {
      const res = await forgotPassword(forgotEmail);
      setForgotMessage(res.message || "Đã gửi yêu cầu. Hãy kiểm tra email.");
    } catch (err) {
      setError(err.message || "Email không tồn tại trong hệ thống!");
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <>
      <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
 
                *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
 
                .lg-root {
                    min-height: 100vh;
                    display: flex;
                    font-family: 'DM Sans', sans-serif;
                    background: #FAF8F5;
                    overflow: hidden;
                }
 
                /* ── LEFT PANEL ── */
                .lg-left {
                    flex: 1;
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    justify-content: flex-end;
                    padding: 52px 56px;
                    background: #1A130E;
                    overflow: hidden;
                    min-height: 100vh;
                }
 
                .lg-left-bg {
                    position: absolute;
                    inset: 0;
                    background:
                        radial-gradient(ellipse 60% 50% at 30% 20%, rgba(196,154,108,0.18) 0%, transparent 70%),
                        radial-gradient(ellipse 40% 60% at 80% 80%, rgba(160,120,66,0.12) 0%, transparent 70%),
                        linear-gradient(160deg, #1A130E 0%, #2A1F15 50%, #1A130E 100%);
                }
 
                /* Decorative circles */
                .lg-deco-ring {
                    position: absolute;
                    border-radius: 50%;
                    border: 1px solid rgba(196,154,108,0.15);
                }
 
                .lg-grain {
                    position: absolute;
                    inset: 0;
                    opacity: 0.04;
                    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
                    background-size: 180px;
                }
 
                .lg-left-content {
                    position: relative;
                    z-index: 2;
                }
 
                .lg-brand-dot {
                    width: 8px; height: 8px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #C49A6C, #A07842);
                    display: inline-block;
                    margin-right: 8px;
                    vertical-align: middle;
                }
 
                .lg-brand-label {
                    font-size: 10px;
                    font-weight: 700;
                    letter-spacing: 0.22em;
                    text-transform: uppercase;
                    color: #C49A6C;
                    display: flex;
                    align-items: center;
                    margin-bottom: 20px;
                }
 
                .lg-brand-name {
                    font-family: 'Playfair Display', serif;
                    font-size: 52px;
                    font-weight: 500;
                    color: #FAF8F5;
                    line-height: 1.1;
                    letter-spacing: 0.01em;
                    margin-bottom: 20px;
                }
 
                .lg-brand-name em {
                    font-style: italic;
                    color: #C49A6C;
                }
 
                .lg-brand-desc {
                    font-size: 13px;
                    color: rgba(250,248,245,0.45);
                    line-height: 1.7;
                    max-width: 340px;
                    margin-bottom: 40px;
                    font-weight: 300;
                }
 
                .lg-divider-line {
                    width: 48px;
                    height: 1px;
                    background: linear-gradient(90deg, #C49A6C, transparent);
                    margin-bottom: 32px;
                }
 
                .lg-stats {
                    display: flex;
                    gap: 32px;
                }
 
                .lg-stat {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                }
 
                .lg-stat-num {
                    font-family: 'DM Sans', sans-serif;
                    font-size: 22px;
                    font-weight: 700;
                    color: #FAF8F5;
                }
 
                .lg-stat-label {
                    font-size: 10px;
                    font-weight: 600;
                    letter-spacing: 0.12em;
                    text-transform: uppercase;
                    color: rgba(250,248,245,0.35);
                }
 
                /* ── RIGHT PANEL ── */
                .lg-right {
                    width: 480px;
                    flex-shrink: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 48px 40px;
                    background: #FAF8F5;
                    position: relative;
                }
 
                .lg-right::before {
                    content: '';
                    position: absolute;
                    left: 0; top: 15%; bottom: 15%;
                    width: 1px;
                    background: linear-gradient(180deg, transparent, #EDE7DD 30%, #EDE7DD 70%, transparent);
                }
 
                .lg-form-wrap {
                    width: 100%;
                    max-width: 360px;
                    animation: lgUp .6s cubic-bezier(.16,1,.3,1) both;
                }
 
                @keyframes lgUp {
                    from { opacity:0; transform:translateY(24px); }
                    to   { opacity:1; transform:translateY(0); }
                }
 
                .lg-form-eyebrow {
                    font-size: 10px;
                    font-weight: 700;
                    letter-spacing: 0.2em;
                    text-transform: uppercase;
                    color: #C49A6C;
                    margin-bottom: 10px;
                }
 
                .lg-form-title {
                    font-family: 'Playfair Display', serif;
                    font-size: 28px;
                    font-weight: 500;
                    color: #1A130E;
                    margin-bottom: 6px;
                    line-height: 1.2;
                }
 
                .lg-form-sub {
                    font-size: 13px;
                    color: #A39688;
                    margin-bottom: 32px;
                    font-weight: 300;
                }
 
                .lg-field {
                    margin-bottom: 18px;
                }
 
                .lg-label {
                    display: block;
                    font-size: 11px;
                    font-weight: 700;
                    letter-spacing: 0.1em;
                    text-transform: uppercase;
                    color: #7A6A5A;
                    margin-bottom: 7px;
                }
 
                .lg-input {
                    width: 100%;
                    background: white;
                    border: 1.5px solid #DDD5C8;
                    border-radius: 12px;
                    padding: 12px 16px;
                    font-family: 'DM Sans', sans-serif;
                    font-size: 14px;
                    color: #2A1F15;
                    outline: none;
                    transition: border-color .2s, box-shadow .2s;
                }
 
                .lg-input:focus {
                    border-color: #C49A6C;
                    box-shadow: 0 0 0 3px rgba(196,154,108,0.13);
                }
 
                .lg-input::placeholder { color: #C0B4A4; }
 
                .lg-btn-primary {
                    width: 100%;
                    padding: 13px;
                    border: none;
                    border-radius: 12px;
                    background: linear-gradient(135deg, #C49A6C 0%, #A07842 100%);
                    color: white;
                    font-family: 'DM Sans', sans-serif;
                    font-size: 14px;
                    font-weight: 700;
                    letter-spacing: 0.04em;
                    cursor: pointer;
                    transition: all .2s;
                    box-shadow: 0 4px 16px -4px rgba(160,120,66,0.5);
                    margin-top: 8px;
                }
 
                .lg-btn-primary:hover:not(:disabled) {
                    transform: translateY(-1px);
                    box-shadow: 0 8px 20px -4px rgba(160,120,66,0.55);
                }
 
                .lg-btn-primary:disabled {
                    background: linear-gradient(135deg, #D4C8BC, #BEB2A6);
                    box-shadow: none;
                    cursor: not-allowed;
                    transform: none;
                }
 
                .lg-btn-forgot {
                    width: 100%;
                    padding: 13px;
                    border: 1.5px solid #C49A6C;
                    border-radius: 12px;
                    background: transparent;
                    color: #A07842;
                    font-family: 'DM Sans', sans-serif;
                    font-size: 14px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all .2s;
                    margin-top: 8px;
                }
 
                .lg-btn-forgot:hover:not(:disabled) { background: #FDF6EE; }
                .lg-btn-forgot:disabled { opacity: 0.5; cursor: not-allowed; }
 
                .lg-error {
                    background: #FEF2F0;
                    border: 1px solid #F7D2C9;
                    border-left: 3px solid #D97049;
                    border-radius: 10px;
                    padding: 11px 14px;
                    font-size: 13px;
                    color: #B54C2C;
                    margin-bottom: 18px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
 
                .lg-success {
                    background: #F0FBF5;
                    border: 1px solid #BBE8CE;
                    border-left: 3px solid #4CAF7D;
                    border-radius: 10px;
                    padding: 11px 14px;
                    font-size: 13px;
                    color: #2D7A50;
                    margin-bottom: 18px;
                }
 
                .lg-notice {
                    background: #FAF6F1;
                    border: 1px solid #EDE7DD;
                    border-radius: 10px;
                    padding: 13px 16px;
                    font-size: 12.5px;
                    color: #7A6A5A;
                    line-height: 1.6;
                    margin-bottom: 18px;
                }
 
                .lg-notice strong { color: #A07842; }
 
                .lg-switch {
                    text-align: center;
                    margin-top: 22px;
                }
 
                .lg-switch-btn {
                    background: none;
                    border: none;
                    font-family: 'DM Sans', sans-serif;
                    font-size: 13px;
                    font-weight: 500;
                    color: #A39688;
                    cursor: pointer;
                    padding: 4px 0;
                    border-bottom: 1px solid transparent;
                    transition: color .2s, border-color .2s;
                }
 
                .lg-switch-btn:hover { color: #A07842; border-bottom-color: #C49A6C; }
 
                /* Ornament separator */
                .lg-sep {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin: 24px 0;
                    color: #C49A6C;
                    font-size: 10px;
                    letter-spacing: 0.2em;
                    font-weight: 700;
                }
                .lg-sep::before, .lg-sep::after {
                    content: '';
                    flex: 1;
                    height: 1px;
                    background: linear-gradient(90deg, transparent, #DDD5C8, transparent);
                }
 
                @media (max-width: 768px) {
                    .lg-left { display: none; }
                    .lg-right { width: 100%; padding: 40px 24px; }
                    .lg-right::before { display: none; }
                }
            `}</style>

      <div className="lg-root">
        {/* ── LEFT: Brand Panel ── */}
        <div className="lg-left">
          <div className="lg-left-bg"></div>
          <div className="lg-grain"></div>

          {/* Decorative rings */}
          <div
            className="lg-deco-ring"
            style={{ width: 500, height: 500, top: -120, right: -180 }}
          ></div>
          <div
            className="lg-deco-ring"
            style={{ width: 300, height: 300, top: 40, right: -40 }}
          ></div>
          <div
            className="lg-deco-ring"
            style={{ width: 200, height: 200, bottom: 140, left: -60 }}
          ></div>

          {/* Floating ornament top */}
          <div style={{ position: "absolute", top: 52, left: 56, zIndex: 2 }}>
            <span
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 13,
                color: "rgba(196,154,108,0.6)",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
              }}
            >
              CELESTÉ
            </span>
          </div>

          {/* Bottom content */}
          <div className="lg-left-content">
            <p className="lg-brand-label">
              <span className="lg-brand-dot"></span>
              Hệ thống quản lý nhà hàng
            </p>

            <h2 className="lg-brand-name">
              Chào mừng
              <br />
              trở lại, <em>Chef</em>
            </h2>

            <div className="lg-divider-line"></div>

            <p className="lg-brand-desc">
              Quản lý bàn ăn, đặt chỗ và hóa đơn — mọi thứ trong tầm tay bạn,
              tinh tế và hiệu quả.
            </p>

            <div className="lg-stats">
              <div className="lg-stat">
                <span className="lg-stat-num">24/7</span>
                <span className="lg-stat-label">Vận hành</span>
              </div>
              <div
                style={{
                  width: 1,
                  background: "rgba(196,154,108,0.2)",
                  alignSelf: "stretch",
                }}
              ></div>
              <div className="lg-stat">
                <span className="lg-stat-num">Lê Văn Việt</span>
                <span className="lg-stat-label">Quận 9 · TP.HCM</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT: Form Panel ── */}
        <div className="lg-right">
          <div className="lg-form-wrap">
            <p className="lg-form-eyebrow">
              ✦ {forgotMode ? "Khôi phục tài khoản" : "Xác thực nhân viên"}
            </p>
            <h1 className="lg-form-title">
              {forgotMode ? "Quên mật khẩu?" : "Đăng nhập"}
            </h1>
            <p className="lg-form-sub">
              {forgotMode
                ? "Nhập email để nhận link khôi phục"
                : "Nhập thông tin để tiếp tục làm việc"}
            </p>

            {/* Thông báo lỗi */}
            {error && (
              <div className="lg-error">
                <span style={{ fontSize: 15 }}>⚠</span>
                {error}
              </div>
            )}

            {/* Thông báo thành công */}
            {forgotMessage && (
              <div className="lg-success">✓ {forgotMessage}</div>
            )}

            {/* FORM ĐĂNG NHẬP */}
            {!forgotMode && (
              <form onSubmit={handleSubmit}>
                <div className="lg-field">
                  <label className="lg-label">Tên đăng nhập</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    autoComplete="off"
                    className="lg-input"
                    placeholder="Nhập username..."
                    required
                  />
                </div>
                <div className="lg-field">
                  <label className="lg-label">Mật khẩu</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                    className="lg-input"
                    placeholder="••••••••"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="lg-btn-primary"
                >
                  {loading ? "Đang xác thực..." : "Đăng nhập →"}
                </button>
              </form>
            )}

            {/* FORM QUÊN MẬT KHẨU */}
            {forgotMode && (
              <form onSubmit={handleForgotSubmit}>
                <div className="lg-notice">
                  Tính năng này chỉ dành cho tài khoản{" "}
                  <strong>Quản trị (Admin)</strong>.<br />
                  Nhân viên vui lòng liên hệ trực tiếp Admin để được cấp lại mật
                  khẩu.
                </div>
                <div className="lg-field">
                  <label className="lg-label">Địa chỉ Email</label>
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    autoComplete="off"
                    className="lg-input"
                    placeholder="admin@gmail.com"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="lg-btn-forgot"
                >
                  {forgotLoading ? "Đang gửi..." : "Gửi link khôi phục →"}
                </button>
              </form>
            )}

            <div className="lg-sep">✦</div>

            {/* Switch mode */}
            <div className="lg-switch">
              {!forgotMode ? (
                <button
                  type="button"
                  className="lg-switch-btn"
                  onClick={() => {
                    setForgotMode(true);
                    setForgotEmail("");
                    setForgotMessage("");
                    setError("");
                  }}
                >
                  Quên mật khẩu?
                </button>
              ) : (
                <button
                  type="button"
                  className="lg-switch-btn"
                  onClick={() => {
                    setForgotMode(false);
                    setForgotMessage("");
                    setError("");
                  }}
                >
                  ← Quay lại đăng nhập
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
