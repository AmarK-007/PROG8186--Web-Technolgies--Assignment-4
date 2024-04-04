const express = require('express');
const router = express.Router();
const Comment = require('../Models/Comment'); // Comment model

router.get('/', async (req, res) => {
    try {
        const product_id = req.query.product_id;
        const limit = req.query.limit;
        if (!product_id) {
            return res.status(400).json({ message: "Product ID is missing." });
        }
        const comments = await Comment.find({ product_id: product_id }).limit(limit);
        if (comments.length === 0) {
            return res.status(404).json({ message: "Product not found." });
        }
        res.json(comments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/', async (req, res) => {
    const comment = new Comment({
        product_id: req.body.product_id,
        user_id: req.body.user_id,
        rating: req.body.rating,
        image_url: req.body.image_url,
        comment: req.body.comment
    });
    try {
        const newComment = await comment.save();
        res.status(200).json({ message: "Comment created.", newComment });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.put('/:id', getComment, async (req, res) => {
    res.comment.rating = req.body.rating;
    res.comment.image_url = req.body.image_url;
    res.comment.comment = req.body.comment;
    try {
        const updatedComment = await res.comment.save();
        res.json(updatedComment);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.delete('/:id', getComment, async (req, res) => {
    try {
        await res.comment.remove();
        res.json({ message: 'Comment deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

async function getComment(req, res, next) {
    let comment;
    try {
        comment = await Comment.findById(req.params.id);
        if (comment == null) {
            return res.status(404).json({ message: 'Cannot find comment' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
    res.comment = comment;
    next();
}

module.exports = router;