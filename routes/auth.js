const express = require('express');
const User = require('../Models/User');

const { body, validationResult } = require('express-validator');


const router = express.Router();


//create a user using POST using "/api/auth/createuser"

router.post('/createuser', [
    body('name','Enter a valid name').isLength({ min: 3 }),
    body('email','Enter a valid email').isEmail(),
    body('password','Enter a valid password').isLength({ min: 5 }),
], async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    } //It is a kind of validation layer
    //isse basically jo database me format dekhenge na hum db ka vhi yhi pe dikh jayega

    //check whether user with same emailId already exists

    try {
        
    
    let user = await User.findOne({email  : req.body.email});
    if(user){
        return res.status(400).json({error: "sorry a user with same emailId already exists"})
    }
    
     user = await User.create({
        name: req.body.name,
        password: req.body.password,
        email: req.body.email,
      })
      
    // .then(user => res.json(user))
    //   .catch(err=>{console.log(err)
    //     res.json({error:'please enter a unique value for email', message: err.message})
    // })
   res.json(user)
} catch (error) {
        console.log(error.message);
        res.status(500).send("some error occured");
}

})
module.exports = router