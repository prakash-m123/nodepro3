const express = require("express");

const{ body } = require("express-validator");

const User=require("../models/user");
const userController= require("../controllers/user");

const router = express.Router();

router.put('/register',
[
 body('firstname')
 .not()
 .isEmpty(),
 body('lastname')
 .not()
 .isEmpty(),
 body('phone')
 .trim()
 .isLength({min:10}),
 body('email')
 .trim()
 .isEmail()
 .withMessage('Enter valid email')
 .custom((value) => {
     return User.findOne({ email:value }).then(userDoc=>{
         if(userDoc){
             return Promise.reject('Email alreay exists');
         }
     });
  })
  .normalizeEmail(),
   body('password')
   .trim()
   .isLength({min:5})
 
],
userController.userreg);


module.exports = router;