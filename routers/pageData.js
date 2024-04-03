const express = require("express");


let router = express.Router();

router.get("/get", require("../controller/pageData").getData);
router.get("/get/nav/detail", require("../controller/pageData").getNavDetail);
router.post("/update/nav", require("../controller/pageData").updateNav);
router.post("/create/nav/", require("../controller/pageData").createNav);
router.post("/update/home/title", require("../controller/pageData").changenName);

module.exports = router;