const jwt = require("jsonwebtoken")
const auth = (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1];
    if (token) {
        jwt.verify(token, "users", (err, decoded) => {
            if (decoded) {
                next();
                req.body.username = decoded.name
                req.body.userId = decoded.userId
            }
            else {
                res.status(200).send({ "message": "Something went wrong.", "err": err });
            }
        })
    }
    else {
        res.status(200).send({ "message": "Please Login first." });
    }
}
module.exports = { auth };