const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const Product = require('./models/Product'); // Ithu namma mela create panna model-ah link pannum

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

// 1. Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Local MongoDB connected! ✅"))
  .catch((err) => console.log("DB Connection Error: ❌", err));

// 2. Route to get products (Ithu thaan data-va browser-ku anupum)
app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: "Error fetching products" });
    }
});

// 3. Main Route (Test panna)
app.get('/', (req, res) => {
    res.send("Backend Server is Running! 🚀");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));