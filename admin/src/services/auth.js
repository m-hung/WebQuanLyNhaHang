export const login = async (username, password) => {
    const res = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json(); // { token, role, fullName }
};

export const forgotPassword = async (email) => {
    const res = await fetch("http://localhost:8080/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
};

export const resetPassword = async (token, newPassword) => {
    const res = await fetch("http://localhost:8080/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword })
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json(); // { message }
};

export const logout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("role");
    sessionStorage.removeItem("fullName");
    window.location.href = "/login";
};

export const getToken = () => sessionStorage.getItem("token");
export const getRole = () => sessionStorage.getItem("role");
export const isLoggedIn = () => !!getToken();