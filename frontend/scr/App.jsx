import React, { useEffect, useState } from 'react';

function App() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  // In production, this URL will come from Vercel's Environment Variables
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetch(`${API_URL}/api/vendors`)
      .then(res => res.json())
      .then(data => {
        setVendors(data);
        setLoading(false);
      })
      .catch(err => console.error("Fetch error:", err));
  }, []);

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif' }}>
      <h1>Vendor Finder</h1>
      <p>Helping you find services across sectors (SDG 8 & 9)</p>
      <hr />
      
      {loading ? <p>Loading vendors...</p> : (
        <div style={{ display: 'grid', gap: '20px', marginTop: '20px' }}>
          {vendors.map(vendor => (
            <div key={vendor.id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}>
              <h3>{vendor.name}</h3>
              <p>Sector: {vendor.sector} | Price: {vendor.priceRange}</p>
              <p>Rating: ⭐ {vendor.rating}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;