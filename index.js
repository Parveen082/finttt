const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = 3000;
const MONGO_URI = process.env.MONGO_URI;

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
}, { strict: false }));  


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




app.listen(PORT, () => console.log(`Server  running on port ${PORT}`));
