const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Mock Data for Day 1
const vendors = [
  { id: 1, name: "EcoBuild Services", sector: "Construction", priceRange: "$$", rating: 4.8 },
  { id: 2, name: "TechFix Solutions", sector: "IT Services", priceRange: "$$$", rating: 4.5 }
];

app.get('/api/vendors', (req, res) => {
  res.json(vendors);
});

app.get('/', (req, res) => {
  res.send('Vendor Finder API is Live 🚀');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
