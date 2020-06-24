const fs = require('fs');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.userreg = (req,res,next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Validation failed.');
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }
    const firstname=req.body.firstname;
    const lastname=req.body.lastname;
    const phone=req.body.phone;
    const email=req.body.email;
    const password=req.body.password;
    bcrypt
      .hash(password,12)
      .then(hashedPass => {
        const user=new User({
          firstname:firstname,
          lastname:lastname,
          phone:phone,
          email:email,
          password:hashedPass,
          
        });
        return user.save();
      })
      
      .then(result => {
        res.status(201).json({ message: 'User registered!', userId:result._id });
      })
     
      .catch(err => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
  };

  exports.sign = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    let signUser;
   
    User.findOne({ email: email })
      .then(user => {
        if (!user) {
          const error = new Error('A user with this email could not be found.');
          error.statusCode = 401;
           throw error;
        }
        signUser = user;
        return bcrypt.compare(password, user.password);
      })
      .then(isEqual => {
        if (!isEqual) {
          const error = new Error('Wrong password!');
          error.statusCode = 401;
          throw error;
        }
        const token = jwt.sign(
          {
            email: signUser.email,
            adminId: signUser._id.toString()
            
          },
          
          'somesupersecretsecret',
          { expiresIn: '1h' }
        );
        res.status(200).json({ token:token, userId:signUser._id.toString() ,email:email});
    
     })
      .catch(err => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
      
  };
  
  exports.getUser = (req,res,next) => {
    const userId = req.params.userId;
   User.findById(userId)
    //.select("user firstname phone")
    //.populate("lastname")
      .then(user => {
        if (!user) {
          const error = new Error('Could not find user.');
          error.statusCode = 404;
          throw error;
        }
        res.status(200).json({ message: 'user fetched.', user: user });
      
      })
      .catch(err => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
       
        next(err);
      });
  };
  exports.updateuser=(req,res,next)=>{
    const Id=req.params.userId;
    const updateops={};
    for (let ops of req.body){
      updateops[ops.propname]=ops.value;
    }

    User.update ({_id:Id},{$set:updateops} )  //{$set:{name:req.body.name}}
    .then(result=>{
      res.status(200).json({message:'user updated'});
    })
    .catch(err=>{
     if(!err.statusCode){
       err.statusCode=500;
     }
     next(err);
    })

  }