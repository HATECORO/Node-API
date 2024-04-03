const express = require("express");
const { jwtCheck } = require('../utils/jwt')

let router = express.Router();

//登录
router.post("/login", require("../controller/account").login);
//注册
router.post("/regist", require("../controller/account").register);
router.post("/update", require("../controller/account").update);
router.get("/getuserinfo", jwtCheck, require("../controller/account").getuserinfo);

module.exports = router;