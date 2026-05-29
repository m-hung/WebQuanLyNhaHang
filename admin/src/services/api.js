const BASE_URL = "http://localhost:8080";

export const apiFetch = async (path, options = {}) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${BASE_URL}${path}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...options.headers,
        },
    });

    if (res.status === 401) {
        localStorage.clear();
        window.location.href = "/login";
    }

    return res;
};