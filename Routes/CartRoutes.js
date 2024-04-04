const express = require('express');
const router = express.Router();
const Cart = require('../Models/Cart'); // Cart model

router.get('/', async (req, res) => {
    try {
        const { user_id, cart_id } = req.query;
        let carts;
        if (user_id) {
            carts = await Cart.find({ user_id: user_id });
        } else if (cart_id) {
            carts = await Cart.find({ cart_id: cart_id });
        } else {
            return res.status(400).json({ message: "User ID or Cart ID is missing." });
        }
        res.json(carts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/', async (req, res) => {
    const cart = new Cart(req.body);
    try {
        const newCart = await cart.save();
        res.status(201).json(newCart);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.put('/:id', getCart, async (req, res) => {
    Object.assign(res.cart, req.body);
    try {
        const updatedCart = await res.cart.save();
        res.json(updatedCart);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.delete('/:id', getCart, async (req, res) => {
    try {
        await res.cart.remove();
        res.json({ message: 'Deleted Cart' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

async function getCart(req, res, next) {
    let cart;
    try {
        cart = await Cart.findById(req.params.id);
        if (cart == null) {
            return res.status(404).json({ message: 'Cannot find cart' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
    res.cart = cart;
    next();
}

module.exports = router;