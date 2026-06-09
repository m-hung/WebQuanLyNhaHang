const IS_LOCAL = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
// Điền link Render thật của bạn vào chỗ trống phía dưới
const BACKEND_BASE = IS_LOCAL ? "http://localhost:8080" : "https://webquanlynhahang.onrender.com"; 

const API_URL = `${BACKEND_BASE}/api/menu-items`;
const CAT_URL = `${BACKEND_BASE}/api/categories`;
// ===========================================

// langChanged event được dispatch từ i18n.js sau khi applyLanguage() hoàn tất

document.addEventListener("DOMContentLoaded", async () => {
  const menuGrid = document.getElementById("main-menu-grid");
  const filterTabsContainer = document.querySelector(".filter-tabs");
  const searchInput = document.getElementById("menu-search");

  let allFoods = [];
  let allCategories = [];
  let activeFilter = "all";

  function getCurrentLang() {
    return (
      localStorage.getItem("selected_language") ||
      localStorage.getItem("language") ||
      "vi"
    );
  }

  function getName(obj) {
    if (!obj) return "";
    const lang = getCurrentLang();
    return lang === "en"
      ? obj.nameEn || obj.nameVi || ""
      : obj.nameVi || obj.nameEn || "";
  }

  function getDescription(food) {
    const lang = getCurrentLang();
    return lang === "en"
      ? food.descriptionEn || food.descriptionVi || ""
      : food.descriptionVi || food.descriptionEn || "";
  }

  function updateSearchPlaceholder() {
    searchInput.placeholder =
      getCurrentLang() === "en"
        ? "What dish are you looking for?"
        : "Bạn đang tìm món ăn nào?";
  }

  // Hiển thị trạng thái đang chờ server wake up
  function showWakingUp() {
    menuGrid.innerHTML = `
      <div style="grid-column:1/-1;text-align:center;padding:60px 20px;color:#aaa;">
        <div style="font-size:2rem;margin-bottom:16px;">⏳</div>
        <p style="margin:0 0 8px;font-size:1rem;">
          ${getCurrentLang() === "en" ? "Server is waking up, please wait..." : "Server đang khởi động, vui lòng chờ..."}
        </p>
        <p style="margin:0;font-size:0.85rem;opacity:0.6;">
          ${getCurrentLang() === "en" ? "This may take up to 60 seconds" : "Có thể mất đến 60 giây"}
        </p>
      </div>`;
  }

  // Fetch có retry: thử lại tối đa maxRetries lần, mỗi lần cách nhau delayMs
  async function fetchWithRetry(url, maxRetries = 8, delayMs = 7000) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return await res.json();
      } catch (e) {
        console.warn(`Lần thử ${attempt}/${maxRetries} thất bại:`, e.message);
        if (attempt < maxRetries) {
          await new Promise((r) => setTimeout(r, delayMs));
        } else {
          throw e;
        }
      }
    }
  }

  async function fetchCategories() {
    try {
      const data = await fetchWithRetry(CAT_URL);
      allCategories = data.filter((c) => c.active);
      renderFilterTabs();
    } catch (e) {
      console.error("Loi load danh muc:", e);
      menuGrid.innerHTML = `<p style="grid-column:1/-1;text-align:center;padding:40px;color:#e57373;">
        ${getCurrentLang() === "en" ? "Failed to connect to server. Please reload the page." : "Không thể kết nối server. Vui lòng tải lại trang."}
      </p>`;
    }
  }

  async function fetchFoods() {
    try {
      showWakingUp();
      const data = await fetchWithRetry(API_URL);
      allFoods = data.filter((f) => f.isAvailable);
      renderMenu();
    } catch (e) {
      console.error("Loi load mon an:", e);
      menuGrid.innerHTML = `<p style="grid-column:1/-1;text-align:center;padding:40px;color:#e57373;">
        ${getCurrentLang() === "en" ? "Failed to load menu. Please reload the page." : "Không thể tải thực đơn. Vui lòng tải lại trang."}
      </p>`;
    }
  }

  function renderFilterTabs() {
    filterTabsContainer.innerHTML = "";

    const allBtn = document.createElement("button");
    allBtn.className = "filter-btn" + (activeFilter === "all" ? " active" : "");
    allBtn.dataset.filter = "all";
    allBtn.textContent = getCurrentLang() === "en" ? "All" : "Tất Cả";
    filterTabsContainer.appendChild(allBtn);

    allCategories.forEach((cat) => {
      const btn = document.createElement("button");
      btn.className =
        "filter-btn" +
        (activeFilter === String(cat.categoryId) ? " active" : "");
      btn.dataset.filter = String(cat.categoryId);
      btn.textContent = getName(cat);
      filterTabsContainer.appendChild(btn);
    });

    filterTabsContainer.querySelectorAll(".filter-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        filterTabsContainer
          .querySelectorAll(".filter-btn")
          .forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        activeFilter = btn.dataset.filter;
        renderMenu();
      });
    });
  }

  function formatPrice(price) {
    if (!price) return "";
    return Number(price).toLocaleString("vi-VN") + " VND";
  }

  function renderMenu() {
    const searchText = searchInput.value.toLowerCase().trim();

    const filtered = allFoods.filter((food) => {
      const nameVi = (food.nameVi || "").toLowerCase();
      const nameEn = (food.nameEn || "").toLowerCase();
      const matchSearch =
        nameVi.includes(searchText) || nameEn.includes(searchText);
      const catId = food.category ? String(food.category.categoryId) : "";
      const matchFilter = activeFilter === "all" || catId === activeFilter;
      return matchSearch && matchFilter;
    });

    menuGrid.innerHTML = "";

    if (filtered.length === 0) {
      const msg = document.createElement("p");
      msg.style.cssText =
        "text-align:center;padding:40px;color:#999;grid-column:1/-1;";
      msg.textContent =
        getCurrentLang() === "en"
          ? "No matching dishes found."
          : "Không tìm thấy món ăn phù hợp.";
      menuGrid.appendChild(msg);
      return;
    }

    filtered.forEach((food) => {
      const hasDiscount = food.discount && Number(food.discount) > 0;
      const finalPrice = hasDiscount
        ? Number(food.price) - Number(food.discount)
        : Number(food.price);

      const displayName = getName(food);
      const displayDesc = getDescription(food);

      const card = document.createElement("div");
      card.className = "menu-card show-animation";
      card.dataset.category = food.category ? food.category.categoryId : "";

      const imgDiv = document.createElement("div");
      imgDiv.className = "menu-img";
      if (food.imageUrl) {
        const img = document.createElement("img");
        img.alt = displayName;
        img.style.cssText = "width:100%;height:100%;object-fit:cover;";
        img.src = food.imageUrl;
        img.addEventListener("error", () => {
          imgDiv.innerHTML =
            '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:3rem;">&#127869;</div>';
        });
        imgDiv.appendChild(img);
      } else {
        imgDiv.innerHTML =
          '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:3rem;">&#127869;</div>';
      }

      const infoDiv = document.createElement("div");
      infoDiv.className = "card-info";

      const h3 = document.createElement("h3");
      h3.textContent = displayName;
      infoDiv.appendChild(h3);

      const p = document.createElement("p");
      p.textContent = displayDesc;
      infoDiv.appendChild(p);

      if (hasDiscount) {
        const oldPrice = document.createElement("span");
        oldPrice.className = "price";
        oldPrice.style.cssText =
          "text-decoration:line-through;opacity:0.5;font-size:0.85em;display:block;";
        oldPrice.textContent = formatPrice(food.price);
        infoDiv.appendChild(oldPrice);

        const newPrice = document.createElement("span");
        newPrice.className = "price";
        newPrice.textContent = formatPrice(finalPrice);
        infoDiv.appendChild(newPrice);
      } else {
        const priceEl = document.createElement("span");
        priceEl.className = "price";
        priceEl.textContent = formatPrice(food.price);
        infoDiv.appendChild(priceEl);
      }

      card.appendChild(imgDiv);
      card.appendChild(infoDiv);
      menuGrid.appendChild(card);
    });
  }

  searchInput.addEventListener("input", renderMenu);

  // Lắng nghe custom event từ i18n.js sau khi applyLanguage() hoàn tất
  document.addEventListener("langChanged", () => {
    updateSearchPlaceholder();
    renderFilterTabs();
    renderMenu();
  });

  updateSearchPlaceholder();
  await fetchCategories();
  await fetchFoods();
});