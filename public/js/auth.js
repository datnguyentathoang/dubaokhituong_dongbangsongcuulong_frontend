// Authentication utilities
async function handleLogin(event) {
  event.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const messageDiv = document.getElementById("loginMessage");

  try {
    const response = await fetch(`${window.API_BASE_URL}/access/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (response.ok && data.metadata) {
      // Save token to localStorage
      localStorage.setItem("access_token", data.metadata.access_token);
      localStorage.setItem("user", JSON.stringify(data.metadata.user));

      // Also set cookies for server-side rendering in Pug
      document.cookie = `access_token=${data.metadata.access_token}; path=/; max-age=86400`;
      document.cookie = `user=${encodeURIComponent(
        JSON.stringify(data.metadata.user),
      )}; path=/; max-age=86400`;

      messageDiv.classList.remove("hidden", "alert-error");
      messageDiv.classList.add("alert-success");
      messageDiv.textContent = "Đăng nhập thành công! Chuyển hướng...";

      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1000);
    } else {
      messageDiv.classList.remove("hidden", "alert-success");
      messageDiv.classList.add("alert-error");
      messageDiv.textContent =
        data.message ||
        "Đăng nhập thất bại. Vui lòng kiểm tra tên đăng nhập và mật khẩu.";
    }
  } catch (error) {
    console.error("Login error:", error);
    messageDiv.classList.remove("hidden", "alert-success");
    messageDiv.classList.add("alert-error");
    messageDiv.textContent = "Lỗi kết nối. Vui lòng thử lại.";
  }
}

function logout() {
  if (confirm("Bạn có chắc chắn muốn đăng xuất?")) {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");

    // Clear cookies
    document.cookie =
      "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = "user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

    window.location.href = "/login";
  }
}

function isLoggedIn() {
  return !!localStorage.getItem("access_token");
}

function getUser() {
  const userStr = localStorage.getItem("user");
  return userStr ? JSON.parse(userStr) : null;
}

function requireLogin() {
  if (!isLoggedIn()) {
    window.location.href = "/login";
  }
}
