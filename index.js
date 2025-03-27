require('dotenv').config(); // Load .env variables

const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
    console.error("❌ MONGO_URI is not defined. Check your environment variables.");
    process.exit(1);
}

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("✅ MongoDB connected!");
    } catch (error) {
        console.error("❌ MongoDB connection error:", error);
        process.exit(1);
    }
};

connectDB();

app.use(express.json());

// Define the Product Schema with Unique Fields
const ProductSchema = new mongoose.Schema({
    mobile: { type: String, unique: true, required: true },
    name: { type: String, required: true },
    dob: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    employeeType: { type: String, required: true },
    pancard: { type: String, unique: true, required: true }
}, { strict: false });

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

// Handle Duplicate Errors (MongoDB Unique Index)
ProductSchema.post('save', function (error, doc, next) {
    if (error.code === 11000) {
        next(new Error("Duplicate entry detected. Mobile, Email, or PAN card must be unique."));
    } else {
        next(error);
    }
});

// POST route to create a new product with duplicate check
app.post('/products', async (req, res) => {
    try {
        const { mobile, email, pancard } = req.body;

        // Check for existing record before inserting
        const existingProduct = await Product.findOne({
            $or: [{ mobile }, { email }, { pancard }]
        });

        if (existingProduct) {
            return res.status(400).json({ message: "Duplicate entry detected: Mobile, Email, or PAN card already exists." });
        }

        // Create new product if no duplicate is found
        const product = await Product.create(req.body);
        res.status(201).json({ message: '✅ lead created successfully', product });
    } catch (error) {
        res.status(500).json({ message: '❌ Error creating lead', error: error.message });
    }
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
