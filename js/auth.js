document.addEventListener("DOMContentLoaded", () => {
  const signupForm = document.getElementById("vendorSignupForm");
  if (signupForm) signupForm.addEventListener("submit", handleSignup);

  // Load categories from backend
  loadCategories();
});

const CATEGORY_API_URL = "http://localhost:5000/api/categories"; // endpoint to get categories

// ------------------- LOAD CATEGORIES -------------------
async function loadCategories() {
  const categorySelect = document.getElementById("category");
  if (!categorySelect) return;

  try {
    const res = await fetch(CATEGORY_API_URL);
    const data = await res.json();

    if (!res.ok) throw new Error(data.error || "Failed to load categories");

    // Clear existing options
    categorySelect.innerHTML = `<option value="">Select Category</option>`;

    // Populate options from backend
    data.forEach((cat) => {
      const option = document.createElement("option");
      option.value = cat.id; // assuming backend returns [{name: 'Food'}, ...]
      option.textContent = cat.name;
      categorySelect.appendChild(option);
    });
  } catch (err) {
    console.error("Error loading categories:", err);
    alert("Failed to load categories from server. Please try again later.");
  }
}

// ------------------- SIGNUP -------------------
async function handleSignup(e) {
  e.preventDefault();

  const vendorData = {
    business_name: document.getElementById("businessName").value.trim(),
    business_owner: document.getElementById("ownerName").value.trim(),
    contact_email: document.getElementById("email").value.trim(),
    password_hash: document.getElementById("password").value.trim(),
    category_id: document.getElementById("category").value.trim(),
    location: document.getElementById("location").value.trim(),
    description: document.getElementById("description").value.trim(),
    contact_number: document.getElementById("contact").value.trim(),
  };

  const photoInput = document.getElementById("businessPhoto");
  if (photoInput?.files && photoInput.files[0]) {
    const reader = new FileReader();
    reader.onload = function (event) {
      vendorData.photo = event.target.result;
      sendSignupRequest(vendorData);
    };
    reader.readAsDataURL(photoInput.files[0]);
  } else {
    sendSignupRequest(vendorData);
  }
}

async function sendSignupRequest(vendorData) {
  try {
    const res = await fetch(`${API_BASE_URL}/vendors`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(vendorData),
    });

    const data = await res.json();
    if (!res.ok) {
      alert(data.error || "Signup failed");
      return;
    }

    localStorage.setItem("vendorfind_current_user", JSON.stringify(data));
    alert("Signup successful!");
    window.location.href = "vendor-profile.html?id=" + data.id;
  } catch (err) {
    console.error(err);
    alert("Server error during signup. Try again later.");
  }
}
