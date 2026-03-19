// Handle vendor registration
document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('vendorSignupForm');
    const loginForm = document.getElementById('loginForm');

    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }

    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
});

function handleSignup(e) {
    e.preventDefault();

    // Get form data
    const formData = {
        id: VendorFind.generateId(),
        businessName: document.getElementById('businessName').value,
        ownerName: document.getElementById('ownerName').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
        category: document.getElementById('category').value,
        location: document.getElementById('location').value,
        description: document.getElementById('description').value,
        contact: document.getElementById('contact').value,
        rating: 0,
        totalReviews: 0,
        createdAt: new Date().toISOString()
    };

    // Handle photo upload
    const photoInput = document.getElementById('businessPhoto');
    if (photoInput.files && photoInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            formData.photo = e.target.result;
            saveVendor(formData);
        };
        reader.readAsDataURL(photoInput.files[0]);
    } else {
        formData.photo = null;
        saveVendor(formData);
    }
}

function saveVendor(vendorData) {
    // Get existing vendors
    const vendors = JSON.parse(localStorage.getItem(VendorFind.STORAGE_KEYS.VENDORS)) || [];
    
    // Check if email already exists
    if (vendors.some(v => v.email === vendorData.email)) {
        alert('Email already registered. Please use a different email.');
        return;
    }

    // Add new vendor
    vendors.push(vendorData);
    localStorage.setItem(VendorFind.STORAGE_KEYS.VENDORS, JSON.stringify(vendors));

    // Auto login
    localStorage.setItem(VendorFind.STORAGE_KEYS.CURRENT_USER, JSON.stringify(vendorData));

    alert('Registration successful! Welcome to VendorFind.');
    window.location.href = 'vendor-profile.html?id=' + vendorData.id;
}

function handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('rememberMe')?.checked || false;

    // Get vendors
    const vendors = JSON.parse(localStorage.getItem(VendorFind.STORAGE_KEYS.VENDORS)) || [];

    // Find vendor
    const vendor = vendors.find(v => v.email === email && v.password === password);

    if (vendor) {
        // Set current user
        localStorage.setItem(VendorFind.STORAGE_KEYS.CURRENT_USER, JSON.stringify(vendor));

        alert('Login successful!');
        
        // Check if admin (simple check - you can modify this)
        if (email === 'admin@vendorf ind.com') {
            window.location.href = 'admin.html';
        } else {
            window.location.href = 'vendor-profile.html?id=' + vendor.id;
        }
    } else {
        alert('Invalid email or password. Please try again.');
    }
}