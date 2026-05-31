const express=require("express");

const authMiddleware=require("../middleware/auth.middleware")

const transactionController=require('../controllers/transaction.controller')

const router=express.Router();

router.post('/create',authMiddleware.authMiddleware,transactionController.createTransaction)

//create initial funds by the system user
router.post('/intial-funds',authMiddleware.authSystemUserMiddleware,transactionController.createInitialFundsTransaction)

router.get("/history",authMiddleware.authMiddleware,transactionController.getTransactionHistory)



module.exports=router;