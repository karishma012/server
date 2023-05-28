const express = require('express');
const User = require('../Models/User');
//we are using express validators
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = express.Router();
const JWT_SECRET = 'iamagoodgirl$hahah';

//create a user using POST using "/api/auth/createuser"
//ye sab mene express validator se uthaya

router.post('/createuser', [
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Enter a valid password').isLength({ min: 5 }),
], async (req, res) => {
    const errors = validationResult(req);  //yaha mai errors ko manage karri hu
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    } //It is a kind of validation layer


    //check whether user with same emailId already exists

    try {


        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ error: "sorry a user with same emailId already exists" })
        }
        const salt = await bcrypt.genSalt(10);

        secPass = await bcrypt.hash(req.body.password, salt);
        //isse basically jo database me format dekhenge na hum db ka vhi yhi pe dikh jayega or ek naya user create hojayega
        user = await User.create({
            name: req.body.name,
            password: secPass,
            email: req.body.email,
        })

        // .then(user => res.json(user))
        //   .catch(err=>{console.log(err)
        //     res.json({error:'please enter a unique value for email', message: err.message})
        // })
        //m user ki id bejungi token ke through...id bejke sb sambhal jayega
        const data = {
            user: {
                id: user.id
            }
        };

        const authtoken = jwt.sign(data, JWT_SECRET);

        // res.json(user)
        res.json({ authtoken })
    } catch (error) {
        console.log(error.message);
        res.status(500).send("some error occured");
    }

})
module.exports = router