const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const forgotPasswordSchema = new Schema({
    active: { type: Boolean },
    expiresBy: { type: Date }
})

module.exports = mongoose.model('ForgotPassword', forgotPasswordSchema);