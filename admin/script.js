// ============================================
// BASE URL & API ENDPOINTS
// ============================================
const base_url = "http://localhost";
const apiBase = `${base_url}/real_estate_dashboard/admin`;

// User endpoints
const getUsersURL = `${apiBase}/get_users.php`;
const addUserURL = `${apiBase}/add_user.php`;
const updateUserURL = `${apiBase}/update_user.php`;
const deleteUserURL = `${apiBase}/delete_user.php`;
const searchUsersURL = `${apiBase}/search-users.php`;

// Property endpoints
const getPropertiesURL = `${apiBase}/get-properties.php`;
const addPropertyURL = `${apiBase}/add-property.php`;
const updatePropertyURL = `${apiBase}/update-property.php`;
const deletePropertyURL = `${apiBase}/delete_property.php`;
const uploadImageURL = `${apiBase}/upload-image.php`;
const getCoordinatesURL = `${apiBase}/get-coordinates.php`;

// ============================================

let properties = [];
let currentPage = 1;
let pageLimit = 10; // 🔥 dynamic now (NOT hardcoded)

////////////////////////
// ================= USERS PAGINATION =================

// ---------- GLOBAL STATE ----------
let users = [];
let userCurrentPage = 1;
let USER_PAGE_LIMIT = 10;

// ---------- LOAD USERS ----------
function loadUsers(page = 1) {
  fetch(`${getUsersURL}?page=${page}&limit=${USER_PAGE_LIMIT}`)
    .then((res) => res.json())
    .then((res) => {
      if (!res.success) {
        console.error("❌ Failed to load users");
        return;
      }
      users = res.data;
      userCurrentPage = res.pagination.currentPage;

      renderUsers(users);
      renderUserPagination(res.pagination);
    })
    .catch((err) => console.error("❌ Error loading users:", err));
}

// ---------- RENDER USERS TABLE ----------
function renderUsers(users) {
  const tableBody = document.getElementById("userTable");
  if (!tableBody) return;

  tableBody.innerHTML = "";

  if (users.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="5" class="text-center text-muted">No users found</td>
      </tr>`;
    return;
  }

  users.forEach((user, index) => {
    const serialNo = (userCurrentPage - 1) * USER_PAGE_LIMIT + index + 1;

    tableBody.innerHTML += `
    <tr>
      <td>${serialNo}</td>
      <td>${user.fullname}</td>
      <td>${user.username}</td>
      <td>${user.email}</td>
      <td>
        <span class="status ${
          user.status === "active" ? "active" : "inactive"
        }">
          ${user.status}
        </span>
      </td>
      <td>
        <button class="btn btn-sm btn-blue" onclick="editUser(${user.id})">
          <i class="fa fa-edit"></i>
        </button>
        <button class="btn btn-sm btn-danger" onclick="deleteUser(${user.id})">
          <i class="fa fa-trash"></i>
        </button>
      </td>
    </tr>`;
  });
}

// ---------- RENDER PAGINATION ----------
function renderUserPagination(pagination) {
  const container = document.getElementById("UserPagination");
  if (!container) return;

  const current = pagination.currentPage;
  const total = pagination.totalPages;
  const delta = 2; // pages before & after current

  let html = "";

  // ---------- PREVIOUS ----------
  html += `
    <li class="page-item ${current === 1 ? "disabled" : ""}">
      <a class="page-link" href="#" onclick="loadUsers(${
        current - 1
      }); return false;">
        Prev
      </a>
    </li>`;

  // ---------- FIRST PAGE ----------
  if (current > delta + 1) {
    html += `
      <li class="page-item">
        <a class="page-link" href="#" onclick="loadUsers(1); return false;">1</a>
      </li>
      <li class="page-item disabled"><span class="page-link">...</span></li>`;
  }

  // ---------- MIDDLE PAGES ----------
  const start = Math.max(1, current - delta);
  const end = Math.min(total, current + delta);

  for (let i = start; i <= end; i++) {
    html += `
      <li class="page-item ${i === current ? "active" : ""}">
        <a class="page-link" href="#" onclick="loadUsers(${i}); return false;">
          ${i}
        </a>
      </li>`;
  }

  // ---------- LAST PAGE ----------
  if (current < total - delta) {
    html += `
      <li class="page-item disabled"><span class="page-link">...</span></li>
      <li class="page-item">
        <a class="page-link" href="#" onclick="loadUsers(${total}); return false;">
          ${total}
        </a>
      </li>`;
  }

  // ---------- NEXT ----------
  html += `
    <li class="page-item ${current === total ? "disabled" : ""}">
      <a class="page-link" href="#" onclick="loadUsers(${
        current + 1
      }); return false;">
      Next
      </a>
      </li>`;
      
      container.innerHTML = html;
    }
    
    // ---------- PAGE LIMIT CHANGE ----------
    document.getElementById("pageLimit").addEventListener("change", function () {
      USER_PAGE_LIMIT = parseInt(this.value);
      loadUsers(1);
    });
    
    // ---------- INITIAL LOAD ----------
    document.addEventListener("DOMContentLoaded", function () {
      loadUsers(1);
      
      // ===== USER SEARCH FUNCTIONALITY =====
      const searchInput = document.getElementById("search-users");
      const searchDropdown = document.getElementById("searchDropdown");
      
      if (searchInput) {
    searchInput.addEventListener("input", function () {
      const searchQuery = this.value.trim();
      
      // Hide dropdown if search is empty
      if (!searchQuery) {
        searchDropdown.innerHTML = "";
        return;
      }
      
      // Fetch search results
      fetch(`${searchUsersURL}?q=${encodeURIComponent(searchQuery)}`)
        .then((res) => res.json())
        .then((res) => {
          if (!res.success || res.data.length === 0) {
            searchDropdown.innerHTML =
            '<div class="dropdown-item disabled">No users found</div>';
            return;
          }
          
          // Build dropdown list
          let dropdownHTML = "";
          res.data.forEach((user) => {
            dropdownHTML += `
            <button type="button" class="dropdown-item" onclick="selectUser(${user.id}, '${user.fullname}', '${user.username}'); return false;">
            <strong>${user.fullname}</strong> (@${user.username})
            <br>
            <small class="text-muted">${user.email}</small>
            </button>`;
          });
          
          searchDropdown.innerHTML = dropdownHTML;
        })
        .catch((err) => {
          console.error("❌ Search error:", err);
          searchDropdown.innerHTML =
          '<div class="dropdown-item disabled">Error searching users</div>';
        });
      });

      // Clear dropdown when clicking outside
      document.addEventListener("click", function (e) {
        if (!searchInput.contains(e.target) && !searchDropdown.contains(e.target)) {
          searchDropdown.innerHTML = "";
        }
      });
    }
  });

  // ================= END USERS PAGINATION =================
  //////////////////////////////////
  // js to traggle nav btn
  document.addEventListener("DOMContentLoaded", function () {
  const sidebar = document.querySelector(".sidebar");
  const toggleBtn = document.getElementById("sidebarToggle");

  toggleBtn.addEventListener("click", function () {
    sidebar.classList.toggle("show");
    toggleBtn.classList.toggle("active");
  });

  // Close sidebar when clicking sidebar link (mobile)
  document.querySelectorAll(".sidebar a").forEach((link) => {
    link.addEventListener("click", () => {
      sidebar.classList.remove("show");
      toggleBtn.classList.remove("active");
    });
  });
});

//////////////////
let isEditMode = false;
let editingPropertyId = null;

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
  document.getElementById("userForm").addEventListener("submit", function (e) {
    e.preventDefault();

    // HTML5 validation first
    if (!this.checkValidity()) {
      this.reportValidity(); // <-- show browser validation popup
      return;
    }

    // Now JS validation
    if (window.editingUserId) {
      updateUserForm(); // Update user
    } else {
      saveUser(); // Save new user
    }
  });

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
///////
// ===============================
// ===== DEBOUNCE UTILITY =====
// ===============================
function debounce(func, delay = 500) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

// ===============================
// ===== SELECT USER FROM SEARCH DROPDOWN =====
// ===============================
const debouncedFetchUserById = debounce(function (userId) {
  console.log("Fetching user data for ID:", userId);

  fetch(`./get-user-by-id.php?id=${userId}`)
    .then(res => {
      console.log("Response status:", res.status);
      return res.json();
    })
    .then(data => {
      console.log("User data received:", data);

      if (data.error) {
        console.error("API returned error:", data.error);
        showToastNotification("User not found", "error");
        return;
      }

      const user = data;
      window.currentUserData = user;

      const modalUserName = document.getElementById("modalUserName");
      const modalUserFullName = document.getElementById("modalUserFullName");
      const modalUserUsername = document.getElementById("modalUserUsername");
      const modalUserEmail = document.getElementById("modalUserEmail");
      const modalUserRole = document.getElementById("modalUserRole");
      const modalUserStatus = document.getElementById("modalUserStatus");

      if (modalUserName) modalUserName.textContent = user.fullname || "";
      if (modalUserFullName) modalUserFullName.textContent = user.fullname || "-";
      if (modalUserUsername) modalUserUsername.textContent = user.username || "-";
      if (modalUserEmail) modalUserEmail.textContent = user.email || "-";
      if (modalUserRole) modalUserRole.textContent = (user.role || "-").toUpperCase();
      if (modalUserStatus)
        modalUserStatus.innerHTML = `<span class="status ${user.status === 'active' ? 'active' : 'inactive'}">${user.status}</span>`;

      // Open the user modal
      const modal = document.getElementById("userModal");
      if (modal) {
        modal.style.display = "block";
        console.log("✅ User modal opened successfully");
      } else {
        console.error("userModal element not found!");
        showToastNotification("User modal not found on this page", "error");
      }
    })
    .catch(err => {
      console.error("Error fetching user:", err);
      showToastNotification("Error loading user", "error");
    });
}, 300);

function selectUser(userId, fullname, username) {
  const searchInput = document.getElementById("search-users");
  const searchDropdown = document.getElementById("searchDropdown");

  // Update search input and clear dropdown
  searchInput.value = `${fullname} (@${username})`;
  searchDropdown.innerHTML = "";

  window.currentUserId = userId;

  // Fetch user data with debounce
  debouncedFetchUserById(userId);
}

// ===============================
// ===== CLOSE USER MODAL =====
// ===============================
function closeUserModal() {
  const modal = document.getElementById("userModal");
  if (modal) {
    modal.style.display = "none";
    console.log("User modal closed");
  }
}

// ===============================
// ===== EDIT USER FROM MODAL =====
// ===============================
function editUserFromModal() {
  const userId = window.currentUserId;
  const userData = window.currentUserData;

  if (!userId || !userData) {
    showToastNotification("User data not found", "error");
    return;
  }

  closeUserModal();

  setTimeout(() => {
    // Populate form fields
    document.getElementById("name").value = userData.fullname || "";
    document.getElementById("username").value = userData.username || "";
    document.getElementById("email").value = userData.email || "";
    document.getElementById("status").value = userData.status || "active";
    document.getElementById("role").value = userData.role || "";

    window.editingUserId = userId;

    // Update modal UI
    document.getElementById("addUserLabel").textContent = "Edit User";
    document.getElementById("saveUser").textContent = "Update";

    // Show edit modal using Bootstrap
    const addUserModalEl = document.getElementById("addUserModal");
    const modal = bootstrap.Modal.getInstance(addUserModalEl) || new bootstrap.Modal(addUserModalEl);
    modal.show();
  }, 300);
}

// ===============================
// ===== USER MODAL CLOSE EVENTS =====
// ===============================
document.addEventListener("DOMContentLoaded", function () {
  const userModal = document.getElementById("userModal");
  console.log("User modal element found:", !!userModal);

  if (!userModal) return;

  // Close modal on outside click
  userModal.addEventListener("click", function (e) {
    if (e.target === userModal) {
      closeUserModal();
      console.log("User modal closed via outside click");
    }
  });
});

// Edit user function
function editUser(id) {
  const user = users.find((u) => Number(u.id) === Number(id));

  if (!user) {
    showToastNotification("User not found", "error");
    return;
  }

  document.getElementById("name").value = user.fullname;
  document.getElementById("username").value = user.username;
  document.getElementById("email").value = user.email;
  document.getElementById("status").value = user.status;
  document.getElementById("role").value = user.role;

  window.editingUserId = user.id;

  document.getElementById("addUserLabel").textContent = "Edit User";
  document.getElementById("saveUser").textContent = "Update";

  const modal =
    bootstrap.Modal.getInstance(addUserModal) ||
    new bootstrap.Modal(addUserModal);
  modal.show();
}

// Update user form submission
async function updateUserForm() {
  const fullname = document.getElementById("name").value.trim();
  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const role = document.getElementById("role").value.trim();
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

  if (!fullname || !username || !email || !role) {
    showToastNotification("Please fill all required fields!", "warning");
    return;
  }

  // If password is provided, verify match
  if (password && password !== confirmPassword) {
    showToastNotification("Passwords do not match!", "error");
    return;
  }

  try {
    const payload = { fullname, username, email, status, role };
    if (password) {
      payload.password = password;
    }
    payload.id = editingUserId;

    const response = await fetch(updateUserURL, {
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
/////////////
/////////////
// function to save user in database
async function saveUser() {
  // If editing, use updateUserForm instead
  if (window.editingUserId) {
    return updateUserForm();
  }

  const fullname = document.getElementById("name").value.trim();
  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const role = document.getElementById("role").value.trim();
  const password = document.getElementById("password").value.trim();
  const confirmPassword = document
    .getElementById("confirmPassword")
    .value.trim();
  const status = document.getElementById("status").value;

  console.log("🔍 Form values:", { fullname, username, email, status, role });

  if (!fullname || !username || !email || !password || !role) {
    showToastNotification("Please fill all fields!", "warning");
    return;
  }
  if (password !== confirmPassword) {
    showToastNotification("Passwords do not match!", "error");
    return;
  }

  console.log("✅ Form validation passed, sending to add_user.php...");

  try {
    const response = await fetch(addUserURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullname,
        username,
        email,
        password,
        role,
        status,
      }),
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
    // const stored = JSON.parse(localStorage.getItem("users") || "[]");
    const localIndex = stored.findIndex(
      (u) => u._localId && Number(u._localId) === nid
    );
    if (localIndex !== -1) {
      stored.splice(localIndex, 1);
      // localStorage.setItem("users", JSON.stringify(stored));
      renderUsers(stored);
      // alert("🗑️ Local user removed");
      return;
    }
  } catch (e) {
    console.warn("Could not access local users:", e);
  }

  // Otherwise try deleting on the server (delete_user.php expects ?id=)
  fetch(`${deleteUserURL}?id=${encodeURIComponent(nid)}`)
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
  fetch(`${deletePropertyURL}?id=${encodeURIComponent(id)}`)
    .then((res) => {
      if (!res.ok) throw new Error("Network response was not ok " + res.status);
      return res.json();
    })
    .then((data) => {
      if (data && data.success) {
        showToastNotification("Property deleted!", "success");

        // ✅ RELOAD USING PAGINATION LOGIC
        fetchProperties(currentPage);
      } else {
        showToastNotification("Failed to delete property", "error");
      }
    })
    .catch((err) => {
      console.error("Delete property error", err);
      showToastNotification("Delete failed", "error");
    });
}

/////////////////////
/////////////
// const apiBase = "./"; // all PHP files are in the same folder

// ///  //

// Store properties in array
// let properties = [];
let rowCounter = 1;
async function uploadImage() {
  const file = document.getElementById("imageFile").files[0];
  if (!file) {
    showToastNotification("Please select an image", "warning");
    return;
  }

  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(uploadImageURL, {
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
    const res = await fetch(getPropertiesURL);
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
//////////////////////////
// js for pagination and render data in table
////////////

// ================= GLOBAL STATE =================
// let properties = [];
// let currentPage = 1;
// const PAGE_LIMIT = 10;

// ================= FETCH DATA ===================
function fetchProperties(page = 1) {
  fetch(`${getPropertiesURL}?page=${page}&limit=${pageLimit}`)
    .then((res) => res.json())
    .then((res) => {
      if (!res.success) return;

      properties = res.data;
      currentPage = res.pagination.currentPage;

      displayProperties();
      renderPagination(res.pagination);
    })
    .catch((err) => console.error(err));
}

// ================= TABLE RENDER =================
function displayProperties() {
  const tbody = document.getElementById("propertiesList");
  if (!tbody) return;

  if (!properties || properties.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="${USER_ROLE === "admin" ? 11 : 10}"
            class="text-center text-muted">
          No properties found
        </td>
      </tr>`;
    return;
  }

  tbody.innerHTML = "";

  properties.forEach((prop, index) => {
    let actionTd = "";
    if (USER_ROLE === "admin") {
      actionTd = `
        <td style="display:flex">
          <button class="btn btn-sm btn-blue me-1"
            onclick="editProperty(${prop.id})">
            <i class="fa fa-edit"></i>
          </button>

          <button class="btn btn-sm btn-danger"
            onclick="deleteProperty(${prop.id})">
            <i class="fa fa-trash"></i>
          </button>
        </td>`;
    }

    tbody.insertAdjacentHTML(
      "beforeend",
      `
      <tr>
        <td>${(currentPage - 1) * pageLimit + index + 1}</td>
        <td>${prop.title}</td>
        <td>${prop.description}</td>
        <td>${prop.category}</td>
        <td>${prop.area}</td>
        <td>${prop.bathroom}</td>
        <td>${prop.property_type}</td>
        <td>${prop.price}</td>
        <td>${prop.location}</td>
        <td>
          <img src="${prop.thumbnail}"
               width="80"
               class="property-thumb"
               style="cursor:pointer">
        </td>
        ${actionTd}
      </tr>
      `
    );
  });
}

// ================= PAGINATION UI =================
function renderPagination(pagination) {
  const container = document.getElementById("PropertyPagination");
  if (!container) return;

  const current = pagination.currentPage;
  const total = pagination.totalPages;
  const delta = 2; // pages around current

  let html = "";

  // ---------- PREVIOUS ----------
  html += `
    <li class="page-item ${current === 1 ? "disabled" : ""}">
      <a class="page-link" href="#"
         onclick="changePage(${current - 1}); return false;">
        Prev
      </a>
    </li>`;

  // ---------- FIRST PAGE ----------
  if (current > delta + 1) {
    html += `
      <li class="page-item">
        <a class="page-link" href="#"
           onclick="changePage(1); return false;">1</a>
      </li>
      <li class="page-item disabled">
        <span class="page-link">...</span>
      </li>`;
  }

  // ---------- MIDDLE PAGES ----------
  const start = Math.max(1, current - delta);
  const end = Math.min(total, current + delta);

  for (let i = start; i <= end; i++) {
    html += `
      <li class="page-item ${i === current ? "active" : ""}">
        <a class="page-link" href="#"
           onclick="changePage(${i}); return false;">
          ${i}
        </a>
      </li>`;
  }

  // ---------- LAST PAGE ----------
  if (current < total - delta) {
    html += `
      <li class="page-item disabled">
        <span class="page-link">...</span>
      </li>
      <li class="page-item">
        <a class="page-link" href="#"
           onclick="changePage(${total}); return false;">
          ${total}
        </a>
      </li>`;
  }

  // ---------- NEXT ----------
  html += `
    <li class="page-item ${current === total ? "disabled" : ""}">
      <a class="page-link" href="#"
         onclick="changePage(${current + 1}); return false;">
        Next
      </a>
    </li>`;

  container.innerHTML = html;
}

// ================= PAGE CHANGE =================
function changePage(page) {
  currentPage = page;
  fetchProperties(page);
}

// ================= LIMIT CHANGE =================
document.getElementById("pageLimit").addEventListener("change", function () {
  pageLimit = parseInt(this.value);
  currentPage = 1; // reset page
  fetchProperties(currentPage);
});

// ================= INITIAL LOAD ==================
document.addEventListener("DOMContentLoaded", () => {
  fetchProperties(1);
});

/////////////////
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

document.addEventListener("DOMContentLoaded", function () {
  console.log("⚡ DOM Loaded — initializing property system...");

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

      if (!isEditMode && !file) {
        showToastNotification("Please upload a thumbnail image!", "warning");
        resetBtn();
        return;
      }

      // Upload image to Cloudinary
      let cloudUrl = "";

      if (file) {
        cloudUrl = await uploadToCloudinary(file);
        if (!cloudUrl) {
          showToastNotification("Failed to upload image!", "error");
          resetBtn();
          return;
        }
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
      if (cloudUrl) {
        formData.append("thumbnail_url", cloudUrl);
      }

      // ✅ Append latitude & longitude (fixed)
      if (locationInput?.dataset?.lat && locationInput?.dataset?.lon) {
        formData.append("latitude", locationInput.dataset.lat);
        formData.append("longitude", locationInput.dataset.lon);
      } else {
        formData.append("latitude", "");
        formData.append("longitude", "");
      }

      try {
        let apiUrl = addPropertyURL;

        if (isEditMode && editingPropertyId) {
          apiUrl = updatePropertyURL;
          formData.append("id", editingPropertyId);

          // IMPORTANT: thumbnail optional in update
          formData.delete("thumbnail_url");
        }

        const response = await fetch(apiUrl, {
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
          showToastNotification(
            isEditMode
              ? "Property updated successfully!"
              : "Property added successfully!",
            "success"
          );

          // await loadPropertiesFromServer();
          await fetchProperties(currentPage);

          form.reset();

          // 🔄 RESET EDIT MODE
          isEditMode = false;
          editingPropertyId = null;
          document.getElementById("propertyId").value = "";
          document.getElementById("modalTitle").innerText = "Add Property";
          document.getElementById("submitBtn").innerText = "Submit";

          // ✅ Clear stored dataset
          if (locationInput) {
            delete locationInput.dataset.lat;
            delete locationInput.dataset.lon;
          }

          // ✅ Close Bootstrap modal
          const modalEl = document.getElementById("addUserModal"); // <-- your modal id
          if (modalEl) {
            const modalInstance =
              bootstrap.Modal.getInstance(modalEl) ||
              new bootstrap.Modal(modalEl);
            modalInstance.hide();
          }
        } else {
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
  const preset = API_CONFIG.CLOUDINARY_UPLOAD_PRESET;
  const cloudName = API_CONFIG.CLOUDINARY_CLOUD_NAME;

  console.log("📡 Cloudinary Upload Started...");
  console.log("🌐 Cloud Name:", cloudName);
  console.log("🎛 Upload Preset:", preset);

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", preset);

  try {
    const res = await fetch(
      API_CONFIG.CLOUDINARY_API_URL,
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
///////////////
/////////////////////////////////

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
const suggestionsList = document.getElementById("locationSuggestions");

let debounceTimer;

locationInput.addEventListener("input", function () {
  const query = this.value.trim();

  // Hide suggestions if input is empty
  if (!query) {
    suggestionsList.style.display = "none";
    return;
  }

  // Debounce to avoid too many requests
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    fetch(`${getCoordinatesURL}?location=${encodeURIComponent(query)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 200 && data.suggestions.length > 0) {
          suggestionsList.innerHTML = "";
          data.suggestions.forEach((suggestion) => {
            const li = document.createElement("li");
            li.classList.add("list-group-item", "list-group-item-action");
            li.style.cursor = "pointer";
            li.textContent = suggestion.name;
            li.dataset.lat = suggestion.latitude;
            li.dataset.lon = suggestion.longitude;

            // Click event to fill input and store coordinates
            li.addEventListener("click", () => {
              locationInput.value = suggestion.name;
              locationInput.dataset.lat = suggestion.latitude;
              locationInput.dataset.lon = suggestion.longitude;
              suggestionsList.style.display = "none";
            });

            suggestionsList.appendChild(li);
          });
          suggestionsList.style.display = "block";
        } else {
          suggestionsList.style.display = "none";
        }
      })
      .catch((err) => {
        console.error(err);
        suggestionsList.style.display = "none";
      });
  }, 300); // 300ms delay
});

// Hide suggestions when clicking outside
document.addEventListener("click", function (e) {
  if (
    !locationInput.contains(e.target) &&
    !suggestionsList.contains(e.target)
  ) {
    suggestionsList.style.display = "none";
  }
});

////////////////
function editProperty(id) {
  const prop = properties.find((p) => Number(p.id) === Number(id));
  if (!prop) {
    showToastNotification("Property not found", "error");
    return;
  }

  isEditMode = true;
  editingPropertyId = id;

  // Fill form fields
  const form = document.getElementById("propertyForm");
  form.title.value = prop.title || "";
  form.description.value = prop.description || "";
  form.category.value = prop.category || "";
  form.area.value = prop.area || "";
  form.bathroom.value = prop.bathroom || "";
  form.property_type.value = prop.property_type || "";
  form.price.value = prop.price || "";
  form.location.value = prop.location || "";

  // hidden id
  document.getElementById("propertyId").value = id;

  // CKEditor content
  if (window.editorInstance) {
    editorInstance.setData(prop.content || "");
  }

  // modal UI change
  document.getElementById("modalTitle").innerText = "Update Property";
  document.getElementById("submitBtn").innerText = "Update";

  // show modal
  const modalEl = document.getElementById("addUserModal");
  const modal =
    bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
  modal.show();
}
///////////////
document
  .getElementById("addUserModal")
  .addEventListener("hidden.bs.modal", () => {
    isEditMode = false;
    editingPropertyId = null;
    document.getElementById("propertyId").value = "";
    document.getElementById("modalTitle").innerText = "Add Property";
    document.getElementById("submitBtn").innerText = "Submit";

    if (window.editorInstance) {
      editorInstance.setData("");
    }
  });
/////////////////
//////////////////
// js for the property search in CRM from the db list 
// ===============================
// ===== DEBOUNCE UTILITY =====
// ===============================
function debounce(func, delay = 400) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

// ===============================
// ===== PROPERTY SEARCH FUNCTIONALITY =====
// ===============================
const propertySearchInput = document.getElementById("search-property");
const propertyDropdown = document.getElementById("searchDropdown");

const searchPropertyURL = "./search-property.php";

// -------- DEBOUNCED SEARCH FUNCTION --------
const debouncedPropertySearch = debounce(function () {
  const searchQuery = propertySearchInput.value.trim();

  if (!searchQuery) {
    propertyDropdown.innerHTML = "";
    return;
  }

  fetch(`${searchPropertyURL}?q=${encodeURIComponent(searchQuery)}`)
    .then(res => res.json())
    .then(res => {
      if (!res.success || res.data.length === 0) {
        propertyDropdown.innerHTML =
          '<div class="dropdown-item disabled">No properties found</div>';
        return;
      }

      let html = "";
      res.data.forEach(p => {
        html += `
          <button type="button" class="dropdown-item"
            onclick="selectProperty(
              ${p.id},
              '${p.title.replace(/'/g, "\\'")}',
              '${(p.location ?? "").replace(/'/g, "\\'")}',
              '${(p.property_type ?? "").replace(/'/g, "\\'")}'
            ); return false;">
            <strong>${p.title}</strong><br>
            <small class="text-muted">
              ${p.location ?? ""} • ${p.property_type ?? ""}
              • Rs ${p.price}
            </small>
          </button>
        `;
      });

      propertyDropdown.innerHTML = html;
    })
    .catch(err => {
      console.error("❌ Property search error:", err);
      propertyDropdown.innerHTML =
        '<div class="dropdown-item disabled">Error searching properties</div>';
    });
}, 400);

// -------- INPUT LISTENER --------
if (propertySearchInput) {
  propertySearchInput.addEventListener("input", debouncedPropertySearch);

  // Close dropdown on outside click
  document.addEventListener("click", function (e) {
    if (
      !propertySearchInput.contains(e.target) &&
      !propertyDropdown.contains(e.target)
    ) {
      propertyDropdown.innerHTML = "";
    }
  });
}

///////////////////////////////
// ===== SELECT PROPERTY FROM SEARCH DROPDOWN =====
function selectProperty(propertyId) {
  console.log("selectProperty called with ID:", propertyId);

  const searchInput = document.getElementById("search-property");
  const searchDropdown = document.getElementById("searchDropdown");

  // Clear input & dropdown
  searchInput.value = "";
  searchDropdown.innerHTML = "";

  // Fetch property and open modal
  setTimeout(() => {
    fetch(`./get-property-by-id.php?id=${propertyId}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          showToastNotification("Property not found", "error");
          return;
        }

        const prop = data;

        // Modal elements
        const modalPropertyImage = document.getElementById("modalPropertyImage");
        const modalPropertyType = document.getElementById("modalPropertyType");
        const modalPropertyLocation = document.getElementById("modalPropertyLocation");
        const modalPropertyTitle = document.getElementById("modalPropertyTitle");
        const modalPrice = document.getElementById("modalPrice");
        const modalCategory = document.getElementById("modalcategory");
        const modalBathrooms = document.getElementById("modalBathrooms");
        const modalSize = document.getElementById("modalSize");
        const modalCalender = document.getElementById("modalCalender");
        const modalPropertyDescription = document.getElementById("modalPropertyDescription");
        const modalPropertyKeyFeatures = document.getElementById("modalPropertyKeyFeatures");

        if (modalPropertyImage) modalPropertyImage.src = prop.thumbnail || "";
        if (modalPropertyType) modalPropertyType.textContent = prop.property_type || "";
        if (modalPropertyLocation) modalPropertyLocation.textContent = prop.location || "";
        if (modalPropertyTitle) modalPropertyTitle.textContent = prop.title || "";
        if (modalPrice) modalPrice.textContent = `$ ${prop.price || ""}`;
        if (modalCategory) modalCategory.textContent = prop.category || "";
        if (modalBathrooms) modalBathrooms.textContent = prop.bathroom || "";
        if (modalSize) modalSize.textContent = `${prop.area || ""} sqft`;
        if (modalCalender)
          modalCalender.textContent = prop.created_at
            ? new Date(prop.created_at).toLocaleDateString()
            : "";
        if (modalPropertyDescription)
          modalPropertyDescription.textContent = prop.description || "";
        if (modalPropertyKeyFeatures)
          modalPropertyKeyFeatures.innerHTML = prop.content || "";

        // Store property ID for contact agent
        window.currentPropertyId = propertyId;

        // Open modal
        const modal = document.getElementById("propertyModal");
        if (modal) {
          modal.style.display = "block";
        } else {
          showToastNotification("Property modal not found", "error");
        }
      })
      .catch(err => {
        console.error("Error fetching property:", err);
        showToastNotification("Error loading property", "error");
      });
  }, 300);
}

// ===============================
// ===== CONTACT AGENT FUNCTION =====
// ===============================
function contactAgent() {
  const propertyId = window.currentPropertyId;

  if (!propertyId) {
    showToastNotification("Property ID not found", "error");
    return;
  }

  window.location.href = `../real-estate-landing-page/contact.html?id=${propertyId}`;
}

// ===============================
// ===== CLOSE PROPERTY MODAL =====
// ===============================
document.addEventListener("DOMContentLoaded", function () {
  const modal = document.getElementById("propertyModal");
  if (!modal) return;

  const closeBtn = modal.querySelector(".close");

  if (closeBtn) {
    closeBtn.addEventListener("click", function (e) {
      e.preventDefault();
      modal.style.display = "none";
    });
  }

  modal.addEventListener("click", function (e) {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });
});

////////////////////////////////////
