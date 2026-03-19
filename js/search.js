document.addEventListener('DOMContentLoaded', () => {
    const searchBtn = document.getElementById('searchBtn');
    const applyFilters = document.getElementById('applyFilters');
    const keywordSearch = document.getElementById('keywordSearch');
    const categoryFilter = document.getElementById('categoryFilter');
    const locationFilter = document.getElementById('locationFilter');

    // Load initial vendors
    loadVendors();

    // Check URL parameters for category
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    if (categoryParam && categoryFilter) {
        categoryFilter.value = categoryParam;
        applyFiltersHandler();
    }

    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            const filters = {
                keyword: keywordSearch?.value,
                category: categoryFilter?.value,
                location: locationFilter?.value
            };
            loadVendors(filters);
        });
    }

    if (applyFilters) {
        applyFilters.addEventListener('click', applyFiltersHandler);
    }

    // Enter key in search
    if (keywordSearch) {
        keywordSearch.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                searchBtn.click();
            }
        });
    }
});

function applyFiltersHandler() {
    const keywordSearch = document.getElementById('keywordSearch');
    const categoryFilter = document.getElementById('categoryFilter');
    const locationFilter = document.getElementById('locationFilter');

    const filters = {
        keyword: keywordSearch?.value,
        category: categoryFilter?.value,
        location: locationFilter?.value
    };
    
    loadVendors(filters);

    // Update URL without reload
    const url = new URL(window.location);
    if (filters.keyword) url.searchParams.set('keyword', filters.keyword);
    if (filters.category) url.searchParams.set('category', filters.category);
    if (filters.location) url.searchParams.set('location', filters.location);
    window.history.pushState({}, '', url);
}