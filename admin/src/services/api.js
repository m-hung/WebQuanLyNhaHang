const BASE_URL = "";

export const apiFetch = async (path, options = {}) => {
  const token = sessionStorage.getItem("token");
  const res = await fetch(`${BASE_URL}${path}`, {
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
