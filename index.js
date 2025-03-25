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


const Product = mongoose.models.Product || mongoose.model('Product', new mongoose.Schema({
    mobile: String,
    name: String,
    dob: String,
    email: String,
    // loanAmount: Number,
    employeeType: String,
    pancard: String
}, { strict: false }));  // strict false added


app.use(express.json()); 



app.post('/products', async (req, res) => {
    await connectDB();
    try {
        const product = await Product.create(req.body);
        res.status(201).json({ message: 'Product created', product });
    } catch (error) {
        res.status(500).json({ message: 'Error creating product', error });
    }
});


app.get('/products', async (req, res) => {
    await connectDB();
    try {
        const products = await Product.find();
        res.status(200).json({ message: 'Products fetched', products });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products', error });
    }
});


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
