const express=require('express');
const accountController=require('../controllers/accounts.controller');

const authMiddleware=require('../middleware/auth.middleware');

const router=express.Router();

router.post("/",authMiddleware.authMiddleware,accountController.createAccount);

router.get("/getAccount",authMiddleware.authMiddleware,accountController.getAllAccounts
)


router.get("/:accountId",authMiddleware.authMiddleware,accountController.getBalance)
module.exports = router;