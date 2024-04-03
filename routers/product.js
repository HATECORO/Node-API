const express = require("express");
const { jwtCheck } = require('../utils/jwt')

let router = express.Router();

router.post("/create", jwtCheck, require("../controller/product").create);
router.post("/get", require("../controller/product").getProducts);
router.get("/get/detail", require("../controller/product").getProduct);
router.post("/getall", require("../controller/product").getAllProducts);
router.post("/update", jwtCheck, require("../controller/product").update);
router.post("/updateProductField", jwtCheck, require("../controller/product").updateProductField);
router.post("/delete", jwtCheck, require("../controller/product").delete);
router.post("/find", jwtCheck, require("../controller/product").find);

module.exports = router;