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
    check('username')
        .exists({ checkFalsy: true })
        .isLength({ min: 4 })
        .withMessage('please provide a username with at least 4 characters'),
    check('username')
        .not()
        .isEmail()
        .withMessage('Username cannot be an email.'),
    check('password')
        .exists({ checkFalsy: true })
        .isLength({ min: 6 })
        .withMessage('Password must be 6 characters or more'),
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

    const safeUser = {
        id: user.id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
    }

    //console.log(safeUser)

    setTokenCookie(res, safeUser)

    return res.json({
        user: safeUser
    })
})



module.exports = router;
