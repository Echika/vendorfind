// Enhanced Reviews Functionality
document.addEventListener('DOMContentLoaded', () => {
    // Check if we're on a vendor profile page
    if (window.location.pathname.includes('vendor-profile.html')) {
        loadDetailedReviews();
        setupReviewFilters();
    }
});

function loadDetailedReviews() {
    const urlParams = new URLSearchParams(window.location.search);
    const vendorId = urlParams.get('id');
    
    if (!vendorId) return;

    const reviews = JSON.parse(localStorage.getItem(VendorFind.STORAGE_KEYS.REVIEWS)) || [];
    const vendorReviews = reviews.filter(r => r.vendorId === vendorId);
    
    // Calculate rating distribution
    const distribution = calculateRatingDistribution(vendorReviews);
    displayRatingDistribution(distribution, vendorReviews.length);
    
    // Load reviews with pagination
    displayReviewsWithPagination(vendorReviews);
}

function calculateRatingDistribution(reviews) {
    const distribution = {5:0, 4:0, 3:0, 2:0, 1:0};
    reviews.forEach(review => {
        distribution[review.rating]++;
    });
    return distribution;
}

function displayRatingDistribution(distribution, totalReviews) {
    const container = document.getElementById('ratingDistribution');
    if (!container) return;

    let html = '<div class="rating-distribution">';
    for (let i = 5; i >= 1; i--) {
        const count = distribution[i];
        const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
        html += `
            <div class="distribution-row">
                <span class="rating-star">${i} ★</span>
                <div class="distribution-bar">
                    <div class="distribution-fill" style="width: ${percentage}%"></div>
                </div>
                <span class="distribution-count">${count}</span>
            </div>
        `;
    }
    html += '</div>';
    container.innerHTML = html;
}

function displayReviewsWithPagination(reviews, page = 1, perPage = 5) {
    const container = document.getElementById('reviewsList');
    if (!container) return;

    const start = (page - 1) * perPage;
    const end = start + perPage;
    const paginatedReviews = reviews.slice(start, end);
    const totalPages = Math.ceil(reviews.length / perPage);

    if (reviews.length === 0) {
        container.innerHTML = '<p class="no-results">No reviews yet. Be the first to review!</p>';
        return;
    }

    let html = '<div class="reviews-with-pagination">';
    
    // Reviews
    paginatedReviews.forEach(review => {
        html += `
            <div class="review-item">
                <div class="review-header">
                    <div>
                        <span class="review-rating">${'★'.repeat(review.rating)}${'☆'.repeat(5-review.rating)}</span>
                        <span class="reviewer-name">${review.reviewerName || 'Anonymous'}</span>
                    </div>
                    <span class="review-date">${new Date(review.createdAt).toLocaleDateString()}</span>
                </div>
                <p class="review-text">${review.text}</p>
                ${review.vendorResponse ? `
                    <div class="vendor-response">
                        <strong>Vendor Response:</strong>
                        <p>${review.vendorResponse}</p>
                    </div>
                ` : ''}
            </div>
        `;
    });

    // Pagination
    if (totalPages > 1) {
        html += '<div class="pagination">';
        for (let i = 1; i <= totalPages; i++) {
            html += `<button class="page-btn ${i === page ? 'active' : ''}" data-page="${i}">${i}</button>`;
        }
        html += '</div>';
    }

    html += '</div>';
    container.innerHTML = html;

    // Add pagination event listeners
    container.querySelectorAll('.page-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            displayReviewsWithPagination(reviews, parseInt(btn.dataset.page));
        });
    });
}

function setupReviewFilters() {
    const filterSelect = document.getElementById('reviewFilter');
    if (!filterSelect) return;

    filterSelect.addEventListener('change', (e) => {
        const filter = e.target.value;
        const urlParams = new URLSearchParams(window.location.search);
        const vendorId = urlParams.get('id');
        
        let reviews = JSON.parse(localStorage.getItem(VendorFind.STORAGE_KEYS.REVIEWS)) || [];
        reviews = reviews.filter(r => r.vendorId === vendorId);
        
        switch(filter) {
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
        
        displayReviewsWithPagination(reviews);
    });
}

// Enhanced review submission with response capability
function submitReviewWithDetails(vendorId, rating, text, reviewerName) {
    const review = {
        id: VendorFind.generateId(),
        vendorId: vendorId,
        rating: parseInt(rating),
        text: text,
        reviewerName: reviewerName || 'Anonymous',
        createdAt: new Date().toISOString(),
        helpful: 0,
        reported: false
    };

    const reviews = JSON.parse(localStorage.getItem(VendorFind.STORAGE_KEYS.REVIEWS)) || [];
    reviews.push(review);
    localStorage.setItem(VendorFind.STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));

    // Update vendor rating
    updateVendorRating(vendorId);
    
    return review;
}

// Vendor response to review
function addVendorResponse(reviewId, responseText) {
    const reviews = JSON.parse(localStorage.getItem(VendorFind.STORAGE_KEYS.REVIEWS)) || [];
    const reviewIndex = reviews.findIndex(r => r.id === reviewId);
    
    if (reviewIndex !== -1) {
        reviews[reviewIndex].vendorResponse = responseText;
        reviews[reviewIndex].responseDate = new Date().toISOString();
        localStorage.setItem(VendorFind.STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
        return true;
    }
    return false;
}

// Mark review as helpful
function markReviewHelpful(reviewId) {
    const reviews = JSON.parse(localStorage.getItem(VendorFind.STORAGE_KEYS.REVIEWS)) || [];
    const reviewIndex = reviews.findIndex(r => r.id === reviewId);
    
    if (reviewIndex !== -1) {
        reviews[reviewIndex].helpful = (reviews[reviewIndex].helpful || 0) + 1;
        localStorage.setItem(VendorFind.STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
        return true;
    }
    return false;
}