const express = require('express');
const router = express.Router();
const Order = require('../Models/Order'); // Order model

router.get('/', async (req, res) => {
    try {
        const { order_id, limit } = req.query;
        let orders;
        if (order_id) {
            orders = await Order.find({ order_id: order_id });
        } else if (limit) {
            orders = await Order.find().limit(parseInt(limit));
        } else {
            orders = await Order.find();
        }
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/', async (req, res) => {
    const order = new Order(req.body);
    try {
        const newOrder = await order.save();
        res.status(201).json(newOrder);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.put('/:id', getOrder, async (req, res) => {
    Object.assign(res.order, req.body);
    try {
        const updatedOrder = await res.order.save();
        res.json(updatedOrder);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.delete('/:id', getOrder, async (req, res) => {
    try {
        await res.order.remove();
        res.json({ message: 'Deleted Order' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

async function getOrder(req, res, next) {
    let order;
    try {
        order = await Order.findById(req.params.id);
        if (order == null) {
            return res.status(404).json({ message: 'Cannot find order' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
    res.order = order;
    next();
}

module.exports = router;