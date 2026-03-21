// admin.js
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ Admin.js loaded');
    
    const vendorTableBody = document.getElementById('vendorTableBody');
    const exportBtn = document.getElementById('exportData');

    // Load vendors immediately
    if (vendorTableBody) {
        loadVendorsTable();
    }

    // Setup export button
    if (exportBtn) {
        exportBtn.addEventListener('click', exportVendorData);
    }
});

function loadVendorsTable() {
    const vendorTableBody = document.getElementById('vendorTableBody');
    
    // Get vendors from localStorage
    const vendors = JSON.parse(localStorage.getItem('vendorfind_vendors') || '[]');
    
    console.log('📊 Found', vendors.length, 'vendors');

    // If no vendors
    if (vendors.length === 0) {
        vendorTableBody.innerHTML = '<tr><td colspan="8" class="no-results">No vendors registered yet. <a href="signup.html">Register a vendor</a></td></tr>';
        return;
    }

    // Build table HTML
    let tableHTML = '';
    
    vendors.forEach((vendor, index) => {
        tableHTML += `
            <tr>
                <td>${index + 1}</td>
                <td><strong>${vendor.businessName || 'N/A'}</strong></td>
                <td>${vendor.ownerName || 'N/A'}</td>
                <td><span class="category-badge">${vendor.category || 'N/A'}</span></td>
                <td>📍 ${vendor.location || 'N/A'}</td>
                <td>📞 ${vendor.contact || 'N/A'}</td>
                <td>⭐ ${vendor.rating ? vendor.rating.toFixed(1) : '0.0'} (${vendor.totalReviews || 0})</td>
                <td>
                    <button class="action-btn view-btn" onclick="viewVendor('${vendor.id}')">👁️ View</button>
                    <button class="action-btn delete-btn" onclick="deleteVendor('${vendor.id}')">🗑️ Delete</button>
                </td>
            </tr>
        `;
    });

    vendorTableBody.innerHTML = tableHTML;
}

function viewVendor(vendorId) {
    window.location.href = `vendor-profile.html?id=${vendorId}`;
}

function deleteVendor(vendorId) {
    if (confirm('⚠️ Are you sure you want to delete this vendor? This action cannot be undone!')) {
        
        // Get all vendors
        const vendors = JSON.parse(localStorage.getItem('vendorfind_vendors') || '[]');
        
        // Filter out the deleted vendor
        const updatedVendors = vendors.filter(v => v.id !== vendorId);
        
        // Save back to localStorage
        localStorage.setItem('vendorfind_vendors', JSON.stringify(updatedVendors));
        
        // Also delete associated reviews
        const reviews = JSON.parse(localStorage.getItem('vendorfind_reviews') || '[]');
        const updatedReviews = reviews.filter(r => r.vendorId !== vendorId);
        localStorage.setItem('vendorfind_reviews', JSON.stringify(updatedReviews));
        
        // Reload the table
        loadVendorsTable();
        
        alert('✅ Vendor deleted successfully');
    }
}

function exportVendorData() {
    // Get all vendors
    const vendors = JSON.parse(localStorage.getItem('vendorfind_vendors') || '[]');
    
    if (vendors.length === 0) {
        alert('No vendors to export');
        return;
    }
    
    // Format the data
    const exportData = {
        exportDate: new Date().toISOString(),
        totalVendors: vendors.length,
        vendors: vendors
    };
    
    // Convert to JSON string
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    // Create filename with date
    const date = new Date();
    const fileName = `vendors_${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2,'0')}-${date.getDate().toString().padStart(2,'0')}.json`;
    
    // Trigger download
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', fileName);
    linkElement.click();
    
    alert(`✅ Exported ${vendors.length} vendors successfully!`);
}

// Make functions available globally
window.viewVendor = viewVendor;
window.deleteVendor = deleteVendor;