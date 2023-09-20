const router = require('express').Router();
const { setTokenCookie } = require('../../utils/auth')
const { User } = require('../../db/models');

const { restoreUser } = require('../../utils/auth')
router.use(restoreUser);

const { requireAuth } = require('../../utils/auth')



module.exports = router
