const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');

router.post('/', async (req, res) => {
    const { username, password, email } = req.body;
    const passwordHash = bcrypt.hashSync(password);

    const user = await User.create({
        username: username,
        email: email,
        hashedPassword: passwordHash
    })

    const safeUser = {
        id: user.id,
        username: user.username,
        email: user.email
    }

    console.log(safeUser)

    setTokenCookie(res, safeUser)

    return res.json({
        user: safeUser,
        username: safeUser.username
    })
})



module.exports = router;
