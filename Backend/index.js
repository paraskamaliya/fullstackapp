const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const { connection } = require("./db");
const { userRouter } = require("./routes/user.router");
const { postRouter } = require("./routes/post.router");


app.use(express.json());
app.use(cors());
app.use("/users", userRouter);
app.use("/posts", postRouter);

app.listen(process.env.port, async () => {
    try {
        await connection
        console.log("Connected to DB")
    } catch (error) {
        console.log(error);
    }
})