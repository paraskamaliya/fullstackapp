const express = require("express");
const postRouter = express.Router();
const { PostModel } = require("../model/post.model");
const { auth } = require("../middleware/auth.middleware");
postRouter.use(auth);

/**
 * @swagger
 * tags:
 *  name: Posts
 *  description: All the private routes related to posts
 */

/**
 * @swagger
 * /posts/create:
 *  post:
 *      summary: For creating post
 *      tags: [Posts]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          title:
 *                              type: string
 *                          body:
 *                              type: string
 *      responses:
 *          '200':
 *              description: Post is created
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                              post:
 *                                  type: object
 *          '400':
 *              description: Something went wrong
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                              err:
 *                                  type: object
 */
postRouter.post("/create", async (req, res) => {
    try {
        const post = new PostModel(req.body);
        await post.save();
        res.status(200).send({ "message": "post is created", "post": post });
    } catch (error) {
        res.status(400).send({ "message": "Something went wrong", "err": error });
    }
})

/**
 * @swagger
 * /posts:
 *  get:
 *      summary: get all the posts of particular user
 *      tags: [Posts]
 *      responses:
 *          '200':
 *              description: All posts of user
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              type: object
 *          '400':
 *              description: Something went wrong
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                              err:
 *                                  type: object
 */

postRouter.get("/", async (req, res) => {
    try {
        const data = await PostModel.find({ userId: req.body.userId })
        res.status(200).send(data);
    } catch (error) {
        res.status(400).send({ "message": "Something went wrong", "err": error });
    }
})

/**
 * @swagger
 * /posts/update/{id}:
 *  patch:
 *      summary: To update post data
 *      tags: [Posts]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          title:
 *                              type: string
 *                          body:
 *                              type: string
 *      responses:
 *          '200':
 *              description: Post Updated
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *          '400':
 *              description: Something went wrong
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                              err:
 *                                  type: object
 */

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

/**
 * @swagger
 * /posts/delete/{id}:
 *  patch:
 *      summary: To update post data
 *      tags: [Posts]
 *      responses:
 *          '200':
 *              description: Post deleted
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *          '400':
 *              description: Something went wrong
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                              err:
 *                                  type: object
 */

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