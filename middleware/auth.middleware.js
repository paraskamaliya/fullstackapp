const jwt = require("jsonwebtoken");
const { BlackListModel } = require("../model/blacklist.model");
const auth = async (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1];
    if (token) {
        const tkn = await BlackListModel.findOne({ token });
        if (tkn) {
            res.status(200).send({ "message": "Please Login." })
        }
        else {
            jwt.verify(token, "users", (err, decoded) => {
                if (decoded) {
                    req.body.username = decoded.username
                    req.body.userId = decoded.userId
                    next();
                }
                else {
                    res.status(200).send({ "message": "Something went wrong.", "err": err });
                }
            })
        }
    }
    else {
        res.status(200).send({ "message": "Please Login first." });
    }
}
module.exports = { auth };