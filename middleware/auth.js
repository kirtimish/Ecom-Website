const jwt = require('jsonwebtoken');
const User = require('../models/user');

const authenticate = async (req,res,next) => {

    try {
        const token = req.header('Authorization')
        console.log(token);
        const user = jwt.verify(token,'secforauthtousfoexap')
        console.log("userId>>>>>",user.userId)

        User.findById(user.userId).then((user=>{
            console.log('userrrr',user._id)
            req.user=user;
            console.log(req.user._id)
            console.log(req.user)
            next();
        }))

    } catch (error) {
        console.log(error);
    }
    
}

module.exports = {
    authenticate
};