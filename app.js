const express = require("express");
//引入封装好的mysql文件
// const cry = require("./utils/crypto");
const server = express();
// const jwt = require('jsonwebtoken');

// const rateLimit = require('express-rate-limit');

server.all("*",function(req,res,next){
    //设置允许跨域的域名，*代表允许任意域名跨域
    res.header("Access-Control-Allow-Origin","*");
    //允许的header类型
    res.header("Access-Control-Allow-Headers","token,content-type");
    //跨域允许的请求方式 
    res.header("Access-Control-Allow-Methods","DELETE,PUT,POST,GET,OPTIONS");
    if (req.method.toLowerCase() == 'options')
        res.send(200);  //让options尝试请求快速结束
    else
        next();
})

//引入中间件 外部的功能强大
const bodyParser = require("body-parser");
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());



// const limiter = rateLimit({
//     windowMs: 60 * 1000, // 1分钟的时间窗口
//     max: 60, // 每个用户每分钟的最大请求数
//     message: {
//         code: 429,
//         data:'',
//         msg: 'TOO MANY REQUESTS',
//     },
//     keyGenerator: (req) => {
//       // 使用用户的 IP 地址作为唯一标识
//       return req.ip;
//     },
// });
// server.use(limiter)



//路由
server.use("/api/account",require("./routers/account.js"))
server.use("/api/product",require("./routers/product.js"))
server.use('/api/upload', require("./routers/upload.js"))
server.use('/api/category', require("./routers/category.js"))
server.use('/api/upload', require("./routers/upload"))
server.use('/api/pagedata', require("./routers/pageData"))
server.use('/api/meeting', require("./routers/meeting"))
server.use('/', require("./routers/index"))
server.use('/captcha', require("./routers/captcha"))



server.use(express.static( './static'))
server.listen(3000, () => {
    console.log("3000服务器启动完毕！");
})


