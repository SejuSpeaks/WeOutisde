const router = require('express').Router();
const { restoreUser } = require('../../utils/auth')

//routers
const usersRouter = require('./users');
const sessionRouter = require('./session');

router.use(restoreUser);

router.use('/session', sessionRouter);
router.use('/users', usersRouter);

router.post('/test', (req, res) => {
    res.json({ RequestBody: req.body })
})


module.exports = router
