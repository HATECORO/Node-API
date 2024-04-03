const express = require("express");
let router = express.Router();

router.get("/", require("../controller/captcha").captcha);


module.exports = router;