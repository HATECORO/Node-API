const multer = require('multer')
const storage = multer.diskStorage({
    destination(req, file, cb){
        cb(null, __dirname + '../../static/imgs')
    },
    filename(req, file, cb){
        cb(null, Date.now() + file.originalname)
    }
})

const upload = multer({storage})
const express = require("express");

let router = express.Router();

router.post('/files',upload.single('file'),  (req, response) => {
    const file = req.file
    file.url = `http://localhost:3000/imgs/${file.filename}`
    response.json({
        code: 200,
        data:{
            url: file.url,
            name: file.filename,
        },
        msg: "成功",
    })
})
module.exports = router;