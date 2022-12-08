const express = require('express');
const router = express.Router();
const expenseControls = require('../controlers/expenseControlls');
const userAuthentication = require('../middleware/auth')


router.get('/premiums',userAuthentication.authenticate, expenseControls.getAllUsers)
router.get('/download',userAuthentication.authenticate,expenseControls.downloadExpense)
router.get('/getAllUrl',userAuthentication.authenticate,expenseControls.downloadAllUrl)
router.get('/getInfo/:clickedUserId',userAuthentication.authenticate,expenseControls.getInfoForPremiumUsers)

module.exports = router;