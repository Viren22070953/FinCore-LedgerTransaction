const express=require('express');
const accountController=require('../controllers/accounts.controller');

const authMiddleware=require('../middleware/auth.middleware');

const router=express.Router();

router.post("/",authMiddleware.authMiddleware,accountController.createAccount);

module.exports = router;