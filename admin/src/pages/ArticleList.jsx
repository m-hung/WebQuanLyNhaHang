import { useState } from "react";

const initialArticles = [
  {
    id: 1,
    thumbnail: "https://via.placeholder.com/64?text=Ẩm+thực",
    title: "Khuyến mãi khai trương",
    summary: "Ưu đãi giảm giá 20% cho thực đơn tối trong tuần đầu tiên.",
    content:
      "Nhân dịp khai trương nhà hàng mới tại trung tâm thành phố, chúng tôi mang đến chương trình ưu đãi hấp dẫn cho thực khách đặt trước bàn ăn tối.",
    author: "Nguyễn An",
    publishDate: "2026-05-18",
    visible: true,
  },
  {
    id: 2,
    thumbnail: "https://via.placeholder.com/64?text=Sushi",
    title: "Top 5 công thức sushi",
    summary: "Hướng dẫn cách làm sushi ngon chuẩn vị Nhật tại gia.",
    content:
      "Từ cơm sushi dẻo mềm đến cá hồi tươi ngon, bài viết giới thiệu 5 công thức dễ thực hiện cho bữa tối phong cách nhà hàng.",
    author: "Pham Bảo",
    publishDate: "2026-05-10",
    visible: true,
  },
  {
    id: 3,
    thumbnail: "https://via.placeholder.com/64?text=Ưu+đãi",
    title: "Voucher cuối tuần",
    summary: "Giảm 15% cho đặt bàn cuối tuần và tặng miễn phí nước ép.",
    content:
      "Đặt bàn trước vào cuối tuần để nhận voucher ưu đãi và trải nghiệm thực đơn mùa hè độc đáo của nhà hàng.",
    author: "Mai Linh",
    publishDate: "2026-05-12",
    visible: false,
  },
  {
    id: 4,
    thumbnail: "https://via.placeholder.com/64?text=Ẩm+thực",
    title: "Món ngon mùa hè",
    summary: "Giới thiệu thực đơn giải nhiệt với hải sản và salad tươi mát.",
    content:
      "Bài viết đề xuất những món ăn nhẹ nhàng, tươi mát phù hợp cho tiết trời oi bức, kèm theo gợi ý thức uống phục vụ cùng.",
    author: "Hồng Nhung",
    publishDate: "2026-05-08",
    visible: true,
  },
  {
    id: 5,
    thumbnail: "https://via.placeholder.com/64?text=Chef",
    title: "Bí quyết nước sốt đặc biệt",
    summary: "Cách pha chế nước sốt thần thánh cho món steak và hải sản.",
    content:
      "Khám phá công thức nước sốt từ bếp trưởng giúp tăng hương vị món ăn, phù hợp với cả thịt bò và hải sản.",
    author: "Trần Huy",
    publishDate: "2026-04-30",
    visible: true,
  },
];

function ArticleList() {
  const [articles, setArticles] = useState(initialArticles);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  const pageCount = Math.max(1, Math.ceil(articles.length / rowsPerPage));
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedArticles = articles.slice(
    startIndex,
    startIndex + rowsPerPage,
  );

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(Number(event.target.value));
    setCurrentPage(1);
  };

  const toggleVisibility = (id, visible) => {
    setArticles((prev) =>
      prev.map((article) =>
        article.id === id ? { ...article, visible } : article,
      ),
    );
  };

  const handleDelete = (id) => {
    setArticles((prev) => prev.filter((article) => article.id !== id));
    setCurrentPage(1);
  };

  const goToPage = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-[1400px] space-y-6">
        <div className="flex flex-col gap-4 rounded-3xl bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">
              Bảng điều khiển
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900">
              Bài viết ẩm thực
            </h1>
          </div>
          <button className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700">
            + Thêm bài viết mới
          </button>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-slate-600">Hiển thị</div>
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-slate-700">
                Số dòng mỗi trang
              </label>
              <select
                value={rowsPerPage}
                onChange={handleRowsPerPageChange}
                className="rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:bg-white"
              >
                <option value={5}>5 dòng</option>
                <option value={10}>10 dòng</option>
                <option value={25}>25 dòng</option>
              </select>
            </div>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full table-auto border-separate border-spacing-y-3 text-left text-sm text-slate-700">
              <thead>
                <tr className="bg-slate-50 text-slate-600">
                  <th className="rounded-tl-3xl px-4 py-3">ID</th>
                  <th className="px-4 py-3">Ảnh</th>
                  <th className="px-4 py-3">Tiêu đề</th>
                  <th className="px-4 py-3">Tóm tắt</th>
                  <th className="px-4 py-3">Nội dung</th>
                  <th className="px-4 py-3">Tác giả</th>
                  <th className="px-4 py-3">Ngày đăng</th>
                  <th className="rounded-tr-3xl px-4 py-3">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {paginatedArticles.length > 0 ? (
                  paginatedArticles.map((article) => (
                    <tr
                      key={article.id}
                      className={`rounded-3xl bg-white shadow-sm transition ${
                        !article.visible
                          ? "opacity-70 bg-slate-100"
                          : "hover:bg-slate-50"
                      }`}
                    >
                      <td className="px-4 py-4 font-medium text-slate-900">
                        {article.id}
                      </td>
                      <td className="px-4 py-4">
                        <img
                          src={article.thumbnail}
                          alt={article.title}
                          className="h-16 w-16 rounded-3xl object-cover"
                        />
                      </td>
                      <td className="px-4 py-4 font-semibold text-slate-900">
                        {article.title}
                      </td>
                      <td className="px-4 py-4 text-slate-600">
                        {article.summary}
                      </td>
                      <td className="px-4 py-4 text-slate-600">
                        {article.content.length > 80
                          ? `${article.content.substring(0, 80)}...`
                          : article.content}
                      </td>
                      <td className="px-4 py-4 text-slate-600">
                        {article.author}
                      </td>
                      <td className="px-4 py-4 text-slate-600">
                        {article.publishDate}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => toggleVisibility(article.id, true)}
                            className={`rounded-full border px-3 py-2 text-xs font-semibold transition ${
                              article.visible
                                ? "border-slate-300 bg-slate-100 text-slate-700"
                                : "border-emerald-500 bg-emerald-100 text-emerald-700"
                            }`}
                          >
                            Hiển thị
                          </button>
                          <button
                            onClick={() => toggleVisibility(article.id, false)}
                            className={`rounded-full border px-3 py-2 text-xs font-semibold transition ${
                              !article.visible
                                ? "border-slate-300 bg-slate-100 text-slate-700"
                                : "border-amber-500 bg-amber-100 text-amber-700"
                            }`}
                          >
                            Ẩn
                          </button>
                          <button
                            onClick={() => handleDelete(article.id)}
                            className="rounded-full border border-rose-500 bg-rose-100 px-3 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-200"
                          >
                            Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="8"
                      className="px-4 py-8 text-center text-slate-500"
                    >
                      Không có bài viết nào.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-500">
              Hiển thị {paginatedArticles.length} trên {articles.length} bài
              viết
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => goToPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 transition disabled:cursor-not-allowed disabled:opacity-50 hover:border-slate-400"
              >
                Trước
              </button>
              <div className="flex items-center gap-1 text-sm text-slate-700">
                {Array.from({ length: pageCount }, (_, index) => (
                  <button
                    key={index}
                    onClick={() => goToPage(index + 1)}
                    className={`h-10 min-w-[38px] rounded-2xl px-3 transition ${
                      currentPage === index + 1
                        ? "bg-slate-900 text-white"
                        : "bg-white text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
              <button
                onClick={() => goToPage(Math.min(pageCount, currentPage + 1))}
                disabled={currentPage === pageCount}
                className="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 transition disabled:cursor-not-allowed disabled:opacity-50 hover:border-slate-400"
              >
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
