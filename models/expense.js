const Sequelize = require('sequelize');

const sequalize = require('../util/database');

const Expense = sequalize.define('expense', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    expenseAmt: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    description: {
        type: Sequelize.STRING,
        allowNull: false
    },
    category:  Sequelize.STRING,
});

module.exports = Expense;