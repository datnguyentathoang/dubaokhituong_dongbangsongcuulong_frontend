// UI Utilities and Helper Functions

/**
 * Show notification to user
 * @param {string} message - Message to display
 * @param {string} type - Type of notification: 'success', 'error', 'warning', 'info'
 */
function showNotification(message, type = "info") {
  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <i class="fas fa-${getNotificationIcon(type)}"></i>
    <span>${message}</span>
    <button class="notification-close" onclick="this.parentElement.remove()">
      <i class="fas fa-times"></i>
    </button>
  `;

  const container =
    document.querySelector(".notification-container") || document.body;

  if (!document.querySelector(".notification-container")) {
    const notifContainer = document.createElement("div");
    notifContainer.className = "notification-container";
    document.body.insertBefore(notifContainer, document.body.firstChild);
    container = notifContainer;
  }

  container.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 5000);
}

function getNotificationIcon(type) {
  switch (type) {
    case "success":
      return "check-circle";
    case "error":
      return "exclamation-circle";
    case "warning":
      return "exclamation-triangle";
    default:
      return "info-circle";
  }
}

/**
 * Format date to Vietnamese format
 */
function formatDate(date) {
  if (typeof date === "string") {
    date = new Date(date);
  }
  return date.toLocaleDateString("vi-VN");
}

/**
 * Format date and time to Vietnamese format
 */
function formatDateTime(date) {
  if (typeof date === "string") {
    date = new Date(date);
  }
  return date.toLocaleString("vi-VN");
}

/**
 * Debounce function
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Check if user has specific role
 */
function hasRole(role) {
  const user = getUser();
  if (!user) return false;

  if (Array.isArray(role)) {
    return role.includes(user.role);
  }
  return user.role === role;
}

/**
 * Generate month options for select
 */
function generateMonthOptions(selectElement, months = 12) {
  const now = new Date();

  for (let i = 0; i < months; i++) {
    const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthStr = monthDate.toISOString().substring(0, 7);
    const option = document.createElement("option");
    option.value = monthStr;
    option.textContent = monthDate.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
    });
    if (i === 0) option.selected = true;
    selectElement.appendChild(option);
  }
}

/**
 * Clear form inputs
 */
function clearForm(formId) {
  const form = document.getElementById(formId);
  if (form) {
    form.reset();
  }
}

/**
 * Set loading state on button
 */
function setButtonLoading(buttonElement, isLoading = true) {
  if (isLoading) {
    buttonElement.disabled = true;
    buttonElement.innerHTML =
      '<i class="fas fa-spinner fa-spin"></i> Đang xử lý...';
  } else {
    buttonElement.disabled = false;
    buttonElement.innerHTML =
      buttonElement.getAttribute("data-original-text") || "Gửi";
  }
}

/**
 * Format number with thousand separators
 */
function formatNumber(num) {
  return Number(num).toLocaleString("vi-VN");
}

/**
 * Get the user from localStorage
 */
function getUser() {
  const userStr = localStorage.getItem("user");
  return userStr ? JSON.parse(userStr) : null;
}

/**
 * Validate email
 */
function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

/**
 * Copy text to clipboard
 */
function copyToClipboard(text) {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      showNotification("Đã sao chép", "success");
    })
    .catch((err) => {
      console.error("Error copying to clipboard:", err);
      showNotification("Lỗi sao chép", "error");
    });
}
