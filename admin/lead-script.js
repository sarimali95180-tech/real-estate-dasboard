/////
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

/////////////////////////////////
// ===== SIDEBAR TOGGLE =====
document.addEventListener("DOMContentLoaded", function () {
  const sidebar = document.querySelector(".sidebar");
  const toggleBtn = document.getElementById("sidebarToggle");

  toggleBtn.addEventListener("click", function () {
    sidebar.classList.toggle("show");
    toggleBtn.classList.toggle("active");
  });

  document.querySelectorAll(".sidebar a").forEach((link) => {
    link.addEventListener("click", () => {
      sidebar.classList.remove("show");
      toggleBtn.classList.remove("active");
    });
  });
});

/////////////////////////////////
// ===== GLOBAL STATE =====
let currentPage = 1;
let pageLimit = 10;

/////////////////////////////////
// ===== XSS PROTECTION =====
function escapeHtml(text) {
  if (text === null || text === undefined) return "";
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/////////////////////////////////
// ===== LOAD LEADS =====
async function loadLeads(page = 1) {
  const tbody = document.getElementById("leadList");
  const pagination = document.getElementById("leadPagination");

  tbody.innerHTML = `
    <tr>
      <td colspan="5" class="text-center text-muted">Loading...</td>
    </tr>
  `;

  try {
    const response = await fetch(
      `get-contacts.php?page=${page}&limit=${pageLimit}`
    );
    const result = await response.json();

    if (result.status !== "success" || result.data.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="5" class="text-center text-muted">No leads found</td>
        </tr>
      `;
      pagination.innerHTML = "";
      return;
    }

    tbody.innerHTML = "";

    result.data.forEach((lead, index) => {
      const serialNo = (currentPage - 1) * pageLimit + index + 1;

      tbody.innerHTML += `
        <tr>
          <td>${serialNo}</td>
          <td>${escapeHtml(lead.fullname)}</td>
          <td>${escapeHtml(lead.email)}</td>
          <td>${escapeHtml(lead.phonenumber)}</td>
          <td class="text-center">
            <a href="view-lead.php?id=${lead.id}" class="btn btn-sm btn-primary">
              View
            </a>
          </td>
        </tr>
      `;
    });

    renderPagination(result.pagination);
  } catch (error) {
    console.error(error);
    tbody.innerHTML = `
      <tr>
        <td colspan="5" class="text-center text-danger">
          Failed to load leads
        </td>
      </tr>
    `;
  }
}

/////////////////////////////////
// ===== PAGINATION UI =====
function renderPagination({ currentPage, totalPages }) {
  const ul = document.getElementById("leadPagination");
  if (!ul) return;

  ul.innerHTML = "";
  const delta = 2;

  ul.innerHTML += `
    <li class="page-item ${currentPage === 1 ? "disabled" : ""}">
      <button class="page-link" onclick="changePage(${currentPage - 1})">Prev</button>
    </li>
  `;

  if (currentPage > delta + 1) {
    ul.innerHTML += `
      <li class="page-item">
        <button class="page-link" onclick="changePage(1)">1</button>
      </li>
      <li class="page-item disabled"><span class="page-link">...</span></li>
    `;
  }

  const start = Math.max(1, currentPage - delta);
  const end = Math.min(totalPages, currentPage + delta);

  for (let i = start; i <= end; i++) {
    ul.innerHTML += `
      <li class="page-item ${i === currentPage ? "active" : ""}">
        <button class="page-link" onclick="changePage(${i})">${i}</button>
      </li>
    `;
  }

  if (currentPage < totalPages - delta) {
    ul.innerHTML += `
      <li class="page-item disabled"><span class="page-link">...</span></li>
      <li class="page-item">
        <button class="page-link" onclick="changePage(${totalPages})">${totalPages}</button>
      </li>
    `;
  }

  ul.innerHTML += `
    <li class="page-item ${currentPage === totalPages ? "disabled" : ""}">
      <button class="page-link" onclick="changePage(${currentPage + 1})">Next</button>
    </li>
  `;
}

function changePage(page) {
  currentPage = page;
  loadLeads(page);
}

document.getElementById("pageLimit").addEventListener("change", function () {
  pageLimit = parseInt(this.value);
  currentPage = 1;
  loadLeads(currentPage);
});

document.addEventListener("DOMContentLoaded", function () {
  loadLeads(currentPage);
});

/////////////////////////////////
// ===== DEBOUNCE FUNCTION =====
function debounce(fn, delay = 500) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

/////////////////////////////////
// ===== LEAD SEARCH =====
const leadSearchInput = document.getElementById("search-leads");
const leadDropdown = document.getElementById("searchDropdown");
const searchLeadsURL = "./search-leads.php";

function searchLeads(query) {
  if (!query) {
    leadDropdown.innerHTML = "";
    return;
  }

  fetch(`${searchLeadsURL}?q=${encodeURIComponent(query)}`)
    .then(res => res.json())
    .then(res => {
      if (!res.success || res.data.length === 0) {
        leadDropdown.innerHTML =
          '<div class="dropdown-item disabled">No leads found</div>';
        return;
      }

      let html = "";
      res.data.forEach(l => {
        html += `
          <button type="button" class="dropdown-item"
            onclick="selectLead(${l.id}); return false;">
            <strong>${l.fullname}</strong><br>
            <small class="text-muted">
              ${l.email} • ${l.phonenumber}<br>
              ${l.purpose} • Budget: ${l.budget}
            </small>
          </button>
        `;
      });

      leadDropdown.innerHTML = html;
    })
    .catch(err => {
      console.error("❌ Lead search error:", err);
      leadDropdown.innerHTML =
        '<div class="dropdown-item disabled">Error searching leads</div>';
    });
}

const debouncedSearchLeads = debounce(searchLeads, 500);

if (leadSearchInput) {
  leadSearchInput.addEventListener("input", function () {
    debouncedSearchLeads(this.value.trim());
  });

  document.addEventListener("click", function (e) {
    if (
      !leadSearchInput.contains(e.target) &&
      !leadDropdown.contains(e.target)
    ) {
      leadDropdown.innerHTML = "";
    }
  });
}

/////////////////////////////////
// ===== SELECT LEAD =====
function selectLead(id) {
  setTimeout(() => {
    window.location.href = `view-lead.php?id=${id}`;
  }, 300);
}
