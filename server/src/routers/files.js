const express = require("express");
const router = express.Router();

router.put("/original-gif", function (req, res) {
    // TODO
    console.log("PUT /files/original-gif");
    res.status(400).json({message: "Not implemented."});
});

router.get("/original-gif", function (req, res) {
    // TODO
    res.status(400).json({message: "Not implemented."});
});

module.exports = router;