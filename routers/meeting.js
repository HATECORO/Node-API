const express = require("express");

let router = express.Router();
router.post("/create", require("../controller/meeting").create);

router.get("/get/list", require("../controller/meeting").getMeeting);
router.get("/get/excel", require("../controller/meeting").getMeetingExcel);

module.exports = router;