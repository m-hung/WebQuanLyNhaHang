const BASE_URL = "http://localhost:8080";

export const fetch = async (path, options = {}) => {
  const token = sessionStorage.getItem("token");
  const res = await window.fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (res.status === 401) {
    sessionStorage.clear();
    window.location.href = "/admin";
  }

  return res;
};
