const express=require('express');
const accountController=require('../controllers/accounts.controller');

const authMiddleware=require('../middleware/auth.middleware');

const router=express.Router();

router.post("/create",authMiddleware.authMiddleware,accountController.createAccount);

router.get("/my-accounts",authMiddleware.authMiddleware,accountController.getMyAccounts)


router.get("/:accountId/balance",authMiddleware.authMiddleware,accountController.getBalance)


module.exports = router;