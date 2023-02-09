const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const expenseSchema = new Schema({
    expenseAmt: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
})

module.exports = mongoose.model('Expense', expenseSchema);

// const Sequelize = require('sequelize');

// const sequalize = require('../util/database');

// const Expense = sequalize.define('expense', {
//     id: {
//         type: Sequelize.INTEGER,
//         autoIncrement: true,
//         allowNull: false,
//         primaryKey: true
//     },
//     expenseAmt: {
//         type: Sequelize.INTEGER,
//         allowNull: false
//     },
//     description: {
//         type: Sequelize.STRING,
//         allowNull: false
//     },
//     category:  Sequelize.STRING,
// });

// module.exports = Expense;