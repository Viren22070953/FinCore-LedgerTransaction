email ka jo pura code rehta hai vo SMTP servers pe rehta hai 

to hame uske sath contact krne ke liye itni sari chize lgti hai jo ki code me hai (CLIENT_ID,CLIENT_SECRET,CLIENT_TOKEN)

hamara server transporters ko use krta hai, SMTP servers se communicate krne ke liye 

**Ledger**

1)suppose kro do user: user A and user B

2) user A ko 100rs send krne hai user b koo

3)sabse pehle ek transaction create hota hai jisme ye sab rehta hai ,
i)From:A
ii)To:B
iii)Amount:100
iv)idempotencyKey:xcvdfv (ye hamesha unique rehti hai)
v)status:pending 

3)uske bad Ledger Entry create hogi 

i)Ledger for user A
-Account:A
-amount:100
-type:debited

ii)Ledger for user B
-Account:B
-amount:100
-type:credited

4)jab ye dono ledger entries create ho jati hai uske bad transaction status pending se hatake complete kr dete hai
-Status:Completed


Note:agr isme se ek bhi process me error aa gya to aage kisi bhi process ko mt kro

**Idempotency Key**
i)ye ensure krti hai ki jo transaction hai vo ek hi bar perform hoo , bar bar na hoo.

ii)ye hamesha client side pe generate hoti hai , server ise genarate nhi krta 

iii)idempotency key ham isiliye use krte hai ki ek payment do bar na ho jaye 


**Ledger**
Note : Ledgers are our single source of truth
1)ledger ham create krte hai pr use ham kabhi bhi modify nhi krte aur uske liye ham hooks ka use krte hai.

2)function preventLedgerModification(){
  throw new Error("Ledger entries can not be modified or deleted");
}


**How to check senders balance before sending is it sufficient or not**
1)create method in accountModel
2)require ledgerModel into accountModel
3)accountSchema.methods.getBalance async function(){}

4)await ledgerModel.aggregate() ise kehte hai aggregation pipeline 
-ye hame ek array mangti hai , aur array ke andr multiple steps hoti hai
step i)tabhi ledger entries ko search kro jo match hoti hai is query se {$match: {account:this._id}},






