const express = require("express");
const postRouter = express.Router();
const { PostModel } = require("../model/post.model");
const { auth } = require("../middleware/auth.middleware");
postRouter.use(auth);
postRouter.post("/create", async (req, res) => {
    try {
        const post = new PostModel(req.body);
        await post.save();
        res.status(200).send({ "message": "post is created", "post": req.body });
    } catch (error) {
        res.status(400).send({ "message": "Something went wrong", "err": error });
    }
})

module.exports = { postRouter };