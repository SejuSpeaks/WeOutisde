const express = require('express');
const router = express.Router();

router.get('/hello/world', (req, res) => {
    res.cookie('XSERF_TOKEN', req.csrfToken());
    res.cookie("XSRF_TOKEN", csrfToken);
    res.status(200).json({
        'XSURF-Token': csrfToken
    })
})

module.exports = router
