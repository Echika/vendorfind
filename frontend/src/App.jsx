import React, { useEffect, useState } from 'react';

function App() {
  const [vendors, setVendors] = useState([]);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    // Replace with your Render URL later
    fetch('http://localhost:5000/api/vendors')
      .then(res => res.json())
      .then(data => setVendors(data));
  }, []);

  const filteredVendors = filter === 'All' 
    ? vendors 
    : vendors.filter(v => v.sector === filter);

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
      <h1>Vendor Finder (SDG 8 & 9)</h1>
      
      {/* Sector Filter Bar */}
      <div style={{ marginBottom: '20px' }}>
        <button onClick={() => setFilter('All')}>All</button>
        <button onClick={() => setFilter('Construction')}>Construction</button>
        <button onClick={() => setFilter('IT Services')}>IT Services</button>
      </div>

      <div className="vendor-list">
        {filteredVendors.map(vendor => (
          <div key={vendor.id} style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '10px', marginBottom: '10px' }}>
            <h3>{vendor.name}</h3>
            <p><strong>Sector:</strong> {vendor.sector}</p>
            <p><strong>Price:</strong> {vendor.priceRange}</p>
            <p><strong>Rating:</strong> ⭐ {vendor.rating}</p>
            <button>View Contact Info</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
