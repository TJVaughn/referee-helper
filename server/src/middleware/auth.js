const jwt = require('jsonwebtoken')
const User = require('../models/User')
const { getCookie } = require('../utils/GetCookie')

const auth = async (req, res, next) => {
    try {
        const cookies = req.header('Cookie', 'AuthToken')
        const token = getCookie("AuthToken", cookies)
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })
        if(!user){
            throw new Error()
        }

        req.token = token;
        req.user = user;
        next();
    } catch (error) {
        res.status(401).send({error: "Please Authenticate"})
    }
}

module.exports = auth