const router = require('express').Router();

router.get('/test', (req, res) => {
    res.send('api test works')
})

router.post('/test', (req, res) => {
    res.json({ requestBody: req.body })
})

module.exports = router
