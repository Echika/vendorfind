// Load vendors on search page
document.addEventListener('DOMContentLoaded', () => {
    const vendorGrid = document.getElementById('vendorGrid');
    const vendorProfile = document.getElementById('vendorProfile');
    const submitReview = document.getElementById('submitReview');
    const shareProfileBtn = document.getElementById('shareProfileBtn');
    const reviewFilter = document.getElementById('reviewFilter');

    if (vendorGrid) {
        loadVendors();
    }

    if (vendorProfile) {
        loadVendorProfile();
        loadRatingDistribution();
        loadVendorReviews();
        setupShareButtons();
    }

    if (submitReview) {
        submitReview.addEventListener('click', submitReviewHandler);
    }

    if (reviewFilter) {
        reviewFilter.addEventListener('change', filterReviews);
    }

    // Setup rating stars
    const ratingInput = document.querySelector('.rating-input');
    if (ratingInput) {
        const stars = ratingInput.querySelectorAll('.star');
        stars.forEach(star => {
            star.addEventListener('click', function() {
                const rating = this.getAttribute('data-rating');
                stars.forEach(s => {
                    if (s.getAttribute('data-rating') <= rating) {
                        s.classList.add('active');
                    } else {
                        s.classList.remove('active');
                    }
                });
            });
        });
    }
});

function loadVendors(filters = {}) {
    const vendorGrid = document.getElementById('vendorGrid');
    const vendors = JSON.parse(localStorage.getItem(VendorFind.STORAGE_KEYS.VENDORS)) || [];

    // Apply filters
    let filteredVendors = [...vendors];

    if (filters.keyword) {
        const keyword = filters.keyword.toLowerCase();
        filteredVendors = filteredVendors.filter(v => 
            v.businessName.toLowerCase().includes(keyword) ||
            (v.description && v.description.toLowerCase().includes(keyword)) ||
            (v.shortDescription && v.shortDescription.toLowerCase().includes(keyword))
        );
    }

    if (filters.category) {
        filteredVendors = filteredVendors.filter(v => v.category === filters.category);
    }

    if (filters.location) {
        const location = filters.location.toLowerCase();
        filteredVendors = filteredVendors.filter(v => 
            v.location && v.location.toLowerCase().includes(location)
        );
    }

    // Display vendors
    if (filteredVendors.length === 0) {
        VendorFind.showNoResults(vendorGrid);
        return;
    }

    vendorGrid.innerHTML = filteredVendors.map(vendor => `
        <a href="vendor-profile.html?id=${vendor.id}" class="vendor-card">
            <div class="vendor-card-image" style="background-image: url('${vendor.photo || '../assets/images/default-vendor.jpg'}')"></div>
            <div class="vendor-card-content">
                <h3>${vendor.businessName}</h3>
                <p class="category">${vendor.category}</p>
                <p class="location">📍 ${vendor.location || 'Location not specified'}</p>
                <p class="rating">⭐ ${vendor.rating ? vendor.rating.toFixed(1) : '0.0'} (${vendor.totalReviews || 0} reviews)</p>
            </div>
        </a>
    `).join('');
}

function loadVendorProfile() {
    const urlParams = new URLSearchParams(window.location.search);
    const vendorId = urlParams.get('id');
    const vendorProfile = document.getElementById('vendorProfile');
    const profileActions = document.getElementById('profileActions');

    if (!vendorId) {
        window.location.href = 'search.html';
        return;
    }

    const vendors = JSON.parse(localStorage.getItem(VendorFind.STORAGE_KEYS.VENDORS)) || [];
    const vendor = vendors.find(v => v.id === vendorId);
    const currentUser = VendorFind.getCurrentUser();

    if (!vendor) {
        vendorProfile.innerHTML = '<p class="error">Vendor not found</p>';
        return;
    }

    // Show profile actions if this is the vendor's own profile
    if (profileActions) {
        if (currentUser && currentUser.id === vendorId) {
            profileActions.style.display = 'flex';
        } else {
            profileActions.style.display = 'none';
        }
    }

    // Format contact information with clickable links
    const phoneLink = VendorFind.formatPhoneForCall(vendor.contact);
    const whatsappLink = vendor.whatsapp ? VendorFind.formatWhatsAppLink(vendor.whatsapp, `Hi ${vendor.businessName}, I found you on VendorFind!`) : '#';

    vendorProfile.innerHTML = `
        <div class="profile-header" style="background-image: url('${vendor.photo || '../assets/images/default-vendor.jpg'}')"></div>
        <div class="profile-info">
            <h1>${vendor.businessName}</h1>
            <div class="profile-meta">
                <span class="category">📋 ${vendor.category} ${vendor.subcategory ? `- ${vendor.subcategory}` : ''}</span>
                <span class="location">📍 ${vendor.location || 'Location not specified'}</span>
                <span class="rating">⭐ ${vendor.rating ? vendor.rating.toFixed(1) : '0.0'} (${vendor.totalReviews || 0} reviews)</span>
            </div>
            ${vendor.shortDescription ? `<p class="short-description">${vendor.shortDescription}</p>` : ''}
            <p class="profile-description">${vendor.description || 'No description provided.'}</p>
            
            <div class="profile-contact">
                <h3>Contact Information</h3>
                <p>📞 <a href="${phoneLink}" class="contact-link">${vendor.contact}</a></p>
                ${vendor.whatsapp ? `<p>📱 <a href="${whatsappLink}" target="_blank" class="contact-link">WhatsApp: ${vendor.whatsapp}</a></p>` : ''}
                <p>✉️ <a href="mailto:${vendor.email}" class="contact-link">${vendor.email}</a></p>
                ${vendor.website ? `<p>🌐 <a href="${vendor.website}" target="_blank" class="contact-link">${vendor.website}</a></p>` : ''}
                <p>Owner: ${vendor.ownerName}</p>
            </div>

            ${vendor.address ? `
                <div class="profile-address">
                    <h3>Address</h3>
                    <p>${vendor.address}</p>
                </div>
            ` : ''}

            ${vendor.businessHours ? `
                <div class="profile-hours">
                    <h3>Business Hours</h3>
                    ${renderBusinessHours(vendor.businessHours)}
                </div>
            ` : ''}

            ${vendor.paymentMethods && vendor.paymentMethods.length > 0 ? `
                <div class="profile-payment">
                    <h3>Payment Methods</h3>
                    <div class="payment-methods">
                        ${vendor.paymentMethods.map(method => `<span class="payment-badge">${method}</span>`).join('')}
                    </div>
                </div>
            ` : ''}

            ${vendor.gallery && vendor.gallery.length > 0 ? `
                <div class="profile-gallery">
                    <h3>Photo Gallery</h3>
                    <div class="gallery-grid">
                        ${vendor.gallery.map(photo => `
                            <div class="gallery-item">
                                <img src="${photo}" alt="Gallery image">
                            </div>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
        </div>
    `;

    // Track profile view
    VendorFind.updateVendorStats(vendorId, 'views');
}

function renderBusinessHours(hours) {
    if (!hours || hours.length === 0) return '<p>Hours not specified</p>';
    
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    let html = '<table class="hours-table">';
    
    days.forEach(day => {
        const dayHours = hours.find(h => h.day === day);
        if (dayHours) {
            if (dayHours.isClosed) {
                html += `<tr><td>${day}</td><td>Closed</td></tr>`;
            } else {
                html += `<tr><td>${day}</td><td>${dayHours.open || '09:00'} - ${dayHours.close || '17:00'}</td></tr>`;
            }
        } else {
            html += `<tr><td>${day}</td><td>Not specified</td></tr>`;
        }
    });
    
    html += '</table>';
    return html;
}

function loadRatingDistribution() {
    const urlParams = new URLSearchParams(window.location.search);
    const vendorId = urlParams.get('id');
    const distributionContainer = document.getElementById('ratingDistribution');
    const averageContainer = document.getElementById('averageRatingLarge');

    if (!vendorId || !distributionContainer) return;

    const reviews = JSON.parse(localStorage.getItem(VendorFind.STORAGE_KEYS.REVIEWS)) || [];
    const vendorReviews = reviews.filter(r => r.vendorId === vendorId);
    
    // Calculate distribution
    const distribution = VendorFind.calculateRatingDistribution(vendorReviews);
    
    // Display distribution
    let distributionHtml = '';
    for (let i = 5; i >= 1; i--) {
        const count = distribution[i];
        const percentage = vendorReviews.length > 0 ? (count / vendorReviews.length) * 100 : 0;
        distributionHtml += `
            <div class="distribution-row">
                <span class="rating-star">${i} ★</span>
                <div class="distribution-bar">
                    <div class="distribution-fill" style="width: ${percentage}%"></div>
                </div>
                <span class="distribution-count">${count}</span>
            </div>
        `;
    }
    distributionContainer.innerHTML = distributionHtml;

    // Display average
    if (averageContainer) {
        const vendor = VendorFind.getVendorById(vendorId);
        if (vendor) {
            averageContainer.innerHTML = `
                <span class="rating-number">${vendor.rating ? vendor.rating.toFixed(1) : '0.0'}</span>
                <div class="rating-stars">${VendorFind.getStarRating(vendor.rating || 0)}</div>
                <span class="total-reviews">${vendor.totalReviews || 0} reviews</span>
            `;
        }
    }
}

function loadVendorReviews(page = 1) {
    const urlParams = new URLSearchParams(window.location.search);
    const vendorId = urlParams.get('id');
    const reviewsList = document.getElementById('reviewsList');
    const paginationContainer = document.getElementById('reviewPagination');
    const filter = document.getElementById('reviewFilter')?.value || 'newest';

    if (!vendorId || !reviewsList) return;

    // Get filtered and sorted reviews using the new method from main.js
    const reviews = VendorFind.getVendorReviews ? 
        VendorFind.getVendorReviews(vendorId, { sortBy: filter }) : 
        getVendorReviewsLegacy(vendorId, filter);
    
    // Paginate
    const perPage = 5;
    const paginated = VendorFind.paginate ? 
        VendorFind.paginate(reviews, page, perPage) : 
        paginateLegacy(reviews, page, perPage);

    if (reviews.length === 0) {
        reviewsList.innerHTML = '<p class="no-reviews">No reviews yet. Be the first to review!</p>';
        if (paginationContainer) paginationContainer.innerHTML = '';
        return;
    }

    // Display reviews
    reviewsList.innerHTML = paginated.data.map(review => `
        <div class="review-item">
            <div class="review-header">
                <div>
                    <span class="review-rating">${'★'.repeat(review.rating)}${'☆'.repeat(5-review.rating)}</span>
                    <span class="reviewer-name">${review.reviewerName || 'Anonymous'}</span>
                </div>
                <span class="review-date">${VendorFind.formatDate(review.createdAt)}</span>
            </div>
            <p class="review-text">${review.text}</p>
            ${review.vendorResponse ? `
                <div class="vendor-response">
                    <strong>Vendor Response:</strong>
                    <p>${review.vendorResponse}</p>
                </div>
            ` : ''}
            <div class="review-actions">
                <button class="helpful-btn" onclick="markReviewHelpful('${review.id}')">
                    👍 Helpful (${review.helpful || 0})
                </button>
            </div>
        </div>
    `).join('');

    // Display pagination
    if (paginationContainer) {
        if (paginated.totalPages > 1) {
            let paginationHtml = '<div class="pagination">';
            for (let i = 1; i <= paginated.totalPages; i++) {
                paginationHtml += `<button class="page-btn ${i === page ? 'active' : ''}" onclick="loadVendorReviews(${i})">${i}</button>`;
            }
            paginationHtml += '</div>';
            paginationContainer.innerHTML = paginationHtml;
        } else {
            paginationContainer.innerHTML = '';
        }
    }
}

// Legacy function for backwards compatibility
function getVendorReviewsLegacy(vendorId, sortBy) {
    const reviews = JSON.parse(localStorage.getItem(VendorFind.STORAGE_KEYS.REVIEWS)) || [];
    let filtered = reviews.filter(r => r.vendorId === vendorId);
    
    switch(sortBy) {
        case 'newest':
            filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            break;
        case 'oldest':
            filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            break;
        case 'highest':
            filtered.sort((a, b) => b.rating - a.rating);
            break;
        case 'lowest':
            filtered.sort((a, b) => a.rating - b.rating);
            break;
    }
    
    return filtered;
}

// Legacy pagination function
function paginateLegacy(array, page = 1, perPage = 5) {
    const start = (page - 1) * perPage;
    const end = start + perPage;
    return {
        data: array.slice(start, end),
        total: array.length,
        page: page,
        perPage: perPage,
        totalPages: Math.ceil(array.length / perPage)
    };
}

function submitReviewHandler() {
    const urlParams = new URLSearchParams(window.location.search);
    const vendorId = urlParams.get('id');
    const rating = document.querySelector('.rating-input .active:last-child')?.getAttribute('data-rating');
    const reviewText = document.getElementById('reviewText').value;
    const reviewerName = document.getElementById('reviewerName')?.value || 'Anonymous';

    if (!vendorId) {
        alert('Vendor not found');
        return;
    }

    if (!rating) {
        alert('Please select a rating');
        return;
    }

    if (!reviewText.trim()) {
        alert('Please write a review');
        return;
    }

    // Check if VendorFind.saveReview exists, otherwise use legacy method
    if (VendorFind.saveReview) {
        const review = VendorFind.saveReview({
            vendorId: vendorId,
            rating: parseInt(rating),
            text: reviewText,
            reviewerName: reviewerName
        });
    } else {
        // Legacy review creation
        const review = {
            id: VendorFind.generateId(),
            vendorId: vendorId,
            rating: parseInt(rating),
            text: reviewText,
            reviewerName: reviewerName,
            createdAt: new Date().toISOString(),
            helpful: 0
        };

        const reviews = JSON.parse(localStorage.getItem(VendorFind.STORAGE_KEYS.REVIEWS)) || [];
        reviews.push(review);
        localStorage.setItem(VendorFind.STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));

        // Update vendor rating
        updateVendorRating(vendorId);
    }

    // Clear form
    document.querySelectorAll('.rating-input .star').forEach(s => s.classList.remove('active'));
    document.getElementById('reviewText').value = '';
    if (document.getElementById('reviewerName')) {
        document.getElementById('reviewerName').value = '';
    }

    // Reload reviews and distribution
    loadVendorReviews();
    loadRatingDistribution();

    alert('Review submitted successfully!');
}

function updateVendorRating(vendorId) {
    const vendors = JSON.parse(localStorage.getItem(VendorFind.STORAGE_KEYS.VENDORS)) || [];
    const reviews = JSON.parse(localStorage.getItem(VendorFind.STORAGE_KEYS.REVIEWS)) || [];
    
    const vendorIndex = vendors.findIndex(v => v.id === vendorId);
    if (vendorIndex === -1) return;

    const vendorReviews = reviews.filter(r => r.vendorId === vendorId);
    
    if (vendorReviews.length > 0) {
        const totalRating = vendorReviews.reduce((sum, r) => sum + r.rating, 0);
        vendors[vendorIndex].rating = totalRating / vendorReviews.length;
        vendors[vendorIndex].totalReviews = vendorReviews.length;
    } else {
        vendors[vendorIndex].rating = 0;
        vendors[vendorIndex].totalReviews = 0;
    }

    localStorage.setItem(VendorFind.STORAGE_KEYS.VENDORS, JSON.stringify(vendors));
    
    // Update current user if it's the same vendor
    const currentUser = VendorFind.getCurrentUser();
    if (currentUser && currentUser.id === vendorId) {
        localStorage.setItem(VendorFind.STORAGE_KEYS.CURRENT_USER, JSON.stringify(vendors[vendorIndex]));
    }
}

function markReviewHelpful(reviewId) {
    if (VendorFind.markReviewHelpful) {
        VendorFind.markReviewHelpful(reviewId);
    } else {
        // Legacy method
        const reviews = JSON.parse(localStorage.getItem(VendorFind.STORAGE_KEYS.REVIEWS)) || [];
        const reviewIndex = reviews.findIndex(r => r.id === reviewId);
        
        if (reviewIndex !== -1) {
            reviews[reviewIndex].helpful = (reviews[reviewIndex].helpful || 0) + 1;
            localStorage.setItem(VendorFind.STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
        }
    }
    
    // Reload reviews to show updated count
    loadVendorReviews();
}

function filterReviews() {
    loadVendorReviews(1); // Reset to first page when filtering
}

function setupShareButtons() {
    const shareBtn = document.getElementById('shareProfileBtn');
    const modal = document.getElementById('shareModal');
    const closeBtn = document.querySelector('#shareModal .close');
    const copyLinkBtn = document.getElementById('copyLinkBtn');
    const whatsappBtn = document.getElementById('whatsappShareBtn');
    const emailBtn = document.getElementById('emailShareBtn');

    if (!shareBtn || !modal) return;

    shareBtn.addEventListener('click', () => {
        modal.style.display = 'block';
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    if (copyLinkBtn) {
        copyLinkBtn.addEventListener('click', () => {
            const urlParams = new URLSearchParams(window.location.search);
            const vendorId = urlParams.get('id');
            
            if (VendorFind.shareVendorProfile) {
                VendorFind.shareVendorProfile(vendorId);
            } else {
                // Legacy copy
                const url = window.location.origin + '/vendor-profile.html?id=' + vendorId;
                navigator.clipboard.writeText(url).then(() => {
                    alert('Link copied to clipboard!');
                });
            }
            modal.style.display = 'none';
        });
    }

    if (whatsappBtn) {
        whatsappBtn.addEventListener('click', () => {
            const urlParams = new URLSearchParams(window.location.search);
            const vendorId = urlParams.get('id');
            const vendors = JSON.parse(localStorage.getItem(VendorFind.STORAGE_KEYS.VENDORS)) || [];
            const vendor = vendors.find(v => v.id === vendorId);
            
            if (vendor) {
                const text = `Check out ${vendor.businessName} on VendorFind!`;
                const url = window.location.origin + '/vendor-profile.html?id=' + vendorId;
                window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
            }
            modal.style.display = 'none';
        });
    }

    if (emailBtn) {
        emailBtn.addEventListener('click', () => {
            const urlParams = new URLSearchParams(window.location.search);
            const vendorId = urlParams.get('id');
            const vendors = JSON.parse(localStorage.getItem(VendorFind.STORAGE_KEYS.VENDORS)) || [];
            const vendor = vendors.find(v => v.id === vendorId);
            
            if (vendor) {
                const subject = `Check out ${vendor.businessName} on VendorFind`;
                const body = `I found this vendor on VendorFind: ${window.location.origin}/vendor-profile.html?id=${vendorId}`;
                window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            }
            modal.style.display = 'none';
        });
    }
}

// Export functions for use in HTML onclick attributes
window.loadVendorReviews = loadVendorReviews;
window.markReviewHelpful = markReviewHelpful;