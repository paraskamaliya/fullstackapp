const express = require("express");
const userRouter = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { UserModel } = require("../model/user.model");
const { BlackListModel } = require("../model/blacklist.model")

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the user
 *         name:
 *           type: string
 *           description: The name of the user
 *         email:
 *           type: string
 *           description: The email of the user
 *         pass:
 *           type: string
 *           description: The hashed password of user
 */

/**
 * @swagger
 * tags:
 *  name: Users
 *  description: all the user related routes
 */

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *            schema:
 *              type: object
 *              properties:
 *                  name:
 *                      type: string
 *                  email:
 *                      type: string
 *                  pass:
 *                      type: string
 *     responses:
 *        '200':
 *          description: New user has been added
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/User'
 *        '400':
 *          description: Something went wrong while hashing.
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          message:
 *                              type: string
 *                          error:
 *                              type: object
 */

userRouter.post("/register", (req, res) => {
    const { name, email, pass } = req.body;
    try {
        bcrypt.hash(pass, 5, async (err, hash) => {
            if (hash) {
                const user = new UserModel({
                    name, email, pass: hash
                })
                await user.save();
                res.status(200).send({ "message": "New user has been added", "new_user": req.body })
            }
            else {
                res.status(200).send({ "message": "something went wrong while hashing.", "err": err })
            }
        })
    } catch (error) {
        res.status(400).send({ "message": "Something went wrong.", "err": error })
    }
})

/**
 * @swagger
 * /users/login:
 *  post:
 *      summary: Login in user
 *      tags: [Users]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          email:
 *                              type: string
 *                          pass:
 *                              type: string
 *      responses:
 *          '200':
 *              description: Successfully logged in
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                              token:
 *                                  type: string
 *          '400':
 *              description: something went wrong
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                              err:
 *                                  type: string
 */

userRouter.post("/login", async (req, res) => {
    const { email, pass } = req.body;
    try {
        const user = await UserModel.findOne({ email });
        if (user) {
            bcrypt.compare(pass, user.pass, (err, result) => {
                if (result) {
                    const token = jwt.sign({ username: user.name, userId: user._id }, "users");
                    res.status(200).send({ "message": "Successfully logged in.", "token": token })
                }
                else {
                    res.status(200).send({ "message": "Something went wrong.", "err": err })
                }
            })
        }
        else {
            res.status(200).send({ "message": "User is not found." })
        }
    } catch (error) {
        res.status(400).send({ "message": "Something went wrong.", "err": error })
    }
})

/**
 * @swagger
 * /users/logout:
 *  get:
 *      summary: for logging out user
 *      tags: [Users]
 *      responses:
 *          '200':
 *              description: Successfully logged out
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

userRouter.get("/logout", async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    try {
        const list = new BlackListModel({ token });
        await list.save();
        res.status(200).send({ "message": "Successfully logged out" });
    } catch (error) {
        res.status(400).send({ "message": "Something went wrong", "err": error })
    }
})

module.exports = { userRouter };