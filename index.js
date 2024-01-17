const express = require("express");
const app = express();
require("dotenv").config();
const swaggerUi = require("swagger-ui-express");
const swaggerJSDoc = require("swagger-jsdoc");
const cors = require("cors");
const { connection } = require("./db");
const { userRouter } = require("./routes/user.router");
const { postRouter } = require("./routes/post.router");


app.use(cors());
app.use(express.json());

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "fullstack app",
            version: "1.0.0"
        },
        servers: [
            {
                url: "https://full-jrsi.onrender.com/api"
            }
        ]
    },
    apis: ["./routes/*.js"]
}
const swaggerSpec = swaggerJSDoc(options)
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.use("/users", userRouter);
app.use("/posts", postRouter);
app.get("/", (req, res) => {
    res.status(200).send("welcome to home page")
})

app.listen(process.env.PORT, async () => {
    try {
        await connection
        console.log("Connected to DB")
    } catch (error) {
        console.log(error);
    }
})