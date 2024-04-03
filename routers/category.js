const express = require("express");
const { jwtCheck } = require('../utils/jwt')

let router = express.Router();

router.post("/create", jwtCheck, require("../controller/category").create);
router.post("/get", require("../controller/category").getCategory);
router.post("/getall", require("../controller/category").getAllCategories);
router.post("/delete", jwtCheck, require("../controller/category").delete);
router.get("/get/detail", require("../controller/category").getCategoryDetail);
router.post("/update", jwtCheck, require("../controller/category").update);
router.get("/get/test", require("../controller/category").test);

module.exports = router;