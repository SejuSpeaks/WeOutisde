const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');

//array of middleware validating signup credentials
const validateSignup = [
    check('email')
        .exists({ checkFalsy: true })
        .isEmail()
        .withMessage('Please provide a valid email'),
    check('firstName')
        .exists({ checkFalsy: true })
        .isLength({ min: 4 })
        .withMessage('First name is required and has to be at least 4 characters'),
    check('lastName')
        .exists({ checkFalsy: true })
        .withMessage('Last name is required.'),
    handleValidationErrors
];


router.post('/', validateSignup, async (req, res) => {
    const { username, password, email, firstName, lastName } = req.body;
    const passwordHash = bcrypt.hashSync(password);

    const user = await User.create({
        username: username,
        email: email,
        hashedPassword: passwordHash,
        firstName: firstName,
        lastName: lastName
    })

    const safeUser = { //touched username
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: username
    }



    setTokenCookie(res, safeUser)

    return res.json({
        user: safeUser
    })
})



module.exports = router;
