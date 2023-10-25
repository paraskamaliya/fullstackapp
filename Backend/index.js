const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const { connection } = require("./db");
app.use(express.json());
app.use(cors());

app.listen(process.env.port, async () => {
    try {
        await connection
        console.log("Connected to DB")
    } catch (error) {
        console.log(error);
    }
})