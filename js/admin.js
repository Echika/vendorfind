document.addEventListener('DOMContentLoaded', () => {
    const vendorTableBody = document.getElementById('vendorTableBody');
    const exportBtn = document.getElementById('exportData');

    if (vendorTableBody) {
        loadVendorsTable();
    }

    if (exportBtn) {
        exportBtn.addEventListener('click', exportVendorData);
    }
});

function loadVendorsTable() {
    const vendorTableBody = document.getElementById('vendorTableBody');
    const vendors = JSON.parse(localStorage.getItem(VendorFind.STORAGE_KEYS.VENDORS)) || [];

    if (vendors.length === 0) {
        vendorTableBody.innerHTML = '<tr><td colspan="8" class="no-results">No vendors registered yet</td></tr>';
        return;
    }

    vendorTableBody.innerHTML = vendors.map((vendor, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${vendor.businessName}</td>
            <td>${vendor.ownerName}</td>
            <td>${vendor.category}</td>
            <td>${vendor.location}</td>
            <td>${vendor.contact}</td>
            <td>⭐ ${vendor.rating.toFixed(1)} (${vendor.totalReviews})</td>
            <td>
                <button class="action-btn" onclick="viewVendor('${vendor.id}')">View</button>
                <button class="action-btn delete-btn" onclick="deleteVendor('${vendor.id}')">Delete</button>
            </td>
        </tr>
    `).join('');
}

function viewVendor(vendorId) {
    window.location.href = `vendor-profile.html?id=${vendorId}`;
}

function deleteVendor(vendorId) {
    if (confirm('Are you sure you want to delete this vendor? This action cannot be undone.')) {
        const vendors = JSON.parse(localStorage.getItem(VendorFind.STORAGE_KEYS.VENDORS)) || [];
        const updatedVendors = vendors.filter(v => v.id !== vendorId);
        
        localStorage.setItem(VendorFind.STORAGE_KEYS.VENDORS, JSON.stringify(updatedVendors));
        
        // Also delete associated reviews
        const reviews = JSON.parse(localStorage.getItem(VendorFind.STORAGE_KEYS.REVIEWS)) || [];
        const updatedReviews = reviews.filter(r => r.vendorId !== vendorId);
        localStorage.setItem(VendorFind.STORAGE_KEYS.REVIEWS, JSON.stringify(updatedReviews));
        
        loadVendorsTable();
        alert('Vendor deleted successfully');
    }
}

function exportVendorData() {
    const vendors = JSON.parse(localStorage.getItem(VendorFind.STORAGE_KEYS.VENDORS)) || [];
    const dataStr = JSON.stringify(vendors, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `vendors_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}

// Add some admin protection
document.addEventListener('DOMContentLoaded', () => {
    // Simple admin check - you can modify this
    const currentUser = VendorFind.getCurrentUser();
    if (window.location.pathname.includes('admin.html')) {
        if (!currentUser || currentUser.email !== 'admin@vendorf ind.com') {
            alert('Admin access only. Please login as admin.');
            window.location.href = 'login.html';
        }
    }
});