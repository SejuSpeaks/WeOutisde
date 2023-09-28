const router = require('express').Router();
const { restoreUser } = require('../../utils/auth')

//routers
const usersRouter = require('./users');
const sessionRouter = require('./session');

router.use(restoreUser);

router.use('/session', sessionRouter);
router.use('/users', usersRouter);

router.get('/csrf/restore', (req, res) => {
    const csrfToken = req.csrfToken();
    res.cookie("XSRF-TOKEN", csrfToken);
    res.status(200).json({
        'XSRF-Token': csrfToken
    })
    // res.send('Hey there')
})


router.post('/test', (req, res) => {
    res.json({ RequestBody: req.body })
})



module.exports = router
