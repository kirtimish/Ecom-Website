const path = require('path');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const rootDir = require('../util/path');

exports.postUser = async (req,res,next) => {
    const { username,email,password } = req.body;

    try { 
    const userExist = await User.findAll({where : {email}})
    console.log(userExist)

    if(userExist.length > 0){
        res.status(500).json({ errormsg: 'User already exists with this email Id'})
    } else {
        const saltrounds = 10;
        bcrypt.hash(password,saltrounds, async(err,hash) => {
            const userDetails = await User.create({
                username: username,
                email: email,
                password: hash
            })
                res.status(201).json({successMsg:'User created successfully',userDetails})
        }) 
    } 
 } catch(err){
            res.status(500).json({failMsg: 'User not created'})
        }
        
}

function generateAccessToken(id){
    return jwt.sign({userId:id},'secforauthtousfoexap');
}


exports.postuserLogin = async (req,res,next) => {
    const { email, password } = req.body;

try {
    const registeruserExist = await User.findAll({where: {email: email}})

    if(registeruserExist && registeruserExist.length){
        bcrypt.compare(password, registeruserExist[0].password,(err,result) => {
            if(result == true){
                return res.status(201).json({successMsg: 'User logged in successfully',token: generateAccessToken(registeruserExist[0].id)})
                
            } else {
                return res.status(401).json({errMsg: 'You entered wrong password. Try again', err: err})
            }
        })
    } else {
        res.status(404).json({errorMsg: 'User does not exist'})
    }
} catch (error) {
    res.status(500).json({errorMsg: error})
}
    

}