const express = require("express");
const userRouter = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { UserModel } = require("../model/user.model");
const { BlackListModel } = require("../model/blacklist.model")

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