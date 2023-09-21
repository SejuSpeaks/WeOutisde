const express = require('express');
const router = express.Router()
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');

const { setTokenCookie, restoreUser } = require('../../utils/auth')
const { User } = require('../../db/models');

//restore session user
router.get('/', (req, res) => {
    const { user } = req;
    console.log('user from req', user);
    if (user) {
        const safeUser = {
            id: user.id,
            username: user.username,
            email: user.email
        }
        return res.json({
            user: safeUser
        });
    }
    else {
        return res.json({ user: null })
    }
})


//user login
router.post('/', async (req, res, next) => {
    const { credentials, password } = req.body

    const user = await User.unscoped().findOne({
        where: {
            [Op.or]: {
                username: credentials,
                email: credentials
            }
        }
    })


    if (!user || !bcrypt.compareSync(password, user.hashedPassword)) {
        const err = new Error('Login failed');
        err.status = 401;
        err.title = 'Login failed';
        err.errors = { credential: 'The provided credentials were invalid' };
        return next(err);
    }

    const safeUser = {
        id: user.id,
        username: user.username,
        email: user.email
    }

    setTokenCookie(res, safeUser);

    return res.json({
        user: safeUser
    })
})

//user log Out
router.delete('/', async (req, res) => {
    res.clearCookie('token');
    return res.json({ message: 'success' });
})

module.exports = router;
