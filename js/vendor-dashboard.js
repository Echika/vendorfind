// Vendor Dashboard Functionality
document.addEventListener('DOMContentLoaded', () => {
    const currentUser = VendorFind.getCurrentUser();
    
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }

    // Check if we're on dashboard or edit page
    if (document.querySelector('.dashboard-page')) {
        if (window.location.pathname.includes('vendor-edit.html')) {
            loadEditProfile(currentUser);
            setupEditForm(currentUser);
        } else {
            loadDashboard(currentUser);
        }
    }

    // Setup navigation
    setupDashboardNavigation(currentUser);
});

function loadDashboard(vendor) {
    // Update sidebar
    document.getElementById('sidebarBusinessName').textContent = vendor.businessName;
    document.getElementById('sidebarCategory').textContent = vendor.category;
    document.getElementById('sidebarRating').textContent = `⭐ ${vendor.rating ? vendor.rating.toFixed(1) : '0.0'} (${vendor.totalReviews || 0} reviews)`;
    
    if (vendor.photo) {
        document.getElementById('sidebarPhoto').src = vendor.photo;
    }

    // Load stats
    loadVendorStats(vendor);
    
    // Load recent reviews
    loadRecentReviews(vendor.id);
    
    // Calculate profile completion
    calculateProfileCompletion(vendor);
    
    // Setup event listeners
    setupDashboardEvents(vendor);
}

function loadVendorStats(vendor) {
    // Get view count from localStorage (simulated)
    let views = JSON.parse(localStorage.getItem('vendor_views_' + vendor.id)) || { count: 127, weekly: 12 };
    document.getElementById('profileViews').textContent = views.count;
    
    // Get search appearances (simulated)
    let searches = JSON.parse(localStorage.getItem('vendor_searches_' + vendor.id)) || { count: 342, increase: 23 };
    document.getElementById('searchAppearances').textContent = searches.count;
    
    // Get contact clicks (simulated)
    let contacts = JSON.parse(localStorage.getItem('vendor_contacts_' + vendor.id)) || 56;
    document.getElementById('contactClicks').textContent = contacts;
    
    // Update rating
    document.getElementById('avgRating').textContent = vendor.rating ? vendor.rating.toFixed(1) : '0.0';
    document.getElementById('totalReviews').textContent = `(${vendor.totalReviews || 0} reviews)`;
}

function loadRecentReviews(vendorId) {
    const reviewsList = document.getElementById('recentReviews');
    const allReviews = JSON.parse(localStorage.getItem(VendorFind.STORAGE_KEYS.REVIEWS)) || [];
    const vendorReviews = allReviews.filter(r => r.vendorId === vendorId).slice(0, 3);

    if (vendorReviews.length === 0) {
        reviewsList.innerHTML = '<p class="no-results">No reviews yet</p>';
        return;
    }

    reviewsList.innerHTML = vendorReviews.map(review => `
        <div class="review-item">
            <div class="review-header">
                <span class="review-rating">${'★'.repeat(review.rating)}${'☆'.repeat(5-review.rating)}</span>
                <span class="review-date">${new Date(review.createdAt).toLocaleDateString()}</span>
            </div>
            <p class="review-text">${review.text}</p>
        </div>
    `).join('');
}

function calculateProfileCompletion(vendor) {
    let completed = 0;
    const total = 6; // Total tasks

    // Check each required field
    if (vendor.businessName) completed++;
    if (vendor.category) completed++;
    if (vendor.location) completed++;
    if (vendor.photo) {
        completed++;
        document.getElementById('taskPhoto').classList.add('completed');
    }
    if (vendor.businessHours) completed++;
    if (vendor.products) completed++;

    const percentage = Math.round((completed / total) * 100);
    document.getElementById('profileCompletion').style.width = percentage + '%';
    document.getElementById('completionPercentage').textContent = percentage + '%';

    // Update task list
    if (vendor.photo) document.getElementById('taskPhoto').classList.add('completed');
    if (vendor.businessHours) document.getElementById('taskHours').classList.add('completed');
    if (vendor.products) document.getElementById('taskProducts').classList.add('completed');
}

function setupDashboardEvents(vendor) {
    // Share profile
    document.getElementById('shareProfile')?.addEventListener('click', () => {
        const profileUrl = window.location.origin + '/vendor-profile.html?id=' + vendor.id;
        navigator.clipboard.writeText(profileUrl).then(() => {
            alert('Profile link copied to clipboard!');
        });
    });

    // Preview profile
    document.getElementById('previewProfile')?.addEventListener('click', () => {
        window.open('vendor-profile.html?id=' + vendor.id, '_blank');
    });

    // Generate QR code
    document.getElementById('generateQR')?.addEventListener('click', () => {
        generateQRCode(vendor);
    });

    // View all reviews
    document.getElementById('viewAllReviews')?.addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('navReviews').click();
    });
}

function generateQRCode(vendor) {
    const modal = document.getElementById('qrModal');
    const qrDiv = document.getElementById('qrCode');
    
    // Clear previous QR
    qrDiv.innerHTML = '';
    
    // Generate QR code (using a simple approach - you can use a library like qrcode.js in production)
    const profileUrl = window.location.origin + '/vendor-profile.html?id=' + vendor.id;
    qrDiv.innerHTML = `<div style="background: white; padding: 10px;">
        <svg width="200" height="200" viewBox="0 0 200 200">
            <!-- Simple QR-like pattern - in production, use a proper QR library -->
            <rect width="200" height="200" fill="white"/>
            ${generateQRPattern(profileUrl)}
        </svg>
    </div>`;
    
    modal.style.display = 'block';
    
    // Close modal
    modal.querySelector('.close').onclick = () => {
        modal.style.display = 'none';
    };
    
    window.onclick = (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };
    
    // Download QR
    document.getElementById('downloadQR').onclick = () => {
        alert('QR code downloaded! (In production, this would generate an actual QR code image)');
    };
}

// Simple pattern generator for demo
function generateQRPattern(text) {
    let pattern = '';
    for (let i = 0; i < 20; i++) {
        for (let j = 0; j < 20; j++) {
            if (Math.random() > 0.5) {
                pattern += `<rect x="${i*10}" y="${j*10}" width="8" height="8" fill="black"/>`;
            }
        }
    }
    return pattern;
}

function loadEditProfile(vendor) {
    // Populate form with vendor data
    document.getElementById('businessName').value = vendor.businessName || '';
    document.getElementById('ownerName').value = vendor.ownerName || '';
    document.getElementById('email').value = vendor.email || '';
    document.getElementById('category').value = vendor.category || 'Food';
    document.getElementById('subcategory').value = vendor.subcategory || '';
    document.getElementById('location').value = vendor.location || '';
    document.getElementById('address').value = vendor.address || '';
    document.getElementById('contact').value = vendor.contact || '';
    document.getElementById('whatsapp').value = vendor.whatsapp || '';
    document.getElementById('website').value = vendor.website || '';
    document.getElementById('shortDescription').value = vendor.shortDescription || '';
    document.getElementById('description').value = vendor.description || '';

    // Load photo if exists
    if (vendor.photo) {
        const preview = document.getElementById('profilePhotoPreview');
        preview.src = vendor.photo;
        preview.style.display = 'block';
        document.querySelector('.upload-placeholder').style.display = 'none';
    }

    // Load gallery photos
    if (vendor.gallery) {
        vendor.gallery.forEach((photo, index) => {
            // This would populate gallery photos
        });
    }

    // Load business hours
    if (vendor.businessHours) {
        // This would populate business hours
    }

    // Load payment methods
    if (vendor.paymentMethods) {
        vendor.paymentMethods.forEach(method => {
            const checkbox = document.querySelector(`input[value="${method}"]`);
            if (checkbox) checkbox.checked = true;
        });
    }

    // Update sidebar
    document.getElementById('sidebarBusinessName').textContent = vendor.businessName;
    document.getElementById('sidebarCategory').textContent = vendor.category;
    document.getElementById('sidebarRating').textContent = `⭐ ${vendor.rating ? vendor.rating.toFixed(1) : '0.0'} (${vendor.totalReviews || 0} reviews)`;
    
    if (vendor.photo) {
        document.getElementById('sidebarPhoto').src = vendor.photo;
    }
}

function setupEditForm(vendor) {
    const form = document.getElementById('editVendorForm');
    
    // Profile photo upload
    setupPhotoUpload(vendor);
    
    // Gallery upload
    setupGalleryUpload();
    
    // Cancel button
    document.getElementById('cancelEdit').addEventListener('click', () => {
        window.location.href = 'vendor-dashboard.html';
    });
    
    // Form submit
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        saveVendorChanges(vendor);
    });
    
    // Business hours toggle
    document.querySelectorAll('.closed-check').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const row = this.closest('.hours-row');
            const timeInputs = row.querySelectorAll('input[type="time"]');
            timeInputs.forEach(input => {
                input.disabled = this.checked;
            });
        });
    });
}

function setupPhotoUpload(vendor) {
    const uploadArea = document.getElementById('profilePhotoUpload');
    const fileInput = document.getElementById('profilePhoto');
    const preview = document.getElementById('profilePhotoPreview');
    const placeholder = document.querySelector('.upload-placeholder');

    uploadArea.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                preview.src = e.target.result;
                preview.style.display = 'block';
                placeholder.style.display = 'none';
                vendor.photo = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });
}

function setupGalleryUpload() {
    const galleryGrid = document.getElementById('galleryUploadGrid');
    
    // Add more upload slots
    for (let i = 1; i < 5; i++) {
        const item = document.createElement('div');
        item.className = 'gallery-upload-item';
        item.setAttribute('data-index', i);
        item.innerHTML = `
            <input type="file" class="gallery-photo" accept="image/*" hidden>
            <div class="upload-placeholder">+</div>
            <img class="gallery-preview" src="#" alt="" style="display: none;">
            <button class="remove-photo" style="display: none;">×</button>
        `;
        galleryGrid.appendChild(item);
        
        setupGalleryItem(item);
    }
}

function setupGalleryItem(item) {
    const fileInput = item.querySelector('.gallery-photo');
    const preview = item.querySelector('.gallery-preview');
    const placeholder = item.querySelector('.upload-placeholder');
    const removeBtn = item.querySelector('.remove-photo');

    item.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                preview.src = e.target.result;
                preview.style.display = 'block';
                placeholder.style.display = 'none';
                removeBtn.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    });

    removeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        preview.src = '#';
        preview.style.display = 'none';
        placeholder.style.display = 'block';
        removeBtn.style.display = 'none';
        fileInput.value = '';
    });
}

function saveVendorChanges(vendor) {
    // Get form data
    const updatedVendor = {
        ...vendor,
        businessName: document.getElementById('businessName').value,
        ownerName: document.getElementById('ownerName').value,
        email: document.getElementById('email').value,
        category: document.getElementById('category').value,
        subcategory: document.getElementById('subcategory').value,
        location: document.getElementById('location').value,
        address: document.getElementById('address').value,
        contact: document.getElementById('contact').value,
        whatsapp: document.getElementById('whatsapp').value,
        website: document.getElementById('website').value,
        shortDescription: document.getElementById('shortDescription').value,
        description: document.getElementById('description').value,
        photo: vendor.photo, // Keep existing or updated photo
        lastUpdated: new Date().toISOString()
    };

    // Get business hours
    const hours = [];
    document.querySelectorAll('.hours-row').forEach(row => {
        const day = row.querySelector('span').textContent;
        const isClosed = row.querySelector('.closed-check').checked;
        if (!isClosed) {
            const open = row.querySelector('.open-time').value;
            const close = row.querySelector('.close-time').value;
            hours.push({ day, open, close, isClosed });
        } else {
            hours.push({ day, isClosed });
        }
    });
    updatedVendor.businessHours = hours;

    // Get payment methods
    const paymentMethods = [];
    document.querySelectorAll('.payment-methods input:checked').forEach(cb => {
        paymentMethods.push(cb.value);
    });
    updatedVendor.paymentMethods = paymentMethods;

    // Update vendors in localStorage
    const vendors = JSON.parse(localStorage.getItem(VendorFind.STORAGE_KEYS.VENDORS)) || [];
    const index = vendors.findIndex(v => v.id === vendor.id);
    if (index !== -1) {
        vendors[index] = updatedVendor;
        localStorage.setItem(VendorFind.STORAGE_KEYS.VENDORS, JSON.stringify(vendors));
        localStorage.setItem(VendorFind.STORAGE_KEYS.CURRENT_USER, JSON.stringify(updatedVendor));
        
        alert('Profile updated successfully!');
        window.location.href = 'vendor-dashboard.html';
    }
}

function setupDashboardNavigation(vendor) {
    // Navigation items
    document.getElementById('navProducts')?.addEventListener('click', (e) => {
        e.preventDefault();
        alert('Products/Services feature coming soon!');
    });

    document.getElementById('navReviews')?.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = 'vendor-profile.html?id=' + vendor.id + '#reviews';
    });

    document.getElementById('navSettings')?.addEventListener('click', (e) => {
        e.preventDefault();
        alert('Settings feature coming soon!');
    });

    // Logout
    document.getElementById('logoutBtn')?.addEventListener('click', (e) => {
        e.preventDefault();
        VendorFind.logout();
    });
}