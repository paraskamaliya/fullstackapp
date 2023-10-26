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

postRouter.get("/", async (req, res) => {
    try {
        const data = await PostModel.find({ userId: req.body.userId })
        res.status(200).send(data);
    } catch (error) {
        res.status(400).send({ "message": "Something went wrong", "err": error });
    }
})

postRouter.patch("/update/:id", async (req, res) => {
    const { id } = req.params;
    const post = await PostModel.findOne({ _id: id });
    try {
        if (req.body.userId == post.userId) {
            await PostModel.findByIdAndUpdate({ _id: id }, req.body);
            res.status(200).send({ "message": "Post Successfully updated" })
        }
        else {
            res.status(200).send({ "message": "You are not authorised." })
        }
    } catch (error) {
        res.status(400).send({ "message": "Something went wrong", "err": error })
    }
})

postRouter.delete("/delete/:id", async (req, res) => {
    const { id } = req.params;
    const post = await PostModel.findOne({ _id: id });
    try {
        if (req.body.userId == post.userId) {
            await PostModel.findByIdAndDelete({ _id: id }, req.body);
            res.status(200).send({ "message": "Post Successfully deleted" })
        }
        else {
            res.status(200).send({ "message": "You are not authorised." })
        }
    } catch (error) {
        res.status(400).send({ "message": "Something went wrong", "err": error })
    }
})
module.exports = { postRouter };