const Sequelize = require('sequelize');

const sequelize = new Sequelize('expense-Tracker', 'root', 'kirtimish.8383', {
    dialect: 'mysql',
    host: 'localhost'
})

module.exports = sequelize;