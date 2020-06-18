const fs = require("fs");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require('../models/user');

exports.userreg = (req,res,next)=>{
  const errors=validationResult(req);
  if(!errors.isEmpty()){
      const error=new Error('validation failed');
      error.statusCode=422;
      error.data=errors.array();
      throw error;
  }
  const firstname =req.body.firstname;
  const lastname = req.body.lastname;
  const phone = req.body.phone;
  const email = req.body.email;
  const password = req.body.password;
 
  bcrypt
  .hash(password,12)
  .then(hashedpass=>{
      const user=new User({
       firstname:firstname,
       lastname:lastname,
       phone:phone,
       email:email,
       password:hashedpass
      });
      return user.save();
  })
  .then(result=>{
    res.status(201).json({message:'user registered' , userId:result._id});
    })
  .catch(err=>{
      if(!err.statusCode){
        err.statusCode=500;

      }
      next(err);
      
  });
    
};

