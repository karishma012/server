const express = require('express');
const User = require('../Models/User');
//we are using express validators
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser')
const router = express.Router();
const JWT_SECRET = 'iamagoodgirl$hahah';

//ROUTE 1 : create a user using POST using "/api/auth/createuser"
//ye sab mene express validator se uthaya

router.post('/createuser', [
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Enter a valid password').isLength({ min: 5 }),
], async (req, res) => {
    let success = false;
    const errors = validationResult(req);  //yaha mai errors ko manage karri hu
    if (!errors.isEmpty()) {
        return res.status(400).json({success, errors: errors.array() });
    } //It is a kind of validation layer


    //check whether user with same emailId already exists

    try {


        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({success, error: "sorry a user with same emailId already exists" })
        }
        const salt = await bcrypt.genSalt(10); //salt generate kia
        //yaha mera JWT ka role aata hai
        secPass = await bcrypt.hash(req.body.password, salt); //total password = password + salt
        //ab sab sahi raha toh ek naya user create hojayega
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
        //basically yaha web token ki help se verifivation ho raha hai
        //basically yaha tokens ka usage hai
        const data = {
            user: {
                id: user.id
            }
        };

        const authtoken = jwt.sign(data, JWT_SECRET);

        // res.json(user)
        success=true;
        res.json({success, authtoken })
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server error occured");
    }

})
//ROUTE 2 : now here we r going to create a similar page for login, here only email and password will be required so everything is copied and pasted

router.post('/login', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'password cannot be blank').exists(),
], async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) {
            success = false;
            return res.status(400).json({ error: "please try to login with correct credentials" });
        }
        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
            success = false;
            return res.status(400).json({ success, error: "please try to login with correct credentials" });
        }
        const data = {
            user: {
                id: user.id
            }
        };
        const authtoken = jwt.sign(data, JWT_SECRET);
        success = true;
        res.json({ success, authtoken });
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server error occurred");
    }
});

//ROUTE :3 get user details . here we are finding user by id..sab kuch id se hi hoga
//authToken dalenge or user ka detai milega bas usme password hi ni milega kyuki vo humne minus kiya hua hai
router.post('/getuser', fetchuser, async (req, res) => {
    try {

        userId = req.user.id;
        const user = await User.findById(userId).select('-password')
        res.send(user)
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server error occured");
    }
})

module.exports = router