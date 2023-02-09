const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = new Schema({
    username: {
        type: String, 
        required: true
    },
    email: {
        type: String, 
        required: true
    },
    password: {
        type: String,
        required: true 
    },
    ispremiumuser: {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model('User', userSchema);

// const Sequelize = require('sequelize');
// const sequelize = require('../util/database')

// const User = sequelize.define('user', {
//     id: {
//         type: Sequelize.INTEGER,
//         autoIncrement: true,
//         allowNull: false,
//         primaryKey: true
//     },
//     username: {
//         type: Sequelize.STRING, 
//         allowNull: false
//     },
//     email: {
//         type: Sequelize.STRING, 
//         allowNull: false
//     },
//     password: Sequelize.STRING, 
//     ispremiumuser: Sequelize.BOOLEAN
// })

// module.exports = User;