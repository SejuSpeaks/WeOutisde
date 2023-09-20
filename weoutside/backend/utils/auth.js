const jwt = require('jsonwebtoken');
const { jwtConfig } = require('../config');
const { User } = require('../db/models');

const { secret, expiresIn } = jwtConfig;


//sends a jwt cookie
const setTokenCookie = (res, user) => {
    //create token
    const safeUser = {
        id: user.id,
        email: user.email,
        username: user.username
    };

    const token = jwt.sign(
        { data: safeUser },
        secret,
        { expiresIn: Number(expiresIn) } //604,800 = 1 week
    );

    const isProduction = process.env.NODE_ENV === 'production'; //returns a boolean

    //set the token cookie
    res.cookie('token', token, {
        maxAge: expiresIn * 1000, //maxAge in milisecond //look up why??
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction && 'Lax'
    });

    return token;
}


const restoreUser = (req, res, next) => {
    //token paserd from cookies
    const { token } = req.cookies; //destructure token from cookies obj
    req.user = null;

    return jwt.verify(token, secret, null, async (err, jwtPayload) => {
        if (err) {
            return next();
        }


        try {
            const { id } = jwtPayload.data;
            req.user = await User.findByPk(id, {
                attributes: {
                    include: ['email', 'createdAt', 'updatedAt']
                }
            });
        }

        catch (error) {
            res.clearCookie('token');
            return next();
        }

        if (!req.user) res.clearCookie('token');
        return next();
    })
}

const requireAuth = (req, _res, next) => {
    if (req.user) return next();

    const err = new Error('Authentication required');
    err.title = 'Authentication required';
    err.errors = { message: 'Authentication required' };
    err.status = 401;
    return next(err);
}

module.exports = { setTokenCookie, restoreUser, requireAuth };
