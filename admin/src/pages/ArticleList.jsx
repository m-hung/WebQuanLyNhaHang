import { useState, useEffect, useRef } from "react";
import { Plus, Pencil, Trash2, Eye, EyeOff, BookOpen, Sparkles, ChevronLeft, ChevronRight, AlertTriangle, RefreshCw, X, Globe } from "lucide-react";
 
const API_BASE = "http://localhost:8080/api/blogs";
 
// ─── SLUGIFY (backend logic – giữ nguyên) ───────────────────────────────────
function slugify(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}
 
const emptyForm = {
  titleVi: "", titleEn: "", slug: "", imgUrl: "",
  summaryVi: "", summaryEn: "", contentVi: "", contentEn: "",
  authorName: "", active: true,
};
 
// ─── GLOBAL STYLES ───────────────────────────────────────────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=DM+Sans:wght@300;400;500;600&display=swap');
 
  .al-root * { font-family: 'DM Sans', sans-serif; box-sizing: border-box; }
  .al-serif  { font-family: 'Cormorant Garamond', serif !important; }
 
  @keyframes al-fadeUp   { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
  @keyframes al-fadeIn   { from { opacity:0; }                             to { opacity:1; } }
  @keyframes al-scaleIn  { from { opacity:0; transform:scale(.96); }       to { opacity:1; transform:scale(1); } }
  @keyframes al-shimmer  { 0%,100%{opacity:.5} 50%{opacity:1} }
  @keyframes al-spin     { to { transform:rotate(360deg); } }
  @keyframes al-slideL   { from{opacity:0;transform:translateX(-10px)} to{opacity:1;transform:translateX(0)} }
  @keyframes al-pulse-gold { 0%,100%{box-shadow:0 0 0 0 rgba(196,154,108,.3)} 50%{box-shadow:0 0 0 8px rgba(196,154,108,0)} }
 
  .al-fade-up  { animation: al-fadeUp  .5s ease both; }
  .al-fade-in  { animation: al-fadeIn  .4s ease both; }
  .al-scale-in { animation: al-scaleIn .35s ease both; }
  .al-slide-l  { animation: al-slideL  .35s ease both; }
 
  /* Card */
  .al-card {
    background: linear-gradient(145deg,#FEFCF8,#FAF6EE);
    border: 1px solid rgba(196,154,108,.16);
    border-radius: 20px;
    transition: box-shadow .25s, transform .25s, border-color .25s;
    overflow: hidden;
    position: relative;
  }
  .al-card:hover {
    box-shadow: 0 12px 36px rgba(160,110,50,.1), 0 2px 8px rgba(160,110,50,.06);
    transform: translateY(-2px);
    border-color: rgba(196,154,108,.32);
  }
  .al-card.inactive { opacity: .6; filter: saturate(.5); }
 
  /* Thumbnail */
  .al-thumb {
    width: 100%; aspect-ratio: 16/9;
    object-fit: cover;
    display: block;
    transition: transform .4s ease;
  }
  .al-card:hover .al-thumb { transform: scale(1.03); }
  .al-thumb-wrap {
    overflow: hidden;
    border-radius: 14px 14px 0 0;
    background: linear-gradient(135deg,#EDE5D8,#E0D5C0);
    position: relative;
  }
  .al-thumb-placeholder {
    width:100%; aspect-ratio:16/9;
    display:flex; align-items:center; justify-content:center;
    background: linear-gradient(135deg,#EDE5D8,#E2D4BC);
    color: #C49A6C; opacity: .5;
  }
 
  /* Status ribbon */
  .al-ribbon {
    position: absolute; top: 10px; right: 10px;
    padding: 3px 10px; border-radius: 20px;
    font-size: 10px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase;
    backdrop-filter: blur(6px);
  }
  .al-ribbon.show  { background:rgba(40,180,80,.85);  color:#fff; }
  .al-ribbon.hide  { background:rgba(60,60,60,.65);   color:#ddd; }
 
  /* Lang pills */
  .al-lang {
    display:inline-flex; align-items:center; gap:3px;
    padding: 2px 8px; border-radius: 10px;
    font-size: 10px; font-weight: 700;
  }
  .al-lang.vi { background:rgba(59,130,246,.1); color:#2563EB; border:1px solid rgba(59,130,246,.2); }
  .al-lang.en { background:rgba(245,158,11,.1); color:#B45309; border:1px solid rgba(245,158,11,.2); }
  .al-lang.off { background:rgba(0,0,0,.06); color:#999; border:1px solid rgba(0,0,0,.08); text-decoration:line-through; }
 
  /* Inputs */
  .al-input {
    width:100%; background:#FEFCF9;
    border:1.5px solid rgba(196,154,108,.22); border-radius:12px;
    padding:10px 14px; font-size:13px; color:#3D2E1E;
    outline:none; transition:border-color .2s,box-shadow .2s;
    font-family:'DM Sans',sans-serif;
  }
  .al-input::placeholder { color:#C0A888; }
  .al-input:focus { border-color:rgba(196,154,108,.65); box-shadow:0 0 0 3px rgba(196,154,108,.1); }
  .al-input.al-error { border-color:rgba(220,60,60,.45); box-shadow:0 0 0 3px rgba(220,60,60,.07); }
  textarea.al-input { resize:none; }
 
  /* Buttons */
  .al-btn-gold {
    background:linear-gradient(135deg,#C49A6C,#A87B4A);
    color:#FEF8EF; border:none; border-radius:12px;
    padding:10px 20px; font-size:12.5px; font-weight:600;
    letter-spacing:.04em; cursor:pointer;
    display:inline-flex; align-items:center; gap:7px;
    transition:all .2s; box-shadow:0 4px 14px rgba(196,154,108,.28);
    font-family:'DM Sans',sans-serif;
  }
  .al-btn-gold:hover { filter:brightness(1.08); transform:translateY(-1px); box-shadow:0 6px 20px rgba(196,154,108,.38); }
  .al-btn-gold:active { transform:translateY(0); }
  .al-btn-gold:disabled { opacity:.55; cursor:not-allowed; }
 
  .al-btn-outline {
    background:transparent; color:#7A6048;
    border:1.5px solid rgba(196,154,108,.32); border-radius:12px;
    padding:10px 20px; font-size:12.5px; font-weight:500;
    cursor:pointer; display:inline-flex; align-items:center; gap:7px;
    transition:all .2s; font-family:'DM Sans',sans-serif;
  }
  .al-btn-outline:hover { background:rgba(196,154,108,.07); border-color:rgba(196,154,108,.5); }
 
  .al-icon-btn {
    width:30px; height:30px; border-radius:9px; cursor:pointer;
    display:inline-flex; align-items:center; justify-content:center;
    transition:all .18s; border:1.5px solid transparent;
  }
  .al-icon-btn.edit  { background:rgba(59,130,246,.07);  color:#2563EB; border-color:rgba(59,130,246,.18); }
  .al-icon-btn.edit:hover  { background:rgba(59,130,246,.14); }
  .al-icon-btn.del   { background:rgba(220,60,60,.07);   color:#C03030; border-color:rgba(220,60,60,.18); }
  .al-icon-btn.del:hover   { background:rgba(220,60,60,.14); }
  .al-icon-btn.tog   { background:rgba(196,154,108,.08); color:#8A6030; border-color:rgba(196,154,108,.2); }
  .al-icon-btn.tog:hover   { background:rgba(196,154,108,.16); }
 
  /* Modal */
  .al-modal-overlay {
    position:fixed; inset:0; background:rgba(26,14,6,.55);
    backdrop-filter:blur(5px); display:flex; align-items:center;
    justify-content:center; z-index:100; padding:16px;
  }
  .al-modal {
    background:linear-gradient(160deg,#FEFCF8 0%,#F8F2E8 100%);
    border:1px solid rgba(196,154,108,.25); border-radius:24px;
    width:100%; max-width:600px; max-height:92vh;
    display:flex; flex-direction:column;
    box-shadow:0 30px 80px rgba(60,30,10,.22);
    animation:al-scaleIn .3s ease;
  }
  .al-modal-hd {
    padding:22px 26px 18px;
    border-bottom:1px solid rgba(196,154,108,.13);
    display:flex; align-items:center; justify-content:space-between;
    background:linear-gradient(90deg,rgba(196,154,108,.06),transparent);
    flex-shrink:0;
  }
  .al-modal-bd {
    padding:20px 26px; overflow-y:auto; flex:1;
    display:flex; flex-direction:column; gap:15px;
  }
  .al-modal-bd::-webkit-scrollbar { width:4px; }
  .al-modal-bd::-webkit-scrollbar-thumb { background:rgba(196,154,108,.18); border-radius:4px; }
  .al-modal-ft {
    padding:14px 26px 20px;
    border-top:1px solid rgba(196,154,108,.1);
    display:flex; justify-content:flex-end; gap:10px;
    background:rgba(196,154,108,.02); flex-shrink:0;
  }
 
  .al-label {
    display:block; font-size:10.5px; font-weight:700;
    letter-spacing:.09em; text-transform:uppercase; color:#9A7A5A; margin-bottom:5px;
  }
 
  /* Lang tab inside modal */
  .al-lang-tab-wrap {
    display:flex; gap:4px; background:rgba(196,154,108,.08);
    padding:4px; border-radius:12px; width:fit-content;
    border:1px solid rgba(196,154,108,.15);
  }
  .al-lang-tab {
    padding:5px 16px; border-radius:9px; font-size:11px;
    font-weight:700; letter-spacing:.07em; text-transform:uppercase;
    cursor:pointer; transition:all .2s; border:none;
    font-family:'DM Sans',sans-serif;
    background:transparent; color:#9A7A5A;
  }
  .al-lang-tab.active {
    background:linear-gradient(135deg,#C49A6C,#A87B4A);
    color:#FEF8EF;
    box-shadow:0 2px 8px rgba(196,154,108,.3);
  }
 
  /* Toggle switch */
  .al-toggle-wrap { display:flex; align-items:center; gap:10px; cursor:pointer; }
  .al-toggle { width:42px; height:24px; border-radius:12px; position:relative; transition:background .25s; }
  .al-toggle.on  { background:linear-gradient(90deg,#C49A6C,#A87B4A); }
  .al-toggle.off { background:rgba(0,0,0,.15); }
  .al-toggle::after {
    content:''; position:absolute; top:2px; left:2px;
    width:20px; height:20px; border-radius:50%; background:#fff;
    transition:transform .25s; box-shadow:0 1px 4px rgba(0,0,0,.18);
  }
  .al-toggle.on::after { transform:translateX(18px); }
 
  /* Page btn */
  .al-pg-btn {
    width:32px; height:32px; border-radius:9px;
    border:1.5px solid rgba(196,154,108,.2); background:#FEFCF9;
    color:#7A6048; font-size:12px; font-weight:500;
    cursor:pointer; transition:all .15s;
    display:inline-flex; align-items:center; justify-content:center;
    font-family:'DM Sans',sans-serif;
  }
  .al-pg-btn:hover:not(:disabled) { background:rgba(196,154,108,.1); border-color:rgba(196,154,108,.38); }
  .al-pg-btn.active { background:linear-gradient(135deg,#C49A6C,#A87B4A); border-color:transparent; color:#FEF8EF; box-shadow:0 3px 10px rgba(196,154,108,.3); }
  .al-pg-btn:disabled { opacity:.35; cursor:not-allowed; }
 
  /* Divider */
  .al-divider { height:1px; background:linear-gradient(90deg,transparent,rgba(196,154,108,.25),transparent); }
 
  /* Grid layout */
  .al-grid {
    display:grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap:20px;
  }
 
  /* Close btn */
  .al-close {
    width:30px; height:30px; border-radius:8px;
    background:rgba(196,154,108,.08); border:1px solid rgba(196,154,108,.18);
    color:#8A7060; cursor:pointer;
    display:flex; align-items:center; justify-content:center; transition:all .15s;
  }
  .al-close:hover { background:rgba(220,60,60,.08); border-color:rgba(220,60,60,.2); color:#C03030; }
 
  .al-spinner {
    width:32px; height:32px; border-radius:50%;
    border:2.5px solid rgba(196,154,108,.2);
    border-top-color:#C49A6C;
    animation:al-spin .8s linear infinite;
  }
 
  /* img preview */
  .al-img-preview {
    width:100%; height:110px; object-fit:cover;
    border-radius:10px; border:1px solid rgba(196,154,108,.2);
    margin-top:6px; display:block;
    animation:al-fadeIn .3s ease;
  }
 
  /* Error alert */
  .al-alert {
    background:rgba(220,60,60,.06); border:1px solid rgba(220,60,60,.18);
    border-radius:12px; padding:10px 14px;
    font-size:12.5px; color:#C03030;
    display:flex; align-items:center; gap:8px;
  }
 
  /* Author chip */
  .al-author {
    font-size:11px; color:#9A7A5A; display:inline-flex; align-items:center; gap:4px;
  }
 
  /* Rows selector */
  .al-rows-sel {
    background:#FEFCF9; border:1.5px solid rgba(196,154,108,.22); border-radius:10px;
    padding:7px 28px 7px 12px; font-size:12px; color:#5A3E20; outline:none;
    font-family:'DM Sans',sans-serif;
    appearance:none;
    background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23C49A6C' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
    background-repeat:no-repeat; background-position:right 9px center;
    cursor:pointer;
  }
  .al-rows-sel:focus { border-color:rgba(196,154,108,.6); box-shadow:0 0 0 3px rgba(196,154,108,.1); }
 
  /* Stagger delays */
  .d1{animation-delay:.04s} .d2{animation-delay:.08s} .d3{animation-delay:.12s}
  .d4{animation-delay:.16s} .d5{animation-delay:.20s} .d6{animation-delay:.24s}
  .d7{animation-delay:.28s} .d8{animation-delay:.32s} .d9{animation-delay:.36s}
  .d10{animation-delay:.40s}
 
  @media(max-width:640px){
    .al-grid { grid-template-columns:1fr; }
  }
`;
 
// ─── LANG TABS ───────────────────────────────────────────────────────────────
function LangTabs({ active, onChange }) {
  return (
    <div className="al-lang-tab-wrap">
      {[["vi","🇻🇳 Tiếng Việt"],["en","🇬🇧 English"]].map(([k,label])=>(
        <button key={k} type="button" className={`al-lang-tab ${active===k?"active":""}`} onClick={()=>onChange(k)}>
          {label}
        </button>
      ))}
    </div>
  );
}
 
// ─── MODAL ───────────────────────────────────────────────────────────────────
function Modal({ mode, blog, onClose, onSaved }) {
  const [form, setForm] = useState(
    mode === "edit"
      ? { ...emptyForm, ...blog, titleVi:blog.titleVi||blog.title||"", titleEn:blog.titleEn||"",
          summaryVi:blog.summaryVi||blog.summary||"", summaryEn:blog.summaryEn||"",
          contentVi:blog.contentVi||blog.content||"", contentEn:blog.contentEn||"" }
      : { ...emptyForm }
  );
  const [langTab, setLangTab] = useState("vi");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const titleViRef = useRef(null);
 
  useEffect(() => { titleViRef.current?.focus(); }, []);
 
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => {
      const updated = { ...prev, [name]: type==="checkbox" ? checked : value };
      if (name==="titleVi" && mode==="create") updated.slug = slugify(value);
      return updated;
    });
  };
 
  const handleSubmit = async () => {
    if (!form.titleVi.trim()||!form.contentVi.trim()||!form.titleEn.trim()||!form.contentEn.trim()||!form.authorName.trim()) {
      setError("Vui lòng điền đầy đủ tiêu đề, nội dung (cả 2 ngôn ngữ) và tên tác giả.");
      return;
    }
    setLoading(true); setError("");
    try {
      const method = mode==="edit" ? "PUT" : "POST";
      const url    = mode==="edit" ? `${API_BASE}/${blog.blogId}` : API_BASE;
      const res = await fetch(url, { method, headers:{"Content-Type":"application/json"}, body:JSON.stringify(form) });
      if (!res.ok) throw new Error("Lỗi khi lưu bài viết.");
      const saved = await res.json();
      onSaved(saved, mode);
    } catch(err) { setError(err.message); }
    finally { setLoading(false); }
  };
 
  return (
    <div className="al-modal-overlay al-fade-in">
      <div className="al-modal">
        {/* Header */}
        <div className="al-modal-hd">
          <div>
            <p style={{fontSize:9.5,fontWeight:700,letterSpacing:".18em",textTransform:"uppercase",color:"#C49A6C",marginBottom:3}}>CELESTÉ HOUSE</p>
            <h2 className="al-serif" style={{fontSize:21,fontWeight:600,color:"#2C1C0E",margin:0}}>
              {mode==="edit" ? "Chỉnh sửa bài viết" : "Thêm bài viết mới"}
            </h2>
          </div>
          <button className="al-close" onClick={onClose}><X size={14}/></button>
        </div>
 
        {/* Body */}
        <div className="al-modal-bd">
          {error && <div className="al-alert"><AlertTriangle size={14}/>{error}</div>}
 
          {/* Slug + Image */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
            <div>
              <label className="al-label">Slug</label>
              <input name="slug" value={form.slug} onChange={handleChange} className="al-input" placeholder="ten-bai-viet"/>
            </div>
            <div>
              <label className="al-label">Tác giả <span style={{color:"#C49A6C"}}>*</span></label>
              <input name="authorName" value={form.authorName} onChange={handleChange} className="al-input" placeholder="Tên tác giả..."/>
            </div>
          </div>
 
          <div>
            <label className="al-label">URL ảnh bìa</label>
            <input name="imgUrl" value={form.imgUrl} onChange={handleChange} className="al-input" placeholder="https://..."/>
            {form.imgUrl && (
              <img src={form.imgUrl} alt="preview" className="al-img-preview" onError={e=>e.target.style.display="none"}/>
            )}
          </div>
 
          <div className="al-divider"/>
 
          {/* Bilingual content */}
          <div>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
              <span style={{fontSize:10.5,fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",color:"#9A7A5A"}}>Nội dung song ngữ</span>
              <LangTabs active={langTab} onChange={setLangTab}/>
            </div>
            <div style={{background:"rgba(196,154,108,.04)",border:"1px solid rgba(196,154,108,.12)",borderRadius:14,padding:14,display:"flex",flexDirection:"column",gap:12}}>
              {langTab==="vi" ? (
                <>
                  <div>
                    <label className="al-label">Tiêu đề Tiếng Việt <span style={{color:"#C49A6C"}}>*</span></label>
                    <input ref={titleViRef} name="titleVi" value={form.titleVi} onChange={handleChange} className="al-input" placeholder="Nhập tiêu đề bằng tiếng Việt..."/>
                  </div>
                  <div>
                    <label className="al-label">Tóm tắt (VI)</label>
                    <textarea name="summaryVi" value={form.summaryVi} onChange={handleChange} rows={2} className="al-input" placeholder="Mô tả ngắn bằng tiếng Việt..."/>
                  </div>
                  <div>
                    <label className="al-label">Nội dung (VI) <span style={{color:"#C49A6C"}}>*</span></label>
                    <textarea name="contentVi" value={form.contentVi} onChange={handleChange} rows={6} className="al-input" placeholder="Nội dung chi tiết bằng tiếng Việt..."/>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="al-label">Title (English) <span style={{color:"#C49A6C"}}>*</span></label>
                    <input name="titleEn" value={form.titleEn} onChange={handleChange} className="al-input" placeholder="Enter title in English..."/>
                  </div>
                  <div>
                    <label className="al-label">Summary (EN)</label>
                    <textarea name="summaryEn" value={form.summaryEn} onChange={handleChange} rows={2} className="al-input" placeholder="Short description in English..."/>
                  </div>
                  <div>
                    <label className="al-label">Content (EN) <span style={{color:"#C49A6C"}}>*</span></label>
                    <textarea name="contentEn" value={form.contentEn} onChange={handleChange} rows={6} className="al-input" placeholder="Detailed content in English..."/>
                  </div>
                </>
              )}
            </div>
          </div>
 
          {/* Active toggle */}
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",background:"rgba(196,154,108,.04)",border:"1px solid rgba(196,154,108,.1)",borderRadius:12,padding:"10px 14px"}}>
            <span style={{fontSize:12.5,fontWeight:500,color:"#5A3E20"}}>
              {form.active ? "Hiển thị trên website" : "Ẩn khỏi website"}
            </span>
            <label className="al-toggle-wrap" onClick={()=>setForm(p=>({...p,active:!p.active}))}>
              <input type="checkbox" name="active" checked={form.active} onChange={handleChange} className="sr-only"/>
              <div className={`al-toggle ${form.active?"on":"off"}`}/>
            </label>
          </div>
        </div>
 
        {/* Footer */}
        <div className="al-modal-ft">
          <button className="al-btn-outline" onClick={onClose}>Hủy bỏ</button>
          <button className="al-btn-gold" onClick={handleSubmit} disabled={loading}>
            {loading ? "Đang lưu..." : mode==="edit" ? "Lưu thay đổi" : "Đăng bài"}
          </button>
        </div>
      </div>
    </div>
  );
}
 
// ─── ARTICLE CARD ─────────────────────────────────────────────────────────────
function ArticleCard({ article, onEdit, onDelete, onToggle, delay }) {
  const getDisplayTitle = a => a.titleVi||a.title||"(Chưa có tiêu đề)";
 
  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("vi-VN",{day:"2-digit",month:"short",year:"numeric"});
  };
 
  return (
    <div className={`al-card al-fade-up ${!article.active?"inactive":""} d${Math.min(delay,10)}`}
      style={{display:"flex",flexDirection:"column"}}>
 
      {/* Thumbnail */}
      <div className="al-thumb-wrap">
        {article.imgUrl
          ? <img src={article.imgUrl} alt={getDisplayTitle(article)} className="al-thumb"
              onError={e=>{e.target.style.display="none";e.target.nextSibling.style.display="flex";}}/>
          : null
        }
        <div className="al-thumb-placeholder" style={{display:article.imgUrl?"none":"flex"}}>
          <BookOpen size={32}/>
        </div>
        <span className={`al-ribbon ${article.active?"show":"hide"}`}>
          {article.active ? "Hiển thị" : "Ẩn"}
        </span>
      </div>
 
      {/* Body */}
      <div style={{padding:"14px 16px",flex:1,display:"flex",flexDirection:"column",gap:8}}>
        {/* Lang pills */}
        <div style={{display:"flex",gap:5}}>
          <span className={`al-lang ${article.titleVi?"vi":"off"}`}><Globe size={9}/>VI</span>
          <span className={`al-lang ${article.titleEn?"en":"off"}`}><Globe size={9}/>EN</span>
          <span style={{marginLeft:"auto",fontSize:10.5,color:"#B5A080"}}>#{article.blogId}</span>
        </div>
 
        {/* Title */}
        <div>
          <h3 className="al-serif" style={{fontSize:16.5,fontWeight:600,color:"#2C1C0E",lineHeight:1.35,margin:0,
            display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"}}>
            {getDisplayTitle(article)}
          </h3>
          {article.titleEn && (
            <p style={{fontSize:11.5,color:"#9A8068",marginTop:2,fontStyle:"italic",
              display:"-webkit-box",WebkitLineClamp:1,WebkitBoxOrient:"vertical",overflow:"hidden"}}>
              {article.titleEn}
            </p>
          )}
        </div>
 
        {/* Summary */}
        {(article.summaryVi||article.summary) && (
          <p style={{fontSize:12,color:"#7A6048",lineHeight:1.6,
            display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden",margin:0}}>
            {article.summaryVi||article.summary}
          </p>
        )}
 
        {/* Slug */}
        <p style={{fontSize:10.5,color:"#C49A6C",fontFamily:"monospace",marginTop:"auto",paddingTop:6,
          borderTop:"1px solid rgba(196,154,108,.1)",wordBreak:"break-all"}}>
          /{article.slug||"—"}
        </p>
      </div>
 
      {/* Footer */}
      <div style={{
        padding:"10px 16px",
        borderTop:"1px solid rgba(196,154,108,.1)",
        background:"rgba(196,154,108,.03)",
        display:"flex",alignItems:"center",justifyContent:"space-between"
      }}>
        <div style={{display:"flex",flexDirection:"column",gap:1}}>
          <span className="al-author">
            <span style={{width:18,height:18,borderRadius:"50%",background:"linear-gradient(135deg,#C49A6C,#A87B4A)",
              color:"#FEF8EF",fontSize:9,fontWeight:700,display:"inline-flex",alignItems:"center",justifyContent:"center"}}>
              {(article.authorName||"?")[0].toUpperCase()}
            </span>
            {article.authorName||"—"}
          </span>
          <span style={{fontSize:10,color:"#C0A880"}}>{formatDate(article.createdAt)}</span>
        </div>
        <div style={{display:"flex",gap:5}}>
          <button className="al-icon-btn tog" title={article.active?"Ẩn bài":"Hiện bài"} onClick={()=>onToggle(article)}>
            {article.active ? <EyeOff size={13}/> : <Eye size={13}/>}
          </button>
          <button className="al-icon-btn edit" title="Chỉnh sửa" onClick={()=>onEdit(article)}>
            <Pencil size={13}/>
          </button>
          <button className="al-icon-btn del" title="Xóa" onClick={()=>onDelete(article.blogId)}>
            <Trash2 size={13}/>
          </button>
        </div>
      </div>
    </div>
  );
}
 
// ─── MAIN ─────────────────────────────────────────────────────────────────────
function ArticleList() {
  const [articles, setArticles]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(6);
  const [currentPage, setCurrentPage] = useState(1);
  const [modal, setModal]           = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
 
  // ── FETCH ──────────────────────────────────────────────────────────────────
  const fetchArticles = async () => {
    setLoading(true); setFetchError("");
    try {
      const res = await fetch(API_BASE);
      if (!res.ok) throw new Error("Không thể kết nối server.");
      const data = await res.json();
      setArticles(data);
    } catch(err) { setFetchError(err.message); }
    finally { setLoading(false); }
  };
 
  useEffect(() => { fetchArticles(); }, []);
 
  const pageCount = Math.max(1, Math.ceil(articles.length / rowsPerPage));
  const startIndex = (currentPage-1)*rowsPerPage;
  const paginatedArticles = articles.slice(startIndex, startIndex+rowsPerPage);
 
  const handleRowsPerPageChange = (e) => { setRowsPerPage(Number(e.target.value)); setCurrentPage(1); };
 
  // ── TOGGLE ACTIVE ──────────────────────────────────────────────────────────
  const handleToggleActive = async (blog) => {
    try {
      const updated = { ...blog, active:!blog.active };
      const res = await fetch(`${API_BASE}/${blog.blogId}`,{
        method:"PUT", headers:{"Content-Type":"application/json"}, body:JSON.stringify(updated),
      });
      if (!res.ok) throw new Error();
      const saved = await res.json();
      setArticles(prev => prev.map(a => a.blogId===saved.blogId ? saved : a));
    } catch { alert("Lỗi khi cập nhật trạng thái."); }
  };
 
  // ── DELETE ─────────────────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/${id}`, { method:"DELETE" });
      if (!res.ok) throw new Error();
      setArticles(prev => prev.filter(a => a.blogId!==id));
      setDeleteConfirm(null); setCurrentPage(1);
    } catch { alert("Lỗi khi xóa bài viết."); }
  };
 
  // ── SAVED ──────────────────────────────────────────────────────────────────
  const handleSaved = (saved, mode) => {
    if (mode==="edit") setArticles(prev => prev.map(a => a.blogId===saved.blogId ? saved : a));
    else setArticles(prev => [saved, ...prev]);
    setModal(null);
  };
 
  // ── STATS ──────────────────────────────────────────────────────────────────
  const totalVisible = articles.filter(a=>a.active).length;
  const totalHidden  = articles.filter(a=>!a.active).length;
  const totalBilingual = articles.filter(a=>a.titleVi&&a.titleEn).length;
 
  return (
    <div className="al-root" style={{minHeight:"100vh",background:"linear-gradient(160deg,#FDFAF4,#F5EDDF)",padding:"28px 24px"}}>
      <style>{STYLES}</style>
 
      {/* ── MODALS ──────────────────────────────────────────────────────────── */}
      {modal && (
        <Modal mode={modal.mode} blog={modal.blog} onClose={()=>setModal(null)} onSaved={handleSaved}/>
      )}
 
      {deleteConfirm && (
        <div className="al-modal-overlay al-fade-in">
          <div style={{
            background:"linear-gradient(160deg,#FEFCF8,#F8F2E8)",
            border:"1px solid rgba(196,154,108,.25)",borderRadius:20,
            width:"100%",maxWidth:360,padding:"28px 26px",textAlign:"center",
            boxShadow:"0 30px 80px rgba(60,30,10,.22)",animation:"al-scaleIn .3s ease"
          }}>
            <div style={{width:52,height:52,borderRadius:"50%",background:"rgba(220,60,60,.08)",
              border:"1px solid rgba(220,60,60,.2)",display:"flex",alignItems:"center",
              justifyContent:"center",margin:"0 auto 14px",color:"#C03030"}}>
              <Trash2 size={20}/>
            </div>
            <h3 className="al-serif" style={{fontSize:19,fontWeight:600,color:"#2C1C0E",marginBottom:7}}>Xác nhận xóa</h3>
            <p style={{fontSize:12.5,color:"#7A6048",marginBottom:22,lineHeight:1.6}}>
              Bạn có chắc muốn xóa bài viết này? Hành động này không thể hoàn tác.
            </p>
            <div style={{display:"flex",justifyContent:"center",gap:10}}>
              <button className="al-btn-outline" onClick={()=>setDeleteConfirm(null)}>Hủy</button>
              <button
                onClick={()=>handleDelete(deleteConfirm)}
                style={{padding:"10px 22px",borderRadius:12,border:"none",
                  background:"linear-gradient(135deg,#DC3C3C,#B02020)",color:"#fff",
                  fontWeight:600,fontSize:12.5,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",
                  boxShadow:"0 4px 14px rgba(220,60,60,.3)"}}>
                Xóa bài viết
              </button>
            </div>
          </div>
        </div>
      )}
 
      <div style={{maxWidth:1400,margin:"0 auto"}}>
 
        {/* ── HEADER ────────────────────────────────────────────────────────── */}
        <div className="al-fade-up" style={{marginBottom:28}}>
          <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",flexWrap:"wrap",gap:16}}>
            <div>
              <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:4}}>
                <Sparkles size={12} style={{color:"#C49A6C"}}/>
                <span style={{fontSize:10,fontWeight:700,letterSpacing:".18em",textTransform:"uppercase",color:"#B5A080"}}>
                  CELESTÉ HOUSE
                </span>
              </div>
              <h1 className="al-serif" style={{fontSize:30,fontWeight:600,color:"#2C1C0E",margin:0,lineHeight:1.1}}>
                Bài Viết Ẩm Thực
              </h1>
              <p style={{fontSize:12.5,color:"#9A8068",marginTop:5}}>
                Quản lý nội dung blog và bài viết song ngữ của nhà hàng
              </p>
            </div>
            <button className="al-btn-gold" onClick={()=>setModal({mode:"create"})}
              style={{animation:"al-pulse-gold 2.5s infinite"}}>
              <Plus size={15}/> Thêm bài viết
            </button>
          </div>
 
          {/* Stat chips */}
          <div style={{display:"flex",gap:10,marginTop:16,flexWrap:"wrap"}}>
            {[
              {label:`${articles.length} bài viết`,bg:"rgba(196,154,108,.09)",color:"#7A5A2A",border:"rgba(196,154,108,.22)"},
              {label:`${totalVisible} đang hiện`,bg:"rgba(40,180,80,.07)",color:"#1A8040",border:"rgba(40,180,80,.2)"},
              {label:`${totalHidden} đang ẩn`,bg:"rgba(0,0,0,.05)",color:"#666",border:"rgba(0,0,0,.1)"},
              {label:`${totalBilingual} song ngữ`,bg:"rgba(59,130,246,.07)",color:"#2563EB",border:"rgba(59,130,246,.18)"},
            ].map((c,i)=>(
              <span key={i} style={{display:"inline-flex",alignItems:"center",gap:6,padding:"5px 14px",
                borderRadius:20,fontSize:12,fontWeight:600,background:c.bg,color:c.color,
                border:`1px solid ${c.border}`}}>
                <span style={{width:6,height:6,borderRadius:"50%",background:c.color,display:"inline-block"}}/>
                {c.label}
              </span>
            ))}
          </div>
        </div>
 
        {/* ── TOOLBAR ───────────────────────────────────────────────────────── */}
        <div className="al-card al-fade-up" style={{padding:"14px 18px",marginBottom:20,animationDelay:".05s",
          display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:10}}>
          <span style={{fontSize:12.5,color:"#9A8068"}}>
            {loading ? "Đang tải..." : `Hiển thị ${paginatedArticles.length} / ${articles.length} bài viết`}
          </span>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <span style={{fontSize:12,color:"#9A8068"}}>Mỗi trang</span>
            <select value={rowsPerPage} onChange={handleRowsPerPageChange} className="al-rows-sel">
              {[3,6,9,12].map(n=><option key={n} value={n}>{n} bài</option>)}
            </select>
            <button className="al-icon-btn tog" title="Làm mới" onClick={fetchArticles} style={{width:34,height:34}}>
              <RefreshCw size={13}/>
            </button>
          </div>
        </div>
 
        {/* ── ERROR ─────────────────────────────────────────────────────────── */}
        {fetchError && (
          <div className="al-alert al-fade-up" style={{marginBottom:20}}>
            <AlertTriangle size={14}/>
            {fetchError} —
            <button onClick={fetchArticles} style={{fontWeight:700,textDecoration:"underline",background:"none",border:"none",color:"inherit",cursor:"pointer"}}>
              Thử lại
            </button>
          </div>
        )}
 
        {/* ── GRID ──────────────────────────────────────────────────────────── */}
        {loading ? (
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:12,padding:"64px 0"}}>
            <div className="al-spinner"/>
            <p style={{fontSize:13,color:"#B5A080"}}>Đang tải bài viết...</p>
          </div>
        ) : paginatedArticles.length===0 ? (
          <div style={{textAlign:"center",padding:"64px 0",color:"#B5A080"}}>
            <BookOpen size={36} style={{margin:"0 auto 14px",opacity:.3}}/>
            <p style={{fontSize:14,fontWeight:500}}>Chưa có bài viết nào</p>
            <p style={{fontSize:12,marginTop:4,opacity:.7}}>Hãy thêm bài viết đầu tiên của nhà hàng!</p>
          </div>
        ) : (
          <div className="al-grid">
            {paginatedArticles.map((article, idx) => (
              <ArticleCard
                key={article.blogId}
                article={article}
                delay={idx+1}
                onEdit={a=>setModal({mode:"edit",blog:a})}
                onDelete={id=>setDeleteConfirm(id)}
                onToggle={handleToggleActive}
              />
            ))}
          </div>
        )}
 
        {/* ── PAGINATION ────────────────────────────────────────────────────── */}
        {pageCount>1 && (
          <div className="al-fade-up" style={{display:"flex",justifyContent:"space-between",alignItems:"center",
            marginTop:24,padding:"14px 18px",background:"rgba(196,154,108,.03)",
            border:"1px solid rgba(196,154,108,.1)",borderRadius:16,animationDelay:".15s"}}>
            <span style={{fontSize:12,color:"#9A8068"}}>
              Trang <strong style={{color:"#5A3E20"}}>{currentPage}</strong> / <strong style={{color:"#5A3E20"}}>{pageCount}</strong>
            </span>
            <div style={{display:"flex",gap:5,alignItems:"center"}}>
              <button className="al-pg-btn" disabled={currentPage===1} onClick={()=>setCurrentPage(p=>Math.max(1,p-1))}>
                <ChevronLeft size={13}/>
              </button>
              {Array.from({length:pageCount},(_,i)=>i+1).map(p=>(
                <button key={p} className={`al-pg-btn ${currentPage===p?"active":""}`} onClick={()=>setCurrentPage(p)}>{p}</button>
              ))}
              <button className="al-pg-btn" disabled={currentPage===pageCount} onClick={()=>setCurrentPage(p=>Math.min(pageCount,p+1))}>
                <ChevronRight size={13}/>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
 
export default ArticleList;