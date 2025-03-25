const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = 3000;
const MONGO_URI = 'mongodb+srv://parveenchouhan082:delllatitude7480e@cluster0.na2jf.mongodb.net/backendtest';

let isConnected = false;
const connectDB = async () => {
    if (!isConnected) {
        await mongoose.connect(MONGO_URI);
        isConnected = true;
    }
};

// Define Product schema
const Product = mongoose.models.Product || mongoose.model('Product', new mongoose.Schema({
    mobile: String,
    name: String,
    dob: String,
    email: String,
    loanAmount: Number,
    employeeType: String,
    pancard: String
}));

app.use(express.json()); // Middleware to parse JSON

// Root API - Returns "Hello, World!"
app.get('/', (req, res) => {
    res.status(200).send('Hello, World!');
});

// POST API - Create a product
app.post('/products', async (req, res) => {
    await connectDB();
    try {
        const product = await Product.create(req.body);
        res.status(201).json({ message: 'Product created', product });
    } catch (error) {
        res.status(500).json({ message: 'Error creating product', error });
    }
});

// GET API - Fetch all products
app.get('/products', async (req, res) => {
    await connectDB();
    try {
        const products = await Product.find();
        res.status(200).json({ message: 'Products fetched', products });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products', error });
    }
});

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
