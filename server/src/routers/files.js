const express = require('express');
const router = express.Router();

router.put('/original-gif', function (req, res) {
    // TODO
    console.log("PUT /files/original-gif")
    res.send('Not implemented');
})

router.get('/original-gif', function (req, res) {
    // TODO
    res.send('Not implemented');
})

module.exports = router;