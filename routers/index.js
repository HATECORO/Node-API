const express = require("express");

let router = express.Router();

router.get("/", require("../controller/test").test);


module.exports = router;