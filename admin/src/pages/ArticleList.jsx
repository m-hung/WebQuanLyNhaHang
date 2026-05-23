import { useState, useEffect, useRef } from "react";

const API_BASE = "http://localhost:8080/api/blogs";

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
  title: "",
  slug: "",
  imgUrl: "",
  summary: "",
  content: "",
  authorName: "",
  active: true,
};

function Modal({ mode, blog, onClose, onSaved }) {
  const [form, setForm] = useState(mode === "edit" ? { ...blog } : { ...emptyForm });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const titleRef = useRef(null);

  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => {
      const updated = { ...prev, [name]: type === "checkbox" ? checked : value };
      if (name === "title" && mode === "create") {
        updated.slug = slugify(value);
      }
      return updated;
    });
  };

  const handleSubmit = async () => {
    if (!form.title.trim() || !form.content.trim() || !form.authorName.trim()) {
      setError("Vui lòng điền đầy đủ tiêu đề, nội dung và tác giả.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const method = mode === "edit" ? "PUT" : "POST";
      const url = mode === "edit" ? `${API_BASE}/${blog.blogId}` : API_BASE;
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Lỗi khi lưu bài viết.");
      const saved = await res.json();
      onSaved(saved, mode);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-2xl rounded-3xl bg-white shadow-2xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-200">
          <h2 className="text-xl font-semibold text-slate-900">
            {mode === "edit" ? "Chỉnh sửa bài viết" : "Thêm bài viết mới"}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 text-2xl leading-none">&times;</button>
        </div>

        <div className="overflow-y-auto px-6 py-4 space-y-4">
          {error && (
            <div className="rounded-2xl bg-rose-50 border border-rose-200 px-4 py-3 text-sm text-rose-700">{error}</div>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-600 mb-1">Tiêu đề *</label>
              <input ref={titleRef} name="title" value={form.title} onChange={handleChange}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-500"
                placeholder="Nhập tiêu đề bài viết..." />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-600 mb-1">Slug (tự động)</label>
              <input name="slug" value={form.slug} onChange={handleChange}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-slate-400 focus:bg-white"
                placeholder="ten-bai-viet" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-600 mb-1">URL ảnh bìa</label>
              <input name="imgUrl" value={form.imgUrl} onChange={handleChange}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-500"
                placeholder="https://..." />
              {form.imgUrl && (
                <img src={form.imgUrl} alt="preview"
                  className="mt-2 h-24 w-full object-cover rounded-2xl border border-slate-200"
                  onError={(e) => { e.target.style.display = "none"; }} />
              )}
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-600 mb-1">Tóm tắt</label>
              <textarea name="summary" value={form.summary} onChange={handleChange} rows={2}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-500 resize-none"
                placeholder="Mô tả ngắn về bài viết..." />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-600 mb-1">Nội dung *</label>
              <textarea name="content" value={form.content} onChange={handleChange} rows={6}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-500 resize-none"
                placeholder="Nội dung chi tiết bài viết..." />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Tác giả *</label>
              <input name="authorName" value={form.authorName} onChange={handleChange}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-500"
                placeholder="Tên tác giả..." />
            </div>
            <div className="flex items-center gap-3 pt-5">
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" name="active" checked={form.active} onChange={handleChange} className="sr-only peer" />
                <div className="w-11 h-6 bg-slate-300 rounded-full peer peer-checked:bg-emerald-500 transition-colors after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5"></div>
              </label>
              <span className="text-sm font-medium text-slate-700">
                {form.active ? "Hiển thị trên web" : "Ẩn khỏi web"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-200">
          <button onClick={onClose}
            className="rounded-2xl border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition">
            Hủy
          </button>
          <button onClick={handleSubmit} disabled={loading}
            className="rounded-2xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-700 transition disabled:opacity-50">
            {loading ? "Đang lưu..." : mode === "edit" ? "Lưu thay đổi" : "Đăng bài"}
          </button>
        </div>
      </div>
    </div>
  );
}

function ArticleList() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [modal, setModal] = useState(null); // null | { mode: 'create' | 'edit', blog?: Blog }
  const [deleteConfirm, setDeleteConfirm] = useState(null); // id to delete

  const fetchArticles = async () => {
    setLoading(true);
    setFetchError("");
    try {
      const res = await fetch(API_BASE);
      if (!res.ok) throw new Error("Không thể kết nối server.");
      const data = await res.json();
      setArticles(data);
    } catch (err) {
      setFetchError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const pageCount = Math.max(1, Math.ceil(articles.length / rowsPerPage));
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedArticles = articles.slice(startIndex, startIndex + rowsPerPage);

  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleToggleActive = async (blog) => {
    try {
      const updated = { ...blog, active: !blog.active };
      const res = await fetch(`${API_BASE}/${blog.blogId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      if (!res.ok) throw new Error();
      const saved = await res.json();
      setArticles((prev) => prev.map((a) => (a.blogId === saved.blogId ? saved : a)));
    } catch {
      alert("Lỗi khi cập nhật trạng thái.");
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setArticles((prev) => prev.filter((a) => a.blogId !== id));
      setDeleteConfirm(null);
      setCurrentPage(1);
    } catch {
      alert("Lỗi khi xóa bài viết.");
    }
  };

  const handleSaved = (saved, mode) => {
    if (mode === "edit") {
      setArticles((prev) => prev.map((a) => (a.blogId === saved.blogId ? saved : a)));
    } else {
      setArticles((prev) => [saved, ...prev]);
    }
    setModal(null);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("vi-VN");
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      {modal && (
        <Modal
          mode={modal.mode}
          blog={modal.blog}
          onClose={() => setModal(null)}
          onSaved={handleSaved}
        />
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-3xl bg-white shadow-2xl p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Xác nhận xóa</h3>
            <p className="text-sm text-slate-600 mb-6">Bạn có chắc muốn xóa bài viết này? Hành động này không thể hoàn tác.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteConfirm(null)}
                className="rounded-2xl border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition">
                Hủy
              </button>
              <button onClick={() => handleDelete(deleteConfirm)}
                className="rounded-2xl bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-rose-700 transition">
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-[1400px] space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 rounded-3xl bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Bảng điều khiển</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900">Bài viết ẩm thực</h1>
          </div>
          <button
            onClick={() => setModal({ mode: "create" })}
            className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700">
            + Thêm bài viết mới
          </button>
        </div>

        {/* Table */}
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-slate-600">
              {loading ? "Đang tải..." : `${articles.length} bài viết`}
            </div>
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-slate-700">Số dòng mỗi trang</label>
              <select value={rowsPerPage} onChange={handleRowsPerPageChange}
                className="rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:bg-white">
                <option value={5}>5 dòng</option>
                <option value={10}>10 dòng</option>
                <option value={25}>25 dòng</option>
              </select>
            </div>
          </div>

          {fetchError && (
            <div className="mt-6 rounded-2xl bg-rose-50 border border-rose-200 px-4 py-3 text-sm text-rose-700">
              ⚠ {fetchError} —{" "}
              <button onClick={fetchArticles} className="underline font-semibold">Thử lại</button>
            </div>
          )}

          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full table-auto border-separate border-spacing-y-3 text-left text-sm text-slate-700">
              <thead>
                <tr className="bg-slate-50 text-slate-600">
                  <th className="rounded-tl-3xl px-4 py-3">ID</th>
                  <th className="px-4 py-3">Ảnh</th>
                  <th className="px-4 py-3">Tiêu đề</th>
                  <th className="px-4 py-3">Tóm tắt</th>
                  <th className="px-4 py-3">Tác giả</th>
                  <th className="px-4 py-3">Ngày đăng</th>
                  <th className="px-4 py-3">Trạng thái</th>
                  <th className="rounded-tr-3xl px-4 py-3">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="8" className="px-4 py-12 text-center text-slate-400">
                      <div className="flex flex-col items-center gap-2">
                        <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-slate-700" />
                        <span className="text-sm">Đang tải dữ liệu...</span>
                      </div>
                    </td>
                  </tr>
                ) : paginatedArticles.length > 0 ? (
                  paginatedArticles.map((article) => (
                    <tr key={article.blogId}
                      className={`rounded-3xl bg-white shadow-sm transition ${
                        !article.active ? "opacity-60 bg-slate-50" : "hover:bg-slate-50"
                      }`}>
                      <td className="px-4 py-4 font-medium text-slate-500">#{article.blogId}</td>
                      <td className="px-4 py-4">
                        {article.imgUrl ? (
                          <img src={article.imgUrl} alt={article.title}
                            className="h-14 w-14 rounded-2xl object-cover border border-slate-200"
                            onError={(e) => { e.target.src = "https://via.placeholder.com/56?text=?"; }} />
                        ) : (
                          <div className="h-14 w-14 rounded-2xl bg-slate-200 flex items-center justify-center text-slate-400 text-xs">No img</div>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <div className="font-semibold text-slate-900">{article.title}</div>
                        <div className="text-xs text-slate-400 mt-0.5">/{article.slug}</div>
                      </td>
                      <td className="px-4 py-4 text-slate-600 max-w-xs">
                        <div className="line-clamp-2">{article.summary || "-"}</div>
                      </td>
                      <td className="px-4 py-4 text-slate-600 whitespace-nowrap">{article.authorName}</td>
                      <td className="px-4 py-4 text-slate-600 whitespace-nowrap">{formatDate(article.createdAt)}</td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                          article.active
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-slate-100 text-slate-500"
                        }`}>
                          {article.active ? "Hiển thị" : "Ẩn"}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => handleToggleActive(article)}
                            className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                              article.active
                                ? "border-amber-400 bg-amber-50 text-amber-700 hover:bg-amber-100"
                                : "border-emerald-400 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                            }`}>
                            {article.active ? "Ẩn" : "Hiện"}
                          </button>
                          <button
                            onClick={() => setModal({ mode: "edit", blog: article })}
                            className="rounded-full border border-sky-400 bg-sky-50 px-3 py-1.5 text-xs font-semibold text-sky-700 hover:bg-sky-100 transition">
                            Sửa
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(article.blogId)}
                            className="rounded-full border border-rose-400 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-100 transition">
                            Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="px-4 py-12 text-center text-slate-400">
                      Chưa có bài viết nào. Hãy thêm bài viết đầu tiên!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-500">
              Hiển thị {paginatedArticles.length} trên {articles.length} bài viết
            </p>
            <div className="flex items-center gap-2">
              <button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1}
                className="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 transition disabled:cursor-not-allowed disabled:opacity-50 hover:border-slate-400">
                Trước
              </button>
              <div className="flex items-center gap-1 text-sm">
                {Array.from({ length: pageCount }, (_, i) => (
                  <button key={i} onClick={() => setCurrentPage(i + 1)}
                    className={`h-9 min-w-[36px] rounded-2xl px-3 transition ${
                      currentPage === i + 1 ? "bg-slate-900 text-white" : "bg-white text-slate-700 hover:bg-slate-100"
                    }`}>
                    {i + 1}
                  </button>
                ))}
              </div>
              <button onClick={() => setCurrentPage(Math.min(pageCount, currentPage + 1))} disabled={currentPage === pageCount}
                className="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 transition disabled:cursor-not-allowed disabled:opacity-50 hover:border-slate-400">
                Tiếp
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ArticleList;
