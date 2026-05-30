const express=require('express');
const authRoutes=require('./routes/auth.routes');

const accountRoutes=require('./routes/account.routes');

const transactionRoutes=require("./routes/transaction.routes")

const cookieParser=require('cookie-parser');

const app=express();
app.use(express.json());
app.use(cookieParser());

app.post("/",(req,res)=>{
  res.send("Ledger services started")
})
app.use('/api/auth',authRoutes);
app.use('/api/accounts',accountRoutes);

app.use('/api/transaction',transactionRoutes)




module.exports=app;