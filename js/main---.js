// Common utility functions
const VendorFind = {
    // Storage keys
    STORAGE_KEYS: {
        VENDORS: 'vendorfind_vendors',
        CURRENT_USER: 'vendorfind_current_user',
        REVIEWS: 'vendorfind_reviews'
    },

    // Initialize the application
    init: function() {
        this.initializeData();
        this.setupNavigation();
        this.updateAuthUI();
    },

    // Initialize localStorage with default data
    initializeData: function() {
        // Initialize vendors array if it doesn't exist
        if (!localStorage.getItem(this.STORAGE_KEYS.VENDORS)) {
            const sampleVendors = [
                {
                    id: this.generateId(),
                    businessName: "Tasty Bites Restaurant",
                    ownerName: "John Doe",
                    email: "john@tastybites.com",
                    password: "password123",
                    category: "Food",
                    location: "Downtown",
                    description: "Serving delicious local cuisine since 2010",
                    contact: "(555) 123-4567",
                    photo: null,
                    rating: 4.5,
                    totalReviews: 28,
                    createdAt: new Date().toISOString()
                },
                {
                    id: this.generateId(),
                    businessName: "Quick Fix Repairs",
                    ownerName: "Jane Smith",
                    email: "jane@quickfix.com",
                    password: "password123",
                    category: "Services",
                    location: "Westside",
                    description: "Professional home repair services",
                    contact: "(555) 987-6543",
                    photo: null,
                    rating: 4.2,
                    totalReviews: 15,
                    createdAt: new Date().toISOString()
                }
            ];
            localStorage.setItem(this.STORAGE_KEYS.VENDORS, JSON.stringify(sampleVendors));
        }

        // Initialize reviews array if it doesn't exist
        if (!localStorage.getItem(this.STORAGE_KEYS.REVIEWS)) {
            localStorage.setItem(this.STORAGE_KEYS.REVIEWS, JSON.stringify([]));
        }
    },

    // Generate unique ID
    generateId: function() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },

    // Setup mobile navigation
    setupNavigation: function() {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');

        if (hamburger) {
            hamburger.addEventListener('click', () => {
                navMenu.classList.toggle('active');
            });
        }

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!hamburger?.contains(e.target) && !navMenu?.contains(e.target)) {
                navMenu?.classList.remove('active');
            }
        });
    },

   // Update UI based on authentication status
updateAuthUI: function() {
    const currentUser = this.getCurrentUser();
    const navMenu = document.querySelector('.nav-menu');
    
    if (navMenu) {
        // Clear any existing dynamic content first
        const existingDashboardLink = navMenu.querySelector('a[href="vendor-dashboard.html"]');
        const existingWelcomeSpan = navMenu.querySelector('.welcome-message');
        
        if (existingDashboardLink) existingDashboardLink.parentElement.remove();
        if (existingWelcomeSpan) existingWelcomeSpan.remove();
        
        if (currentUser) {
            // User is logged in - add Dashboard link before Our Impact
            const impactLink = navMenu.querySelector('a[href="sdg-impact.html"]');
            
            if (impactLink) {
                // Create dashboard list item
                const dashboardLi = document.createElement('li');
                dashboardLi.innerHTML = `<a href="vendor-dashboard.html">📊 Dashboard</a>`;
                
                // Insert dashboard before Our Impact
                navMenu.insertBefore(dashboardLi, impactLink.parentElement);
            }
            
            // Handle login/signup links
            const loginLink = navMenu.querySelector('a[href="login.html"]');
            const signupLink = navMenu.querySelector('a[href="signup.html"]');
            
            if (loginLink) {
                loginLink.parentElement.innerHTML = `<a href="#" id="logoutBtn">Logout</a>`;
            }
            if (signupLink) {
                signupLink.parentElement.innerHTML = `<span class="welcome-message">Welcome, ${currentUser.businessName || currentUser.ownerName}</span>`;
            }

            // Add logout functionality
            document.getElementById('logoutBtn')?.addEventListener('click', (e) => {
                e.preventDefault();
                this.logout();
            });
        } else {
            // User is logged out - ensure login/signup links are visible
            const loginContainer = navMenu.querySelector('a[href="login.html"]')?.parentElement;
            const signupContainer = navMenu.querySelector('a[href="signup.html"]')?.parentElement;
            
            if (loginContainer && !loginContainer.querySelector('a[href="login.html"]')) {
                loginContainer.innerHTML = `<a href="login.html">Login</a>`;
            }
            if (signupContainer && !signupContainer.querySelector('a[href="signup.html"]')) {
                signupContainer.innerHTML = `<a href="signup.html" class="btn-primary">Sign Up</a>`;
            }
        }
    }
},

    // Get current user from localStorage
    getCurrentUser: function() {
        const userJson = localStorage.getItem(this.STORAGE_KEYS.CURRENT_USER);
        return userJson ? JSON.parse(userJson) : null;
    },

    // NEW: Get vendor by ID
    getVendorById: function(id) {
        const vendors = JSON.parse(localStorage.getItem(this.STORAGE_KEYS.VENDORS)) || [];
        return vendors.find(v => v.id === id);
    },

    // NEW: Update vendor stats (views, searches, contacts)
    updateVendorStats: function(vendorId, statType) {
        // Simulate stats tracking
        const statKey = `vendor_${statType}_${vendorId}`;
        let stats = JSON.parse(localStorage.getItem(statKey)) || { count: 0 };
        stats.count++;
        stats.lastUpdated = new Date().toISOString();
        localStorage.setItem(statKey, JSON.stringify(stats));
    },

    // NEW: Share vendor profile
    shareVendorProfile: function(vendorId) {
        const url = window.location.origin + '/vendor-profile.html?id=' + vendorId;
        if (navigator.share) {
            navigator.share({
                title: 'Check out this vendor on VendorFind',
                url: url
            }).catch(() => {
                // If share fails, fallback to copy
                this.copyToClipboard(url);
            });
        } else {
            this.copyToClipboard(url);
        }
    },

    // NEW: Copy to clipboard helper
    copyToClipboard: function(text) {
        navigator.clipboard.writeText(text).then(() => {
            alert('Link copied to clipboard!');
        }).catch(() => {
            // Fallback for older browsers
            const textarea = document.createElement('textarea');
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            alert('Link copied to clipboard!');
        });
    },

    // Logout user
    logout: function() {
        localStorage.removeItem(this.STORAGE_KEYS.CURRENT_USER);
        window.location.href = 'index.html';
    },

    // Show loading spinner
    showLoading: function(container) {
        container.innerHTML = `
            <div class="loading-spinner">
                <div class="spinner"></div>
                <p>Loading...</p>
            </div>
        `;
    },

    // Show error message
    showError: function(container, message) {
        container.innerHTML = `
            <div class="error-message">
                <p>${message}</p>
            </div>
        `;
    },

    // Show no results message
    showNoResults: function(container) {
        container.innerHTML = `
            <div class="no-results">
                <h3>No vendors found</h3>
                <p>Try adjusting your search filters</p>
            </div>
        `;
    },

    // Format date
    formatDate: function(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    },

    // Generate star rating HTML
    getStarRating: function(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        let stars = '';
        
        for (let i = 0; i < fullStars; i++) {
            stars += '★';
        }
        if (hasHalfStar) {
            stars += '½';
        }
        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            stars += '☆';
        }
        
        return `<span class="rating">${stars} (${rating.toFixed(1)})</span>`;
    },

    // NEW: Get vendor stats
    getVendorStats: function(vendorId, statType) {
        const statKey = `vendor_${statType}_${vendorId}`;
        const stats = JSON.parse(localStorage.getItem(statKey)) || { count: 0 };
        return stats;
    },

    // NEW: Calculate profile completion percentage
    calculateProfileCompletion: function(vendor) {
        let completed = 0;
        const totalFields = 8; // Basic fields to check

        // Check required fields
        if (vendor.businessName) completed++;
        if (vendor.category) completed++;
        if (vendor.location) completed++;
        if (vendor.description && vendor.description.length > 20) completed++;
        if (vendor.contact) completed++;
        if (vendor.photo) completed++;
        if (vendor.businessHours) completed++;
        if (vendor.paymentMethods && vendor.paymentMethods.length > 0) completed++;

        return Math.round((completed / totalFields) * 100);
    },

    // NEW: Check if user is logged in and redirect if not
    requireAuth: function(redirectUrl = 'login.html') {
        const currentUser = this.getCurrentUser();
        if (!currentUser) {
            window.location.href = redirectUrl;
            return false;
        }
        return currentUser;
    },

    // NEW: Check if user is admin
    isAdmin: function() {
        const currentUser = this.getCurrentUser();
        return currentUser && currentUser.email === 'admin@vendorfind.com';
    },

    // NEW: Require admin access
    requireAdmin: function(redirectUrl = 'index.html') {
        if (!this.isAdmin()) {
            alert('Admin access required');
            window.location.href = redirectUrl;
            return false;
        }
        return true;
    },

    // NEW: Get all vendors with optional filtering
    getVendors: function(filters = {}) {
        let vendors = JSON.parse(localStorage.getItem(this.STORAGE_KEYS.VENDORS)) || [];
        
        if (filters.category) {
            vendors = vendors.filter(v => v.category === filters.category);
        }
        if (filters.location) {
            vendors = vendors.filter(v => 
                v.location.toLowerCase().includes(filters.location.toLowerCase())
            );
        }
        if (filters.keyword) {
            const keyword = filters.keyword.toLowerCase();
            vendors = vendors.filter(v => 
                v.businessName.toLowerCase().includes(keyword) ||
                (v.description && v.description.toLowerCase().includes(keyword)) ||
                (v.shortDescription && v.shortDescription.toLowerCase().includes(keyword))
            );
        }
        if (filters.minRating) {
            vendors = vendors.filter(v => v.rating >= filters.minRating);
        }
        
        return vendors;
    },

    // NEW: Get reviews for a vendor with filtering
    getVendorReviews: function(vendorId, filters = {}) {
        let reviews = JSON.parse(localStorage.getItem(this.STORAGE_KEYS.REVIEWS)) || [];
        reviews = reviews.filter(r => r.vendorId === vendorId);
        
        if (filters.sortBy) {
            switch(filters.sortBy) {
                case 'newest':
                    reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                    break;
                case 'oldest':
                    reviews.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
                    break;
                case 'highest':
                    reviews.sort((a, b) => b.rating - a.rating);
                    break;
                case 'lowest':
                    reviews.sort((a, b) => a.rating - b.rating);
                    break;
            }
        }
        
        if (filters.minRating) {
            reviews = reviews.filter(r => r.rating >= filters.minRating);
        }
        
        return reviews;
    },

    // NEW: Calculate rating distribution
    calculateRatingDistribution: function(reviews) {
        const distribution = {5: 0, 4: 0, 3: 0, 2: 0, 1: 0};
        reviews.forEach(review => {
            if (distribution.hasOwnProperty(review.rating)) {
                distribution[review.rating]++;
            }
        });
        return distribution;
    },

    // NEW: Update vendor rating after new review
    updateVendorRating: function(vendorId) {
        const vendors = JSON.parse(localStorage.getItem(this.STORAGE_KEYS.VENDORS)) || [];
        const reviews = JSON.parse(localStorage.getItem(this.STORAGE_KEYS.REVIEWS)) || [];
        
        const vendorIndex = vendors.findIndex(v => v.id === vendorId);
        if (vendorIndex === -1) return null;

        const vendorReviews = reviews.filter(r => r.vendorId === vendorId);
        
        if (vendorReviews.length > 0) {
            const totalRating = vendorReviews.reduce((sum, r) => sum + r.rating, 0);
            vendors[vendorIndex].rating = totalRating / vendorReviews.length;
            vendors[vendorIndex].totalReviews = vendorReviews.length;
        } else {
            vendors[vendorIndex].rating = 0;
            vendors[vendorIndex].totalReviews = 0;
        }

        localStorage.setItem(this.STORAGE_KEYS.VENDORS, JSON.stringify(vendors));
        
        // Update current user if it's the same vendor
        const currentUser = this.getCurrentUser();
        if (currentUser && currentUser.id === vendorId) {
            localStorage.setItem(this.STORAGE_KEYS.CURRENT_USER, JSON.stringify(vendors[vendorIndex]));
        }
        
        return vendors[vendorIndex];
    },

    // NEW: Save a new review
    saveReview: function(reviewData) {
        const reviews = JSON.parse(localStorage.getItem(this.STORAGE_KEYS.REVIEWS)) || [];
        
        const newReview = {
            id: this.generateId(),
            ...reviewData,
            createdAt: new Date().toISOString(),
            helpful: 0,
            reported: false
        };
        
        reviews.push(newReview);
        localStorage.setItem(this.STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
        
        // Update vendor rating
        this.updateVendorRating(reviewData.vendorId);
        
        return newReview;
    },

    // NEW: Add vendor response to review
    addVendorResponse: function(reviewId, responseText) {
        const reviews = JSON.parse(localStorage.getItem(this.STORAGE_KEYS.REVIEWS)) || [];
        const reviewIndex = reviews.findIndex(r => r.id === reviewId);
        
        if (reviewIndex !== -1) {
            reviews[reviewIndex].vendorResponse = responseText;
            reviews[reviewIndex].responseDate = new Date().toISOString();
            localStorage.setItem(this.STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
            return true;
        }
        return false;
    },

    // NEW: Mark review as helpful
    markReviewHelpful: function(reviewId) {
        const reviews = JSON.parse(localStorage.getItem(this.STORAGE_KEYS.REVIEWS)) || [];
        const reviewIndex = reviews.findIndex(r => r.id === reviewId);
        
        if (reviewIndex !== -1) {
            reviews[reviewIndex].helpful = (reviews[reviewIndex].helpful || 0) + 1;
            localStorage.setItem(this.STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
            return true;
        }
        return false;
    },

    // NEW: Generate QR code data (simplified)
    generateQRData: function(vendorId) {
        const url = window.location.origin + '/vendor-profile.html?id=' + vendorId;
        return url;
    },

    // NEW: Format phone number for click-to-call
    formatPhoneForCall: function(phone) {
        // Remove all non-numeric characters
        return 'tel:' + phone.replace(/\D/g, '');
    },

    // NEW: Format WhatsApp link
    formatWhatsAppLink: function(phone, text = '') {
        const cleanPhone = phone.replace(/\D/g, '');
        const encodedText = encodeURIComponent(text);
        return `https://wa.me/${cleanPhone}?text=${encodedText}`;
    },

    // NEW: Paginate array
    paginate: function(array, page = 1, perPage = 10) {
        const start = (page - 1) * perPage;
        const end = start + perPage;
        return {
            data: array.slice(start, end),
            total: array.length,
            page: page,
            perPage: perPage,
            totalPages: Math.ceil(array.length / perPage)
        };
    },

    // NEW: Search vendors with pagination
    searchVendorsWithPagination: function(filters = {}, page = 1, perPage = 12) {
        const vendors = this.getVendors(filters);
        return this.paginate(vendors, page, perPage);
    }
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    VendorFind.init();
});

// Make VendorFind available globally
window.VendorFind = VendorFind;