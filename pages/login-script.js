//////////////
// js for login page toast notifications //

function showToastNotification(message, type = "info", duration = 2000) {
  Toastify({
    text: message,
    duration: duration,
    gravity: "top",
    position: "right",
    backgroundColor:
      type === "success"
        ? "#28a745"
        : type === "error"
        ? "#dc3545"
        : type === "warning"
        ? "#ffc107"
        : "#17a2b8",
    close: true,
  }).showToast();
}

///////////
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  if (!loginForm) return;

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    // 🔔 basic frontend validation
    if (!username || !password) {
      showToastNotification("All fields are required", "warning");
      return;
    }

    try {
      const res = await fetch("./login_process.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ username, password }),
      });

      const data = await res.json();

      if (data.status !== "success") {
        // ❌ error toast
        showToastNotification(data.message, "error");
        return;
      }

      // ✅ success toast with user name
      showToastNotification(
        `Welcome ${data.data.username}! Login successful`,
        "success"
      );
      // ⏳ small delay so user sees toast
      setTimeout(() => {
        if (data.role === "admin") {
          window.location.href = "../admin/index.php";
        } else {
          window.location.href = "../admin/property.php";
        }
      }, 1000);
    } catch (error) {
      // 🔥 network / server error
      showToastNotification("Server error. Please try again.", "error");
      console.error(error);
    }
  });
});
//////////////////////
