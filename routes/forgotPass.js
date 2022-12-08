const express = require('express');
const router = express.Router();
const forgotPassControlls = require('../controlers/forgotPass');

router.use('/forgotpassword', forgotPassControlls.forgotPassword);
router.get('/reset/:id',forgotPassControlls.resetPassword);
router.get('/update/:id',forgotPassControlls.updatePassword)

module.exports = router;