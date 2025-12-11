// js for the navbar responsive button //
const base_url = "http://localhost";
// Hamburger Menu Toggle
const hamburger = document.getElementById("hamburger");
const navMenu = document.getElementById("navMenu");

hamburger.addEventListener("click", function () {
  hamburger.classList.toggle("active");
  navMenu.classList.toggle("active");
});

// Close menu when clicking on button
const navButtons = navMenu.querySelectorAll("button, a");
navButtons.forEach((button) => {
  button.addEventListener("click", function () {
    hamburger.classList.remove("active");
    navMenu.classList.remove("active");
  });
});

// Close menu when clicking outside
document.addEventListener("click", function (event) {
  if (!event.target.closest(".navbar")) {
    hamburger.classList.remove("active");
    navMenu.classList.remove("active");
  }
});
////////////////

// js to fetch data from the real_estate_dashboard where we enter property datails  //
// Fetch property data from API
const fetchURL = `${base_url}/real_estate_dashboard/admin/get-properties.php`;
let propertyData = {};

///////

// function to fetch data from the API //
async function fetchPropertyData() {
  try {
    const response = await fetch(fetchURL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    console.log("data coming from api", data);

    // Transform API response to match our format
    if (!data) {
      console.log("no data from api");
    }
    data.forEach((property, index) => {
      propertyData[index + 1] = {
        id: property.id || index + 1,
        title: property.title || property.name || property.property_name || "",
        type: property.property_type || property.type || "Property",
        location: property.location || property.city || "Location",
        image:
          property.image_url || property.image || "./images/property-3.jpg",
        image:
          property.thumbnail ||
          property.image_url ||
          property.image ||
          "./images/property-3.jpg",
        description: property.description || property.details || "",
        features: property.content || property.key_features || "",
        bedrooms: property.category ? `${property.category} - Bedrooms` : "N/A",

        bathrooms: property.bathroom
          ? `${property.bathroom} - Bathrooms`
          : "N/A",
        size:
          property.size || property.area
            ? `${property.size || property.area} sq ft`
            : "N/A",
        price: property.price
          ? `$${Number(property.price).toLocaleString()}`
          : "Contact for price",
        latitude: property.latitude || null,
        longitude: property.longitude || null,
      };
    });

    console.log("Fetched property data:", propertyData);
    renderPropertyCards();
    attachViewDetailsListeners();
    setTimeout(setupCarouselControls());
  } catch (error) {
    console.error("Error fetching property data:", error);
    console.log("Using fallback property data");
    // propertyData = fallbackPropertyData;
    renderPropertyCards();
    attachViewDetailsListeners();
    setTimeout(setupCarouselControls());
  }
}
/////////

// js that renders the property cards dynamically maintain the cards formate//
// Render property cards dynamically
function renderPropertyCards() {
  const propertiesList = document.getElementById("propertiesList");
  propertiesList.innerHTML = ""; // Clear existing content

  Object.keys(propertyData).forEach((key) => {
    const property = propertyData[key];
    const shortDescription = property.description.substring(0, 30) + "...";
    const location = property.location.substring(0, 15) + "...";
    const title = property.title.substring(0, 20) + "...";

    const propertyHTML = `
            <div class="property-box">
                <img src="${property.image}" alt="${property.title}">
                <div class="property-box-content">
                    <div class="location">
                        <h4><i class="fa-solid fa-magnifying-glass"></i> ${property.type}</h4>
                        <h4><i class="fa-solid fa-location-dot"></i> ${location}</h4>
                    </div>
                    <h2>${title}</h2>
                    <p>${shortDescription}</p>
                    <div class="view-btn"><button class="btn view-details-btn" data-property="${key}">View Details</button></div>
                </div>
            </div>
        `;

    propertiesList.innerHTML += propertyHTML;
  });
}
////////

//  ///////////////////////////////////////////////////////////////

// Get modal elements
const modal = document.getElementById("propertyModal");
const closeBtn = document.querySelector(".close");
let currentPropertyId = null;

// Attach listeners to view details buttons
function attachViewDetailsListeners() {
  const viewDetailsButtons = document.querySelectorAll(".view-details-btn");

  viewDetailsButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const propertyId = this.getAttribute("data-property");
      // console.log("View Details clicked for property ID:", propertyId);
      const property = propertyData[propertyId];

      if (property) {
        currentPropertyId = property.id;
        console.log("Property data for modal:", property.id);
        // Populate modal with property data
        document.getElementById("modalPropertyImage").src = property.image;
        document.getElementById("modalPropertyTitle").textContent =
          property.title;
        document.getElementById(
          "modalPropertyType"
        ).innerHTML = `<i class="fa-solid fa-magnifying-glass"></i> ${property.type}`;
        document.getElementById(
          "modalPropertyLocation"
        ).innerHTML = `<i class="fa-solid fa-location-dot"></i> ${property.location}`;
        document.getElementById("modalPropertyDescription").textContent =
          property.description;
        document.getElementById("modalPropertyKeyFeatures").innerHTML =
          property.features;
        document.getElementById("modalcategory").textContent =
          property.bedrooms;
        document.getElementById("modalBathrooms").textContent =
          property.bathrooms;
        document.getElementById("modalSize").textContent = property.size;
        document.getElementById("modalPrice").textContent = property.price;

        // Show modal first
modal.style.display = "block";

// Clear any existing map instance
if (window.modalMapInstance) {
  window.modalMapInstance.remove();
}

// Get latitude and longitude from property
const lat = parseFloat(property.latitude);
const lng = parseFloat(property.longitude);

// Initialize Leaflet map in modal
if (!isNaN(lat) && !isNaN(lng)) {
  window.modalMapInstance = L.map("modalMap").setView([lat, lng], 15);

  // Add OpenStreetMap tiles
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
  }).addTo(window.modalMapInstance);

  // Add marker
  L.marker([lat, lng])
    .addTo(window.modalMapInstance)
    .bindPopup(`<b>${property.title}</b><br>${property.location}`)
    .openPopup();

  // Fix map rendering in hidden modal
  setTimeout(() => {
    window.modalMapInstance.invalidateSize();
  }, 10);
}

      }
    });
  });
}
// Close modal when clicking the X
closeBtn.addEventListener("click", function () {
  modal.style.display = "none";
  document.body.style.overflow = "auto"; // Re-enable scrolling
});

// Close modal when clicking outside the modal content
window.addEventListener("click", function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
    document.body.style.overflow = "auto"; // Re-enable scrolling
  }
});

// Close modal with Escape key
document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    modal.style.display = "none";
    document.body.style.overflow = "auto"; // Re-enable scrolling
  }
});

// Modal action buttons
document.addEventListener("DOMContentLoaded", function () {
  const modalActionButtons = document.querySelectorAll(".modal-actions button");
  modalActionButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const buttonText = this.textContent;
      alert(`Thank you! We'll help you with: ${buttonText}`);
      modal.style.display = "none";
      document.body.style.overflow = "auto";
    });
  });
});

// Fetch data on page load
document.addEventListener("DOMContentLoaded", function () {
  fetchPropertyData();
});
///////////

// js for the slider of properties cards //
// Carousel Variables
let currentScroll = 0;
const cardWidth = 330; // 300px card + 30px gap
const visibleCards = 4; // Number of cards visible at once
let autoPlayInterval;
const autoPlayDelay = 30000; // 3 seconds between slides
let totalCards = 0;

// Setup Carousel Controls
function setupCarouselControls() {
  const prevBtn = document.querySelector(".ps-nav.ps-prev");
  const nextBtn = document.querySelector(".ps-nav.ps-next");
  const propertyTrack = document.querySelector(".property-track");

  console.log(
    "Setup Carousel - prevBtn:",
    prevBtn,
    "nextBtn:",
    nextBtn,
    "propertyTrack:",
    propertyTrack
  );

  if (!prevBtn || !nextBtn || !propertyTrack) {
    console.log("Carousel buttons or track not found");
    return;
  }

  console.log("Carousel controls found! Setting up listeners...");

  // Clone cards for infinite scroll
  totalCards = Object.keys(propertyData).length;
  const allCards = propertyTrack.querySelectorAll(".property-box");
  allCards.forEach((card) => {
    const clone = card.cloneNode(true);
    propertyTrack.appendChild(clone);
  });
  console.log(
    "Cards cloned for infinite scroll. Total visible cards:",
    totalCards
  );

  // Function to scroll next
  function scrollNext() {
    currentScroll += cardWidth;
    propertyTrack.style.transform = `translateX(-${currentScroll}px)`;

    // Check if we've scrolled past the original cards and reset seamlessly
    if (currentScroll >= totalCards * cardWidth) {
      setTimeout(() => {
        propertyTrack.style.transition = "none";
        currentScroll = 0;
        propertyTrack.style.transform = `translateX(-${currentScroll}px)`;

        setTimeout(() => {
          propertyTrack.style.transition = "transform 0.5s ease-in-out";
        }, 50);
      }, 500);
    }

    console.log("Scrolled next, scroll:", currentScroll);
  }

  // Function to scroll prev
  function scrollPrev() {
    // If at start, jump to the cloned section end
    if (currentScroll === 0) {
      propertyTrack.style.transition = "none";
      currentScroll = totalCards * cardWidth;
      propertyTrack.style.transform = `translateX(-${currentScroll}px)`;

      setTimeout(() => {
        propertyTrack.style.transition = "transform 0.5s ease-in-out";
        currentScroll -= cardWidth;
        propertyTrack.style.transform = `translateX(-${currentScroll}px)`;
      }, 50);
    } else {
      currentScroll -= cardWidth;
      propertyTrack.style.transform = `translateX(-${currentScroll}px)`;
    }

    console.log("Scrolled prev, scroll:", currentScroll);
  }

  // Start auto-play
  function startAutoPlay() {
    autoPlayInterval = setInterval(scrollNext, autoPlayDelay);
    console.log("Auto-play started");
  }

  // Stop auto-play
  function stopAutoPlay() {
    clearInterval(autoPlayInterval);
    console.log("Auto-play stopped");
  }

  // Next button functionality
  nextBtn.addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();
    console.log("NEXT button clicked!");
    stopAutoPlay();
    scrollNext();
    startAutoPlay();
  });

  // Previous button functionality
  prevBtn.addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();
    console.log("PREV button clicked!");
    stopAutoPlay();
    scrollPrev();
    startAutoPlay();
  });

  // Stop auto-play on hover
  propertyTrack.addEventListener("mouseenter", stopAutoPlay);
  propertyTrack.addEventListener("mouseleave", startAutoPlay);

  // Start auto-play on load
  // startAutoPlay();
}
/////////////////

// js for live search and fetch data through search.php and when I click on the link in dropdown then call the id api //

const searchInput = document.getElementById("searchInput");
const searchDropdown = document.getElementById("searchDropdown");

let debounceTimeout;

// Function to highlight matched text
function highlightMatch(text, query) {
  const regex = new RegExp(`(${query})`, "gi");
  return text.replace(regex, "<mark>$1</mark>");
}

// Fetch search results from server
async function fetchSearchResults(query) {
  if (!query) return [];

  try {
    // call or hit the API for search
    // Correct fetch URL relative to index.html
    const fetchURL = "search.php"; // or absolute: "/real_estate_dashboard/real-estate-landing-page/search.php"
    const response = await fetch(`${fetchURL}?q=${encodeURIComponent(query)}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching search results:", error);
    return [];
  }
}

// Live search input
searchInput.addEventListener("input", function () {
  const query = this.value.trim();

  // Debounce to avoid too many requests
  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(async () => {
    searchDropdown.innerHTML = "";

    if (query.length === 0) {
      searchDropdown.style.display = "none";
      return;
    }

    const results = await fetchSearchResults(query);

    if (results.length === 0) {
      searchDropdown.style.display = "none";
      return;
    }

    results.forEach((property) => {
      const item = document.createElement("div");
      item.classList.add("dropdown-item");

      // Highlight matching text
      const title = highlightMatch(property.title, query);
      const location = highlightMatch(property.location, query);
      const type = highlightMatch(property.property_type, query);

      // show title, location, and property-type in drop down when we search any thing

      item.innerHTML = `${title} - <span class="dropdown-location">${location}</span> (${type})`;

      // Open modal when clicked
     // Open modal when clicked
item.addEventListener("click", async () => {
  const id = property.id; // very important

  // Hit the API through ID when modal opens
  const response = await fetch(
    `${base_url}/real_estate_dashboard/admin/get-property-by-id.php?id=${id}`
  );

  const full = await response.json();

  window.currentPropertyId = full.id;

  if (full.error) {
    console.error(full.error);
    return;
  }

  // Populate modal using FULL data
  document.getElementById("modalPropertyImage").src = full.thumbnail;
  document.getElementById("modalPropertyTitle").textContent = full.title;
  document.getElementById(
    "modalPropertyType"
  ).innerHTML = `<i class="fa-solid fa-magnifying-glass"></i> ${full.property_type}`;
  document.getElementById(
    "modalPropertyLocation"
  ).innerHTML = `<i class="fa-solid fa-location-dot"></i> ${full.location}`;
  document.getElementById("modalPropertyDescription").textContent =
    full.description;
  document.getElementById("modalPropertyKeyFeatures").innerHTML =
    full.content;
  document.getElementById(
    "modalcategory"
  ).textContent = `${full.category} - Bedrooms`;
  document.getElementById(
    "modalBathrooms"
  ).textContent = `${full.bathroom} - Bathrooms`;
  document.getElementById("modalSize").textContent = `${full.area} sq ft`;
  document.getElementById("modalPrice").textContent = `$${Number(
    full.price
  ).toLocaleString()}`;


  modal.style.display = "block";


  // Get coordinates
  const lat = full.latitude;
  const lng = full.longitude;
  console.log("Latitude:", lat, "Longitude:", lng);

  // Example: initialize map (if using Leaflet)
  if (!isNaN(lat) && !isNaN(lng)) {
    if (window.modalMapInstance) window.modalMapInstance.remove();

    window.modalMapInstance = L.map("modalMap").setView([lat, lng], 15);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
    }).addTo(window.modalMapInstance);

    L.marker([lat, lng]).addTo(window.modalMapInstance);
  }

  searchDropdown.style.display = "none";
  searchInput.value = "";
});


      searchDropdown.appendChild(item);
    });

    searchDropdown.style.display = "block";
  }, 300); // 300ms debounce
});
//////////

// Redirecting to contact page with property id
const contactFormBtn = document.getElementById("contactBtn");

contactFormBtn.addEventListener("click", () => {
  if (!window.currentPropertyId) {
    console.error("Property ID missing!");
    return;
  }

  window.location.href = `../real-estate-landing-page/contact.html?id=${window.currentPropertyId}`;
});


// Close dropdown when clicking outside
document.addEventListener("click", (e) => {
  if (!searchDropdown.contains(e.target) && e.target !== searchInput) {
    searchDropdown.style.display = "none";
  }
});
/////////////

// js to disable the button when search input focus or write anything
const searchInputField = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

let typingTimer;
const typingDelay = 600; // time after user stops typing (ms)
const originalText = searchBtn.innerText;

// On typing
searchInputField.addEventListener("input", () => {
  // User is typing → show loading
  clearTimeout(typingTimer);
  searchBtn.disabled = true;
  searchBtn.innerText = "Searching...";

  // When user stops typing
  typingTimer = setTimeout(() => {
    searchBtn.disabled = false;
    searchBtn.innerText = originalText;
  }, typingDelay);
});


// Show button again when clicking outside and field is empty
searchInputField.addEventListener("blur", () => {
  if (searchInputField.value.trim() === "") {
    searchBtn.classList.remove("hidden");
  }
});

// js to count the total users and properties from the database and show dynamically

async function fetchCounts() {
  try {
    const response = await fetch("count-api.php");
    const data = await response.json();

    updateCounter("propertyCount", data.total_properties);
    updateCounter("userCount", data.total_users);

  } catch (error) {
    console.error("Error fetching counts:", error);
  }
}

// Initial load
fetchCounts();

// Refresh every 5 minutes
setInterval(fetchCounts, 300000);

///////////////
// js for the counter number animation //
(function(){
  // ----------------------------
  // Utilities
  // ----------------------------
  const easeOutCubic = t => 1 - Math.pow(1 - t, 3);
  function formatNumber(n, mode) {
    if (mode === "commas") return Number(n).toLocaleString();
    return String(n);
  }
  function parseNumberFromText(text) {
    if (!text) return 0;
    return Number(String(text).replace(/,/g, "")) || 0;
  }

  // ----------------------------
  // Animation routine (returns a Promise)
  // ----------------------------
  function animateCount(el, from, to, duration = 1200, format = "commas") {
    // if nothing to do, just set
    if (from === to || duration <= 0) {
      el.textContent = formatNumber(to, format);
      return Promise.resolve();
    }

    let cancelled = false;
    return new Promise(resolve => {
      const start = performance.now();
      function frame(now) {
        if (cancelled) return resolve();
        const t = Math.min(1, (now - start) / duration);
        const v = Math.round(from + (to - from) * easeOutCubic(t));
        el.textContent = formatNumber(v, format);
        if (t < 1) requestAnimationFrame(frame);
        else {
          el.textContent = formatNumber(to, format);
          resolve();
        }
      }
      requestAnimationFrame(frame);

      // return cancel function through el._cancelAnimation (if needed)
      el._cancelAnimation = () => { cancelled = true; resolve(); };
    });
  }

  // ----------------------------
  // State per element
  // ----------------------------
  // Map element -> { visible: bool, pendingTarget: number|null, animating: bool }
  const elState = new WeakMap();

  function ensureState(el) {
    if (!elState.has(el)) elState.set(el, { visible: false, pendingTarget: null, animating: false });
    return elState.get(el);
  }

  // ----------------------------
  // IntersectionObserver (scroll trigger)
  // ----------------------------
  const observer = ("IntersectionObserver" in window) ? new IntersectionObserver((entries) => {
    entries.forEach(async entry => {
      const el = entry.target;
      const state = ensureState(el);

      if (entry.isIntersecting) {
        state.visible = true;
        // If there's a pending target (update arrived earlier), animate from current to pending
        const pending = state.pendingTarget;
        if (pending !== null && !state.animating) {
          state.animating = true;
          const current = parseNumberFromText(el.textContent);
          await animateCount(el, current, pending, Number(el.dataset.duration || 1200), el.dataset.format || "commas");
          state.pendingTarget = null;
          state.animating = false;
        }
        // After first visibility, unobserve so we don't repeatedly trigger
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.35 }) : null;

  // Observe all counters
  document.querySelectorAll(".count").forEach(el => {
    ensureState(el); // init
    if (observer) observer.observe(el);
  });

  // ----------------------------
  // Public updateCounter function
  // ----------------------------
  // id: element id, newValue: numeric
  window.updateCounter = async function(id, newValue) {
    const el = document.getElementById(id);
    if (!el) return;
    const state = ensureState(el);
    const format = el.dataset.format || "commas";
    const duration = Number(el.dataset.duration || 1200);
    newValue = Number(newValue) || 0;

    // If currently animating, cancel it (so we animate to new target)
    if (el._cancelAnimation) {
      try { el._cancelAnimation(); } catch(e) {}
      el._cancelAnimation = null;
      state.animating = false;
    }

    // If element is visible already -> animate from current -> newValue
    if (state.visible) {
      const current = parseNumberFromText(el.textContent);
      if (current === newValue) return; // no-op
      state.animating = true;
      await animateCount(el, current, newValue, duration, format);
      state.animating = false;
      state.pendingTarget = null;
    } else {
      // Not visible yet -> store pending target and update textContent to the newValue (optional)
      // We choose to set the immediate displayed value to the server value (keeps UI consistent)
      // but the animation will still run when it becomes visible (animate from previous displayed number).
      const current = parseNumberFromText(el.textContent);
      // If you prefer not to change the text until visible, comment out the next line:
      el.textContent = formatNumber(newValue, format);
      state.pendingTarget = newValue;
    }
  };

  // ----------------------------
  // Debug helper (optional)
  // ----------------------------
  window.__counterDebug = function() {
    document.querySelectorAll(".count").forEach(el => {
      console.log(el.id, ensureState(el));
    });
  };

})();

/////////////

// js for toast in landing page 
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



// js for the map

// const cardLat = parseFloat(property.latitude);
// const cardLng = parseFloat(property.longitude);

// if (!isNaN(cardLat) && !isNaN(cardLng)) {
//   const cardMap = L.map(`cardMap-${key}`).setView([cardLat, cardLng], 15);
//   L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
//     maxZoom: 19,
//   }).addTo(cardMap);
//   L.marker([cardLat, cardLng])
//     .addTo(cardMap)
//     .bindPopup(`<b>${property.title}</b>`)
//     .openPopup();
// }

///////////////


//////
// redirecting to contact page with property id //
const contactFormButton = document.getElementById("contactBtn");
// get property id from the modal or current property being viewed
contactFormButton.addEventListener("click", function (e) {
  const currentProperty = document.getElementById("modalPropertyTitle")
  console.log("Current Property ID for Contact:", currentProperty);
  window.location.href = `../real-estate-landing-page/contact.html?id=${currentPropertyId}`;
})
// Redirect to contact page with property ID
contactFormButton.addEventListener("click", function () {
  if (!window.currentPropertyId) {
    console.error("No property ID found!");
    return;
  }

  window.location.href = `../real-estate-landing-page/contact.html?id=${window.currentPropertyId}`;
});

////////////


// Get property_id from URL: contact.html?property_id=123
function getPropertyIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get("property_id");
}

const property_Id = getPropertyIdFromURL();

// Set hidden input value
document.getElementById("property_id").value = property_Id;

// Display property ID on page (optional)
document.getElementById("property-id-display").innerText = property_Id;




