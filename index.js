const express=require("express");
const app=express();
const Joi=require("joi")
const {v4 : uuidv4} = require('uuid')


app.use(express.json());
const shema=Joi.object({
  
    depositId: Joi.string(),
    returnUrl: Joi.string(),
    statementDescription: Joi.string(),
    amount: Joi.number().required(),
    msisdn: Joi.number().required(),
    country: Joi.string(),
    reason: Joi.string()
  
});
app.get("/",async (req,res)=>{
  const transactioncode = uuidv4();
  const {error}=shema.validate(req.body);
  if(error){
   return res.status("400").json({
      error:error.details[0].message
    });
  }

  
    try {
        const response = await fetch("https://api.sandbox.pawapay.cloud/v1/widget/sessions", {
          method: "POST", // or 'PUT'
          headers: {
            Authorization: 'Bearer eyJraWQiOiIxIiwiYWxnIjoiSFMyNTYifQ.eyJqdGkiOiJmOWYwZGQ1Ni1jMGIxLTRkMmUtYjk5NC1hN2NkODZhNDYyNDQiLCJzdWIiOiI4OTMiLCJpYXQiOjE3MTcyNzA2NzYsImV4cCI6MjAzMjgwMzQ3NiwicG0iOiJEQUYsUEFGIiwidHQiOiJBQVQifQ.Bv9tPgYUhxbwdlj8mMvekxbbSvrBjBba1CoCh9b6xhw',
            'Content-Type': 'application/json'
          },
        
          body: JSON.stringify(
            {
              depositId: transactioncode,
              returnUrl: "https://merchant.com/paymentProcessed",
              statementDescription: req.body.statementDescription,
              amount: req.body.amount,
              msisdn: req.body.msisdn,
              country: "GHA",
              reason: req.body.reason
            }
          ),
        });
    
        const result = await response.json();
        console.log("Success:", result);
        res.send(result)
      } catch (error) {
        console.error("Error:", error);
      }
})


app.listen("3000",()=>{
    console.log("Listen 3000")
});

