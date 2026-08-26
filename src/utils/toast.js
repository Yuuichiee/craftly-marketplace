export const showToast = (message, type = "info", duration = 3000) => {
  const existing = document.querySelector(".toast-container");
  if (existing) existing.remove();

  const container = document.createElement("div");
  container.className = `toast ${type}`;
  container.style.cssText = `
    position: fixed;
    bottom: 24px;
    right: 24px;
    padding: 14px 20px;
    background: #12121f;
    border: 1px solid ${
      type === "success"
        ? "#10b981"
        : type === "error"
        ? "#ef4444"
        : "#06b6d4"
    };
    border-radius: 12px;
    color: #f0f0fa;
    font-size: 14px;
    font-family: 'Inter', sans-serif;
    z-index: 9999;
    box-shadow: 0 20px 60px rgba(0,0,0,0.6);
    animation: fadeInUp 0.3s ease;
    max-width: 340px;
    line-height: 1.5;
  `;
  container.classList.add("toast-container");
  container.textContent = message;
  document.body.appendChild(container);

  setTimeout(() => {
    container.style.opacity = "0";
    container.style.transform = "translateY(8px)";
    container.style.transition = "all 0.3s ease";
    setTimeout(() => container.remove(), 300);
  }, duration);
};
