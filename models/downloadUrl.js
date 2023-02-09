const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const downloadUrlSchema = new Schema({
    filename: {
        type: String,
        required: true,
    },
    fileURL: {
        type: String,
        required: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
})

module.exports = mongoose.model('DownloadUrl', downloadUrlSchema);

// const Sequelize = require('sequelize');
// const sequelize = require('../util/database')

// const DownloadUrl = sequelize.define('downloadUrl', {
//     id: {
//         type: Sequelize.INTEGER,
//         unique:true,
//         autoIncrement:true,
//         allowNull: false,
//         primaryKey:true
//     },
//     filename: {
//         type:Sequelize.STRING,
//         allowNull:false,
//     },
//     fileURL: {
//         type:Sequelize.STRING,
//         allowNull:false,
//     },
// })

// module.exports = DownloadUrl