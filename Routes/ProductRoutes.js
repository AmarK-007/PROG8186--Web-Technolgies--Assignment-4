const express = require('express');
const router = express.Router();
const Product = require('../Models/Product'); // Product model

router.get('/', async (req, res) => {
    try {
        const { product_id, limit } = req.query;
        let products;

        if (product_id) {
            products = await Product.find({ product_id });
        } else if (limit) {
            products = await Product.find().limit(parseInt(limit));
        } else {
            products = await Product.find();
        }

        if (products.length > 0) {
            res.json(products);
        } else {
            res.json({ message: "No products found" });
        }
    } catch (e) {
        res.status(500).json({ message: `GET request failed: ${e.message}` });
    }
});

// POST request
router.post('/', async (req, res) => {
    const { name, price, description } = req.body;

    // Check for required fields
    if (!name || !price || !description) {
        return res.status(400).json({ message: 'Missing required field' });
    }

    try {
        const product = new Product({ name, price, description });
        const savedProduct = await product.save();
        res.json({ message: "Product created", product: savedProduct });
    } catch (e) {
        res.status(500).json({ message: `POST request failed: ${e.message}` });
    }
});

// PUT request
router.put('/:product_id', async (req, res) => {
    const { name, price, description } = req.body;

    // Check for required fields
    if (!name || !price || !description) {
        return res.status(400).json({ message: 'Missing required field' });
    }

    try {
        const updatedProduct = await Product.findOneAndUpdate({ product_id: req.params.product_id }, { name, price, description }, { new: true });
        if (updatedProduct) {
            res.json({ message: "Product updated", product: updatedProduct });
        } else {
            res.status(404).json({ message: "Product not found." });
        }
    } catch (e) {
        res.status(500).json({ message: `PUT request failed: ${e.message}` });
    }
});

router.delete('/:product_id', async (req, res) => {
    try {
        const deletedProduct = await Product.findOneAndUpdate({ product_id: req.params.product_id }, { is_deleted: true }, { new: true });
        if (deletedProduct) {
            res.json({ message: "Product marked as deleted", product: deletedProduct });
        } else {
            res.status(404).json({ message: "Product not found." });
        }
    } catch (e) {
        res.status(500).json({ message: `DELETE request failed: ${e.message}` });
    }
});

module.exports = router;