const express = require('express');
const router = express.Router()
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');

const { setTokenCookie, restoreUser } = require('../../utils/auth')
const { User } = require('../../db/models');


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

module.exports = router;
