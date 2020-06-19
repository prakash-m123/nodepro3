const express = require('express');

const { body } = require('express-validator');

const User = require('../models/user');
const userController= require('../controllers/user');

const isAuth=require('../middleware/is-auth');
const router = express.Router();

router.put('/register',
[
 body('phone')
 .trim()
 .isLength({ min: 10 }),
 body('email')
      .isEmail()
      .withMessage('Please enter a valid email.')
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then(userDoc => {
          if (userDoc) {
            return Promise.reject('E-Mail address already exists!');
          }
        });
      })
      .normalizeEmail(),
 body('password')
 .trim()
 .isLength({ min: 5 })
],
userController.userreg );

router.post('/sign',userController.sign);

router.get('/user/:userId',isAuth,userController.getUser);


module.exports = router;