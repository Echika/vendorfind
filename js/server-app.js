// =======================
// API CONFIG
// =======================
const API_BASE_URL = "http://localhost:5000/api";

// =======================
// MAIN APP
// =======================
const VendorFind = {
  STORAGE_KEYS: {
    CURRENT_USER: "vendorfind_current_user",
  },

  // =======================
  // INIT
  // =======================
  init: function () {
    this.setupNavigation();
    this.updateAuthUI();
  },

  // =======================
  // NAVIGATION
  // =======================
  setupNavigation: function () {
    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector(".nav-menu");

    hamburger?.addEventListener("click", () => {
      navMenu.classList.toggle("active");
    });

    document.addEventListener("click", (e) => {
      if (!hamburger?.contains(e.target) && !navMenu?.contains(e.target)) {
        navMenu?.classList.remove("active");
      }
    });
  },

  // =======================
  // AUTH UI
  // =======================
  updateAuthUI: function () {
    const currentUser = this.getCurrentUser();
    const navMenu = document.querySelector(".nav-menu");

    if (!navMenu) return;

    if (currentUser) {
      const loginLink = navMenu.querySelector('a[href="login.html"]');
      const signupLink = navMenu.querySelector('a[href="signup.html"]');

      if (loginLink) {
        loginLink.parentElement.innerHTML = `<a href="#" id="logoutBtn">Logout</a>`;
      }

      if (signupLink) {
        signupLink.parentElement.innerHTML = `<span class="welcome-message">Welcome, ${currentUser.businessName}</span>`;
      }

      document.getElementById("logoutBtn")?.addEventListener("click", (e) => {
        e.preventDefault();
        this.logout();
      });
    }
  },

  // =======================
  // AUTH
  // =======================
  getCurrentUser: function () {
    const user = localStorage.getItem(this.STORAGE_KEYS.CURRENT_USER);
    return user ? JSON.parse(user) : null;
  },

  logout: function () {
    localStorage.removeItem(this.STORAGE_KEYS.CURRENT_USER);
    window.location.href = "index.html";
  },

  // =======================
  // API: GET ALL VENDORS
  // =======================
  getVendors: async function (filters = {}) {
    try {
      let url = `${API_BASE_URL}/vendors`;

      const params = new URLSearchParams(filters);
      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const res = await fetch(url);
      return await res.json();
    } catch (err) {
      console.error(err);
      return [];
    }
  },

  // =======================
  // API: GET SINGLE VENDOR
  // =======================
  getVendorById: async function (id) {
    try {
      const res = await fetch(`${API_BASE_URL}/vendors/${id}`);
      return await res.json();
    } catch (err) {
      console.error(err);
      return null;
    }
  },

  // =======================
  // API: CREATE VENDOR
  // =======================
  createVendor: async function (vendorData) {
    try {
      const res = await fetch(`${API_BASE_URL}/vendors`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(vendorData),
      });

      return await res.json();
    } catch (err) {
      console.error(err);
    }
  },

  // =======================
  // API: SEARCH
  // =======================
  searchVendors: async function (filters = {}) {
    try {
      const params = new URLSearchParams(filters);
      const res = await fetch(`${API_BASE_URL}/vendors/search?${params}`);
      return await res.json();
    } catch (err) {
      console.error(err);
      return [];
    }
  },

  // =======================
  // UI HELPERS
  // =======================
  showLoading: function (container) {
    container.innerHTML = `<p>Loading...</p>`;
  },

  showError: function (container, message) {
    container.innerHTML = `<p>${message}</p>`;
  },

  showNoResults: function (container) {
    container.innerHTML = `<p>No vendors found</p>`;
  },

  // =======================
  // FORMATTERS
  // =======================
  formatDate: function (dateString) {
    return new Date(dateString).toLocaleDateString();
  },

  getStarRating: function (rating = 0) {
    return `⭐ ${rating}`;
  },

  // =======================
  // LOAD VENDORS UI
  // =======================
  loadVendorsUI: async function () {
    const container = document.getElementById("vendors");

    if (!container) return;

    this.showLoading(container);

    try {
      let vendors = await this.getVendors();

      if (!vendors.length) {
        this.showNoResults(container);
        return;
      }

      // Map backend fields → frontend fields
      vendors = vendors.map((v) => ({
        id: v.id,
        businessName: v.business_name,
        description: v.description,
        location: v.location,
      }));

      container.innerHTML = vendors
        .map(
          (v) => `
                <div class="vendor-card">
                    <h3>${v.businessName}</h3>
                    <p>${v.description}</p>
                    <p>${v.location}</p>
                </div>
            `,
        )
        .join("");
    } catch (err) {
      this.showError(container, "Failed to load vendors");
    }
  },
};

// =======================
// INIT APP
// =======================
document.addEventListener("DOMContentLoaded", () => {
  VendorFind.init();
  VendorFind.loadVendorsUI(); // auto load vendors
});

// =======================
// GLOBAL ACCESS
// =======================
window.VendorFind = VendorFind;
