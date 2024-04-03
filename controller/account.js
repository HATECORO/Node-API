const db = require("../DBhelper/mysql");
const sql = require("../utils/sql");
const crypto = require("../utils/crypto");
const { jwtSign } = require('../utils/jwt')
//日期的库
// const moment = require("moment");
//MD5加密
// const md5 = require("md5");

//npm jwt-simple --save-dev  操作Token
// const jwt = require("jwt-simple");

class AccountController {
    //登录的
    async login(request, response, next) {
        const { captcha } = request.body;
          // 检查验证码是否匹配
          console.log(captcha)
          console.log(request.session)
        if (captcha !== request.session.captcha) {
            response.json({
                code: 201,
                msg: "验证码错误",
                data: '',
            })
            return
        }
        let loginSql = "select email, username from user WHERE email = ? and password = ?;";
        let params = [
            request.body.email,
            request.body.password
        ]
        try {
            let result = await db.exec(loginSql, params);
            if (result && result.length >= 1) {
                result = result.map( (item) => Object.assign(item,{
                    token:jwtSign({email: item.email}) 
                }))
                response.json({
                    code: 200,
                    msg: "登录成功",
                    data: result[0],
                })
            } else {
                response.json({
                    code: 201,
                    msg: "登录失败,帐号或密码错误",
                    data: result[0],
                })
            }
        } catch (error) {
            response.json({
                code: 201,
                msg: "登录服务器异常",
                error
            })
        }
        // function createToken(data) {
        //     return jwt.encode({
        //         //Token保存一天
        //         exp:DataCue.now() + (1000 * 60 * 60 * 24),
        //         info: data
        //     },require("myUrl.com"))
        // }
    }

    //注册的
    async register(request, response, next) {
        //insert into user('username','password') value ('','')
        let params = [
            request.body.username,
            request.body.email,
            request.body.password
        ];
        try {
            let findUser = await db.exec(sql.findUser, request.body.email);
            if (findUser && findUser.length > 0) {
                response.json({
                    code: 201,
                    msg: "用户已注册",
                })
                return;
            }
            let result = await db.exec(sql.registUser, params);
            //判断是否有被一行影响
            if (result && result.affectedRows >= 1) {
                response.json({
                    code: 200,
                    msg: "注册成功",
                })
            } else {
                response.json({
                    code: 201,
                    msg: "注册失败",
                })
            }
        }catch (err) {
            response.json({
                code: -200,
                msg: "服务器异常",
                err
            })
        }
    }

    //更新
    async update(request, response, next) {
        //insert into user('username','password') value ('','')
        let params = [
            request.body.username,
            request.body.password,
            request.body.imageUrl,
            request.body.id
        ];
        try {
            let result = await db.exec(sql.updateUser, params);
            //判断是否有被一行影响
            console.log(result)
            if (result && result.affectedRows >= 1) {
                response.json({
                    code: 200,
                    msg: "成功",
                })
            } else {
                response.json({
                    code: 201,
                    msg: "失败",
                })
            }
        }catch (err) {
            response.json({
                code: -200,
                msg: "服务器异常",
                err
            })
        }
    }


    async getuserinfo(request, response, next) {
        // 应用token
        let userInfoSql = `select * from user where email = '${request.jwtInfo.email}';`;
        try {
            let result = await db.exec(userInfoSql);
            //判断是否有被一行影响
            if (result && result.length >= 1) {
                response.json({
                    code: 200,
                    data:result[0],
                    msg: "成功",
                })
            } else {
                response.json({
                    code: 201,
                    data:[],
                    msg: "失败",
                })
            }
        }catch (err) {
            response.json({
                code: 201,
                msg: "服务器异常",
                err
            })
        }
    }
}
module.exports = new AccountController();
