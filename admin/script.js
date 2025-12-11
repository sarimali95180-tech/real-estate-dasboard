// ===== STANDARDIZED TOAST NOTIFICATION FUNCTION =====
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
        ? "#dc3545"
        : "#17a2b8",
    close: true,
  }).showToast();
}

document.addEventListener("DOMContentLoaded", () => {
  loadUsers();

  // Save user button click (guarded)
  const saveBtn = document.getElementById("saveUser");
  if (saveBtn) {
    saveBtn.addEventListener("click", saveUser);
  }

  // Reset form when modal is closed
  const modalElement = document.getElementById("addUserModal");
  if (modalElement) {
    modalElement.addEventListener("hidden.bs.modal", function () {
      document.getElementById("userForm").reset();
      document.getElementById("addUserLabel").textContent = "Add New User";
      document.getElementById("saveUser").textContent = "Save";
      window.editingUserId = null;
    });
  }

  // eye icon for the password and confirm password fields

  // ===== PASSWORD VISIBILITY TOGGLE =====
  const togglePassword = document.getElementById("togglePassword");
  const passwordInput = document.getElementById("password");
  if (togglePassword && passwordInput) {
    togglePassword.addEventListener("click", function () {
      const type =
        passwordInput.getAttribute("type") === "password" ? "text" : "password";
      passwordInput.setAttribute("type", type);
      this.classList.toggle("fa-eye");
      this.classList.toggle("fa-eye-slash");
    });
  }

  const toggleConfirmPassword = document.getElementById(
    "toggleConfirmPassword"
  );
  const confirmPasswordInput = document.getElementById("confirmPassword");
  if (toggleConfirmPassword && confirmPasswordInput) {
    toggleConfirmPassword.addEventListener("click", function () {
      const type =
        confirmPasswordInput.getAttribute("type") === "password"
          ? "text"
          : "password";
      confirmPasswordInput.setAttribute("type", type);
      this.classList.toggle("fa-eye");
      this.classList.toggle("fa-eye-slash");
    });
  }
});

// function to get all users from database
function loadUsers() {
  fetch(`./get_users.php`) // this backend file
    .then((res) => {
      if (!res.ok)
        throw new Error(`Network response was not ok (${res.status})`);
      return res.json();
    })
    .then((users) => {
      // render and also cache locally for offline/fallback
      renderUsers(users);
      try {
        localStorage.setItem("users", JSON.stringify(users));
      } catch (e) {
        console.warn("Could not store users in localStorage:", e);
      }
    })
    .catch((err) => {
      console.error("❌ Error loading users:", err);
      // fallback: load from localStorage
      const stored = localStorage.getItem("users");
      if (stored) {
        try {
          const users = JSON.parse(stored);
          renderUsers(users);
        } catch (e) {
          console.error("Failed to parse stored users:", e);
          const table = document.getElementById("userTable");
          if (table) table.innerHTML = "";
        }
      } else {
        const table = document.getElementById("userTable");
        if (table)
          table.innerHTML =
            '<tr><td colspan="5" class="text-center text-muted">No users found.</td></tr>';
      }
    });
}

// render users array into the table
function renderUsers(users) {
  const table = document.getElementById("userTable");
  if (!table) return;
  table.innerHTML = "";
  users.forEach((u) => {
    // ensure we have an id to avoid JS errors when onclick is used
    const id = u.id !== undefined ? u.id : u._localId || "";
    const row = `
          <tr>
            <td>${escapeHtml(u.fullname)}</td>
            <td>${escapeHtml(u.username)}</td>
            <td>${escapeHtml(u.email)}</td>
            <td><span class="status ${escapeHtml(u.status || "")}">${escapeHtml(
      u.status || ""
    )}</span></td>
            <td>
              <button class="btn btn-warning btn-sm me-2" ${
                id ? `onclick="editUser(${id})"` : "disabled"
              }>Edit</button>
              <button class="btn btn-danger btn-sm" ${
                id ? `onclick="deleteUser(${id})"` : "disabled"
              }>Delete</button>
            </td>
          </tr>`;
    table.insertAdjacentHTML("beforeend", row);
  });
}

// small helper to avoid injecting raw HTML
function escapeHtml(str) {
  if (!str && str !== 0) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Edit user function
async function editUser(id) {
  try {
    // Get all users to find the one being edited
    const stored = localStorage.getItem("users");
    if (!stored) {
      showToastNotification("No users found", "error");
      return;
    }

    const users = JSON.parse(stored);
    const userId = Number(id); // Convert id to number for proper comparison
    const user = users.find(
      (u) => Number(u.id) === userId || Number(u._localId) === userId
    );

    if (!user) {
      console.error("User not found. ID:", userId, "Users:", users);
      showToastNotification("User not found", "error");
      return;
    }

    // Populate form with user data
    document.getElementById("name").value = user.fullname || "";
    document.getElementById("username").value = user.username || "";
    document.getElementById("email").value = user.email || "";
    document.getElementById("password").value = "";
    document.getElementById("confirmPassword").value = "";
    document.getElementById("status").value = user.status || "active";

    // Store the ID being edited
    window.editingUserId = userId;

    // Change modal title and button text
    document.getElementById("addUserLabel").textContent = "Edit User";
    document.getElementById("saveUser").textContent = "Update";

    // Show modal
    const modalElement = document.getElementById("addUserModal");
    const modalInstance =
      bootstrap.Modal.getInstance(modalElement) ||
      new bootstrap.Modal(modalElement);
    modalInstance.show();
  } catch (error) {
    console.error("Error editing user:", error);
    showToastNotification("Error loading user data", "error");
  }
}

// Update user form submission
async function updateUserForm() {
  const fullname = document.getElementById("name").value.trim();
  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const confirmPassword = document
    .getElementById("confirmPassword")
    .value.trim();
  const status = document.getElementById("status").value;
  const editingUserId = window.editingUserId;

  if (!editingUserId) {
    // Not in edit mode, call saveUser instead
    return saveUser();
  }

  if (!fullname || !username || !email) {
    showToastNotification("Please fill all required fields!", "warning");
    return;
  }

  // If password is provided, verify match
  if (password && password !== confirmPassword) {
    showToastNotification("Passwords do not match!", "error");
    return;
  }

  try {
    const payload = { fullname, username, email, status };
    if (password) {
      payload.password = password;
    }
    payload.id = editingUserId;

    const response = await fetch("./update_user.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    let data = null;
    try {
      const text = await response.text();
      data = JSON.parse(text);
    } catch (e) {
      console.warn("Response not JSON:", e);
    }

    if (response.ok && data && data.success) {
      showToastNotification("User updated successfully!", "success");

      // Reload users
      await loadUsers();

      // Close modal and reset form
      const modalElement = document.getElementById("addUserModal");
      const modalInstance = bootstrap.Modal.getInstance(modalElement);
      if (modalInstance) modalInstance.hide();

      document.getElementById("userForm").reset();
      document.getElementById("addUserLabel").textContent = "Add New User";
      document.getElementById("saveUser").textContent = "Save";
      window.editingUserId = null;

      return;
    }

    showToastNotification(data?.message || "Error updating user", "error");
  } catch (error) {
    console.error("Error:", error);
    showToastNotification("Network error. Please try again.", "error");
  }
}

// function to save user in database
async function saveUser() {
  // If editing, use updateUserForm instead
  if (window.editingUserId) {
    return updateUserForm();
  }

  const fullname = document.getElementById("name").value.trim();
  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const confirmPassword = document
    .getElementById("confirmPassword")
    .value.trim();
  const status = document.getElementById("status").value;

  console.log("🔍 Form values:", { fullname, username, email, status });

  if (!fullname || !username || !email || !password) {
    showToastNotification("Please fill all fields!", "warning");
    return;
  }
  if (password !== confirmPassword) {
    showToastNotification("Passwords do not match!", "error");
    return;
  }

  console.log("✅ Form validation passed, sending to add_user.php...");

  try {
    const response = await fetch("./add_user.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullname, username, email, password, status }),
    });

    console.log("📬 Response status:", response.status);

    // Try to parse response as JSON
    let data = null;
    try {
      const text = await response.text();
      console.log("📝 Response text:", text);
      data = JSON.parse(text);
    } catch (e) {
      console.warn("Response not JSON or empty:", e);
    }

    if (response.ok && data && data.success) {
      console.log("✅ User saved successfully!");
      // server accepted; refresh from server (and update cache)
      await loadUsers();

      // close modal
      const modalElement = document.getElementById("addUserModal");
      const modalInstance = bootstrap.Modal.getInstance(modalElement);
      if (modalInstance) {
        modalInstance.hide();
        console.log("✅ Modal closed");
      } else {
        console.warn("Modal instance not found");
      }

      // Reset form
      const form = document.getElementById("userForm");
      if (form) form.reset();

      // Show success toast
      showToastNotification("User added successfully!", "success");

      return;
    }

    // If server returned error or didn't return expected JSON, fall back to local save
    console.warn(
      "Server did not confirm save, falling back to localStorage",
      data
    );
    showToastNotification(data?.message || "Error adding user", "error");
  } catch (error) {
    console.error("❌ Network error:", error);
    showToastNotification("Network error. Please try again.", "error");
  }
}

// delete function

function deleteUser(id) {
  if (!confirm("Delete this user?")) return;

  const nid = Number(id);

  // If this is a local-only user (created offline), remove from localStorage
  try {
    const stored = JSON.parse(localStorage.getItem("users") || "[]");
    const localIndex = stored.findIndex(
      (u) => u._localId && Number(u._localId) === nid
    );
    if (localIndex !== -1) {
      stored.splice(localIndex, 1);
      localStorage.setItem("users", JSON.stringify(stored));
      renderUsers(stored);
      // alert("🗑️ Local user removed");
      return;
    }
  } catch (e) {
    console.warn("Could not access local users:", e);
  }

  // Otherwise try deleting on the server (delete_user.php expects ?id=)
  fetch(`./delete_user.php?id=${encodeURIComponent(nid)}`)
    .then((res) => {
      if (!res.ok)
        throw new Error(`Network response was not ok (${res.status})`);
      return res.json();
    })
    .then((data) => {
      if (data && data.success) {
        // alert("🗑️ User deleted");
        showToastNotification("User deleted!", "success");

        loadUsers();
      } else {
        console.warn("Server responded but did not delete:", data);
        showToastNotification("Failed to delete user on server.", "error");
      }
    })
    .catch((err) => {
      console.error("❌ Delete error:", err);
      showToastNotification("Unable to delete user. Check console.", "error");
    });
}

// Delete a property (server-backed or local)
function deleteProperty(id, index) {
  if (!confirm("Delete this property?")) return;

  // If id is null -> it's a local-only property stored in localStorage
  if (id === null) {
    try {
      properties.splice(index, 1);
      localStorage.setItem("properties", JSON.stringify(properties));
      displayProperties();
      showToastNotification("Local property removed", "success");
      return;
    } catch (e) {
      console.error("Failed to remove local property", e);
      showToastNotification("Failed to remove local property", "error");
      return;
    }
  }

  // Server-side delete
  fetch(`./delete_property.php?id=${encodeURIComponent(id)}`)
    .then((res) => {
      if (!res.ok) throw new Error("Network response was not ok " + res.status);
      return res.json();
    })
    .then((data) => {
      if (data && data.success) {
        // alert("🗑️ Property deleted");
        showToastNotification("Property deleted!", "success");
        // refresh from server
        loadPropertiesFromServer();
      } else {
        console.warn("Server failed to delete property", data);
        showToastNotification("Failed to delete property on server", "error");
      }
    })
    .catch((err) => {
      console.error("Delete property error", err);
      showToastNotification(
        "Unable to delete property. Check console.",
        "error"
      );
    });
}

// i am going to creat a function for user login

// async function login() {
//   try {
//     const email = document.getElementById("email").value;
//     const password = document.getElementById("password").value;

//     console.log("login details:", { email, password });

//     // call the backend api for login
//     const response = await fetch(`./auth/login.php`);
//     const data = await response.json();
//     console.log(`login api data: ${data}`);

//     window.location.href = "./pages/dashboard.php"; // we will add this file later

//     // token to be stored inside localstorage or cookies
//     // sessions
//   } catch (err) {
//     console.error(`Error while login: ${err}`);
//   }
// }

// property.php page js

//    //   //

const apiBase = "./"; // all PHP files are in the same folder

// ///  //

// Store properties in array
let properties = [];
let rowCounter = 1;
async function uploadImage() {
  const file = document.getElementById("imageFile").files[0];
  if (!file) {
    showToastNotification("Please select an image", "warning");
    return;
  }

  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch("upload-image.php", {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  console.log(data);

  if (data.success) {
    showToastNotification("Image Uploaded Successfully!", "success");
    console.log("Cloudinary URL:", data.url);
  } else {
    showToastNotification("Upload Failed", "error");
  }
}
// Load properties from server on page load
async function loadPropertiesFromServer() {
  try {
    console.log("📡 Fetching properties from get-properties.php...");
    const res = await fetch("./get-properties.php");
    if (!res.ok) throw new Error("Network response not ok: " + res.status);
    const props = await res.json();
    console.log("📥 Server returned properties:", props);
    properties = Array.isArray(props) ? props : [];
    console.log("✅ Properties array updated with", properties.length, "items");
    displayProperties();
    // localStorage.setItem("properties", JSON.stringify(properties));
    console.log("✅ Cached to localStorage");
  } catch (err) {
    console.warn("Failed to load from server, using local cache", err);
    loadStoredProperties();
  }
}

// Load properties from localStorage when page loads
function loadStoredProperties() {
  const stored = localStorage.getItem("properties");
  if (stored) {
    try {
      properties = JSON.parse(stored);
      displayProperties();
    } catch (e) {
      console.error("Error parsing stored properties:", e);
      properties = [];
      displayProperties();
    }
  } else {
    displayProperties();
  }
}

// Display properties in table
function displayProperties() {
  const tbody = document.getElementById("propertiesList");
  if (!tbody) return;

  if (!properties || properties.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="7" class="text-center text-muted">No properties added yet. Click "+Add" to create one.</td></tr>';
    return;
  }

  tbody.innerHTML = "";
  properties.forEach((prop, index) => {
    const thumbnail = prop.thumbnail || "./images/1.png";
    const row = `
      <tr>
        <td>${index + 1}</td>
        <td>${escapeHtml(prop.title)}</td>
        <td>${escapeHtml(prop.description)}</td>
        <td>${escapeHtml(prop.category)}</td>
        <td>${escapeHtml(prop.area)}</td>
        <td>${escapeHtml(prop.bathroom)}</td>
        <td>${escapeHtml(prop.property_type)}</td>
        <td>${escapeHtml(prop.price)}</td>
        <td>${escapeHtml(prop.location)}</td>
          <td>
            <img src="${escapeHtml(
              thumbnail
            )}" class="property-thumb" data-src="${escapeHtml(
      thumbnail
    )}" style="width:80px; height:60px; object-fit:cover; cursor:pointer;" onerror="this.src='./images/1.png'" alt="thumbnail">
          </td>
          <td>
            <button class="btn btn-sm btn-danger" onclick="deleteProperty(${
              prop.id !== undefined ? prop.id : "null"
            }, ${index})">Delete</button>
          </td>
      </tr>`;
    tbody.insertAdjacentHTML("beforeend", row);
  });
}

// --- Image viewer overlay (opens clicked thumbnail, constrained to 50vw x 50vh) ---
function _createImageViewer() {
  if (document.getElementById("imageViewerOverlay")) return;

  const overlay = document.createElement("div");
  overlay.id = "imageViewerOverlay";
  overlay.style.cssText = [
    "position:fixed",
    "inset:0",
    "display:none",
    "align-items:center",
    "justify-content:center",
    "background:rgba(0,0,0,0.7)",
    "z-index:2000",
    "cursor:pointer",
  ].join(";");

  const img = document.createElement("img");
  img.id = "imageViewerImg";
  img.style.cssText = [
    "max-width:90vw",
    "max-height:90vh",
    "object-fit:contain",
    "box-shadow:0 6px 24px rgba(0,0,0,0.5)",
    "cursor:default",
    "border-radius:6px",
  ].join(";");

  // prevent overlay click when clicking image itself
  img.addEventListener("click", (e) => e.stopPropagation());

  overlay.appendChild(img);
  overlay.addEventListener("click", () => {
    overlay.style.display = "none";
  });

  document.body.appendChild(overlay);

  // close on ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") overlay.style.display = "none";
  });
}

function openImageViewer(src) {
  if (!src) return;
  _createImageViewer();
  const overlay = document.getElementById("imageViewerOverlay");
  const img = document.getElementById("imageViewerImg");
  if (!overlay || !img) return;
  img.src = src;
  overlay.style.display = "flex";
}

// Delegated click handler for thumbnails (works even if table is re-rendered)
document.addEventListener("click", function (e) {
  const t = e.target;
  if (!t) return;
  if (t.classList && t.classList.contains("property-thumb")) {
    const src = t.dataset && t.dataset.src ? t.dataset.src : t.src;
    openImageViewer(src);
  }
});

// // Initialize CKEditor for the content textarea
// ClassicEditor.create(document.querySelector("#content"), {
//   toolbar: [
//     "heading",
//     "|",
//     "bold",
//     "italic",
//     "link",
//     "bulletedList",
//     "numberedList",
//     "|",
//     "undo",
//     "redo",
//   ],
// })
//   .then((editor) => {
//     console.log("✅ CKEditor initialized for property content");
//   })
//   .catch((error) => {
//     console.error("❌ CKEditor initialization error:", error);
//   });

document.addEventListener("DOMContentLoaded", function () {
  console.log("⚡ DOM Loaded — initializing property system...");

  // Load properties at start
  console.log("📡 Loading properties from server...");
  loadPropertiesFromServer();

  const locationInput = document.querySelector('input[name="location"]');

const form = document.getElementById("propertyForm");

if (form) {
  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    console.log("🟦 Form submit triggered");

    const submitBtn = document.getElementById("submitBtn");
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML =
        '<span class="spinner-border spinner-border-sm me-2"></span>Loading...';
    }

    // Get values
    const title = form.title.value.trim();
    const description = form.description.value.trim();
    const category = form.category.value;
    const area = form.area.value;
    const bathroom = form.bathroom.value;
    const property_type = form.property_type.value;
    const price = form.price.value;
    const location = form.location.value.trim();
    const content = form.content.value.trim();
    const file = form.thumbnail.files[0];

    // Validation
    if (!title || !description || !location) {
      showToastNotification("Please fill all required fields!", "warning");
      resetBtn();
      return;
    }

    if (!file) {
      showToastNotification("Please upload a thumbnail image!", "warning");
      resetBtn();
      return;
    }

    // Upload image to Cloudinary
    const cloudUrl = await uploadToCloudinary(file);
    if (!cloudUrl) {
      showToastNotification("Failed to upload image!", "error");
      resetBtn();
      return;
    }

    // Build FormData
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("area", area);
    formData.append("bathroom", bathroom);
    formData.append("property_type", property_type);
    formData.append("price", price);
    formData.append("location", location);
    formData.append("content", content);
    formData.append("thumbnail_url", cloudUrl);

    // ✅ Append latitude & longitude (fixed)
    if (locationInput?.dataset?.lat && locationInput?.dataset?.lon) {
      formData.append("latitude", locationInput.dataset.lat);
      formData.append("longitude", locationInput.dataset.lon);
    } else {
      formData.append("latitude", "");
      formData.append("longitude", "");
    }

    try {
      const response = await fetch("./add-property.php", {
        method: "POST",
        body: formData,
      });

      const text = await response.text();
      let data = {};

      try {
        data = JSON.parse(text);
      } catch {
        showToastNotification("Invalid server response", "error");
        resetBtn();
        return;
      }

      if (data.success) {
  showToastNotification("Property added successfully!", "success");

  await loadPropertiesFromServer();
  form.reset();

  // ✅ Clear stored dataset
  if (locationInput) {
    delete locationInput.dataset.lat;
    delete locationInput.dataset.lon;
  }

  // ✅ Close Bootstrap modal
  const modalEl = document.getElementById("addUserModal"); // <-- your modal id
  if (modalEl) {
    const modalInstance = bootstrap.Modal.getInstance(modalEl) 
      || new bootstrap.Modal(modalEl);
    modalInstance.hide();
  }
}
 else {
        showToastNotification(data.message || "Save failed", "error");
      }
    } catch (err) {
      showToastNotification("Network error", "error");
    }

    resetBtn();
  });
}

// Helper to reset button
function resetBtn() {
  const submitBtn = document.getElementById("submitBtn");
  if (submitBtn) {
    submitBtn.disabled = false;
    submitBtn.innerHTML = "Submit";
  }
}

});

async function uploadToCloudinary(file) {
  const preset = "unsigned_upload";
  const cloudName = "dwau92q5t";

  console.log("📡 Cloudinary Upload Started...");
  console.log("🌐 Cloud Name:", cloudName);
  console.log("🎛 Upload Preset:", preset);

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", preset);

  try {
    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dwau92q5t/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    const result = await res.json();

    console.log("📩 Cloudinary Response:", result);

    return result.secure_url || null;
  } catch (error) {
    console.error("❌ Cloudinary Upload Error:", error);
    return null;
  }
}

//  //  //
// session will destroy when page open on new table

// Detect new tab and destroy session
window.addEventListener("load", function () {
  // Check if this is a new tab by checking sessionStorage
  if (!sessionStorage.getItem("tab_id")) {
    // This is a new tab, generate a unique ID for this tab
    sessionStorage.setItem("tab_id", "tab_" + Date.now());

    // Destroy the session by redirecting to logout
    fetch("../pages/logout.php").then(() => {
      window.location.href = "../pages/login.php";
    });
  }
});

/////
// add_property.html

// Session validation for new tab detection
document.addEventListener("DOMContentLoaded", function () {
  // Check if sessionStorage exists for this tab
  if (!sessionStorage.getItem("page_session_id")) {
    // This is a new tab, generate unique session ID
    const sessionId = "session_" + Date.now() + "_" + Math.random();
    sessionStorage.setItem("page_session_id", sessionId);

    // Store the parent page reference
    sessionStorage.setItem("page_origin", window.location.href);

    // Validate session is still active
    validateSession();
  } else {
    // Tab already exists, validate session
    validateSession();
  }
});

function validateSession() {
  // Create hidden input with session token
  const token = '<?php echo $_SESSION["page_token"] ?? ""; ?>';

  if (!token) {
    // No token means invalid session
    redirectToLogin();
  }
}

function redirectToLogin() {
  sessionStorage.clear();
  window.location.href = "../pages/login.php";
}

// Check session every 30 seconds
setInterval(function () {
  if (!sessionStorage.getItem("page_session_id")) {
    redirectToLogin();
  }
}, 30000);

//////
// property.php

// Session validation for new tab detection
document.addEventListener("DOMContentLoaded", function () {
  // Check if sessionStorage exists for this tab
  if (!sessionStorage.getItem("page_session_id")) {
    // This is a new tab, generate unique session ID
    const sessionId = "session_" + Date.now() + "_" + Math.random();
    sessionStorage.setItem("page_session_id", sessionId);

    // Store the parent page reference
    sessionStorage.setItem("page_origin", window.location.href);

    // Validate session is still active
    validateSession();
  } else {
    // Tab already exists, validate session
    validateSession();
  }
});

function validateSession() {
  // Create hidden input with session token
  const token = '<?php echo $_SESSION["page_token"] ?? ""; ?>';

  if (!token) {
    // No token means invalid session
    redirectToLogin();
  }
}

function redirectToLogin() {
  sessionStorage.clear();
  window.location.href = "../pages/login.php";
}

// Check session every 30 seconds
setInterval(function () {
  if (!sessionStorage.getItem("page_session_id")) {
    redirectToLogin();
  }
}, 30000);

//////
// index.php

// Session validation for new tab detection
document.addEventListener("DOMContentLoaded", function () {
  // Check if sessionStorage exists for this tab
  if (!sessionStorage.getItem("page_session_id")) {
    // This is a new tab, generate unique session ID
    const sessionId = "session_" + Date.now() + "_" + Math.random();
    sessionStorage.setItem("page_session_id", sessionId);

    // Store the parent page reference
    sessionStorage.setItem("page_origin", window.location.href);

    // Validate session is still active
    validateSession();
  } else {
    // Tab already exists, validate session
    validateSession();
  }
});

function validateSession() {
  // Create hidden input with session token
  const token = '<?php echo $_SESSION["page_token"] ?? ""; ?>';

  if (!token) {
    // No token means invalid session
    redirectToLogin();
  }
}

function redirectToLogin() {
  sessionStorage.clear();
  window.location.href = "../pages/login.php";
}

// Check session every 30 seconds
setInterval(function () {
  if (!sessionStorage.getItem("page_session_id")) {
    redirectToLogin();
  }
}, 30000);

//////

// ek editor to add img
ClassicEditor.create(document.querySelector("#editor"), {
  toolbar: [
    "heading",
    "|",
    "bold",
    "italic",
    "link",
    "bulletedList",
    "numberedList",
    "|",
    "uploadImage",
    "blockQuote",
    "undo",
    "redo",
  ],
  image: {
    toolbar: ["imageTextAlternative", "imageStyle:full", "imageStyle:side"],
  },
})
  .then((editor) => {
    // Override the default upload adapter
    editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
      return {
        upload: () =>
          loader.file.then((file) => {
            return new Promise((resolve, reject) => {
              const img = new Image();
              const reader = new FileReader();

              reader.onload = (e) => {
                img.src = e.target.result;

                img.onload = () => {
                  // Resize image
                  const canvas = document.createElement("canvas");
                  const maxWidth = 800; // max width
                  const maxHeight = 800; // max height
                  let width = img.width;
                  let height = img.height;

                  // maintain aspect ratio
                  if (width > height) {
                    if (width > maxWidth) {
                      height = (height * maxWidth) / width;
                      width = maxWidth;
                    }
                  } else {
                    if (height > maxHeight) {
                      width = (width * maxHeight) / height;
                      height = maxHeight;
                    }
                  }

                  canvas.width = width;
                  canvas.height = height;
                  const ctx = canvas.getContext("2d");
                  ctx.drawImage(img, 0, 0, width, height);

                  // Convert to compressed Base64
                  const dataUrl = canvas.toDataURL("image/jpeg", 0.7); // 0.7 = 70% quality
                  resolve({ default: dataUrl });
                };

                img.onerror = (err) => reject(err);
              };

              reader.onerror = (err) => reject(err);
              reader.readAsDataURL(file);
            });
          }),
        abort: () => {},
      };
    };

    console.log("✅ CKEditor initialized with compressed Base64 images");
  })
  .catch((error) => {
    console.error(error);
  });
  
///////////////

// JS for location suggestions
const locationInput = document.querySelector('input[name="location"]');
const suggestionsList = document.getElementById('locationSuggestions');

let debounceTimer;

locationInput.addEventListener('input', function () {
    const query = this.value.trim();
    
    // Hide suggestions if input is empty
    if (!query) {
        suggestionsList.style.display = 'none';
        return;
    }

    // Debounce to avoid too many requests
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        fetch(`get-coordinates.php?location=${encodeURIComponent(query)}`)
            .then(res => res.json())
            .then(data => {
                if (data.status === 200 && data.suggestions.length > 0) {
                    suggestionsList.innerHTML = '';
                    data.suggestions.forEach(suggestion => {
                        const li = document.createElement('li');
                        li.classList.add('list-group-item', 'list-group-item-action');
                        li.style.cursor = 'pointer';
                        li.textContent = suggestion.name;
                        li.dataset.lat = suggestion.latitude;
                        li.dataset.lon = suggestion.longitude;

                        // Click event to fill input and store coordinates
                        li.addEventListener('click', () => {
                            locationInput.value = suggestion.name;
                            locationInput.dataset.lat = suggestion.latitude;
                            locationInput.dataset.lon = suggestion.longitude;
                            suggestionsList.style.display = 'none';
                        });

                        suggestionsList.appendChild(li);
                    });
                    suggestionsList.style.display = 'block';
                } else {
                    suggestionsList.style.display = 'none';
                }
            })
            .catch(err => {
                console.error(err);
                suggestionsList.style.display = 'none';
            });
    }, 300); // 300ms delay
});

// Hide suggestions when clicking outside
document.addEventListener('click', function(e) {
    if (!locationInput.contains(e.target) && !suggestionsList.contains(e.target)) {
        suggestionsList.style.display = 'none';
    }
});

////////////////


  




