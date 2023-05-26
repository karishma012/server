const express = require('express');
const User = require('../Models/User');


const router = express.Router();


//create a user using POST

router.post('/',(req,res)=>{
    console.log(req.body);
    const user = User(req.body);
    user.save()
    res.send(req.body);

})
module.exports = router