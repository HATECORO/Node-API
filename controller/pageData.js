const db = require("../DBhelper/mysql");
const sql = require("../utils/sql");
const querystring = require('querystring'); 
const jwt = require('jsonwebtoken');
const secretKey = '77e5a50c00951d03e1a0f8338ca98758ee496447064119e743164862c99de8c9';
const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJjdXN0b21lciI6eyJpZCI6MjczNCwiZW1haWwiOiJuZXdjdXN0b21lcjEyM0ByZW5vZ3kuY29tIiwiZ3JvdXBfaWQiOiIxMiJ9LCJpc3MiOiJiYy9hcHBzIiwic3ViIjoic3cxZWJkdnV3bSIsImlhdCI6MTY4MDE1NzU5NywiZXhwIjoxNjgwMTU4NDk3LCJ2ZXJzaW9uIjoxLCJhdWQiOiJnMDM0YzBnNWFrOThxZ2x4NmE3YmVwZDg4YjFhajVrIiwiYXBwbGljYXRpb25faWQiOiJnMDM0YzBnNWFrOThxZ2x4NmE3YmVwZDg4YjFhajVrIiwic3RvcmVfaGFzaCI6InN3MWViZHZ1d20iLCJvcGVyYXRpb24iOiJjdXJyZW50X2N1c3RvbWVyIn0.UqiCI7vOojJ9PugHWnjiT3JTbcjN2noOs7troJgvYADVBa5C23U2DeOB7ZiFg7pVVgufqEFdk_qRIeShZFJqTg';
const [header, payload, signature] = token.split('.');
const decodedHeader = JSON.parse(Buffer.from(header, 'base64').toString());
const decodedPayload = JSON.parse(Buffer.from(payload, 'base64').toString());
const fs = require('fs');
let cheerio = require("cheerio");
const { exec } = require('child_process');
const repoPath = './theme/renogy-us-new';


class PageController {
    async getData(request, response, next) {
        try {
            let nav = await db.exec(`SELECT * FROM nav`);
            let banners = await db.exec(`SELECT * FROM banners `);
            if ((nav && nav.length >= 1) || (banners && banners.length > 1)) {
                response.json({
                    code: 200,
                    data: {
                        nav,
                        banners
                    },
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
            console.log(err)
            response.json({
                code: -200,
                msg: "服务器异常",
                err
            })
        }
    }
    //创建
    async createNav(request, response, next) {
        let params = [
            request.body.name,
            request.body.url,
            request.body.createTime,
            request.body.description,
        ];

        try {
            let findC = await db.exec(sql.findNav, request.body.name);  
            if (findC && findC.length > 0) {
                response.json({
                    code: 201,
                    msg: "已存在",
                })
                return;
            } 
            let result = await db.exec(sql.createNav, params);
            if (result && result.affectedRows >= 1) {
                response.json({
                    code: 200,
                    msg: "创建成功",
                })
            } else {
                response.json({
                    code: 201,
                    msg: "创建失败",
                })
            }
        }catch (err) {
            console.log(err)
            response.json({
                code: -200,
                msg: "服务器异常",
                err
            })
        }
    }
    async delete(request, response, next) {
        let params = [
            request.body.id,
        ];
        try {
            let result = await db.exec(sql.deleteCategory, params);
            if (result && result.affectedRows >= 1) {
                response.json({
                    code: 200,
                    msg: "删除成功",
                })
            } else {
                response.json({
                    code: 201,
                    msg: "删除失败",
                })
            }
        }catch (err) {
            console.log(err)
            response.json({
                code: -200,
                msg: "服务器异常",
                err
            })
        }
    }
    async updateNav(request, response, next) {
        try {
            let params = [
                request.body.name,
                request.body.createTime,
                request.body.updateTime,
                request.body.description,
                request.body.url,
                request.body.pageId,
            ];
            console.log(params)
            let result = await db.exec(sql.updateNav, params);
            if (result && result.affectedRows >= 1) {
                response.json({
                    code: 200,
                    data: [],
                    msg: "success",
                })
                return;
            } else {
                response.json({
                    code: 201,
                    data:[],
                    msg: "fail",
                })
            }
        }catch (err) {
            console.log(err)
            response.json({
                code: -200,
                msg: "服务器异常",
                err
            })
        }
    }
    async getNavDetail(request, response, next) {
        try {
            let nav = await db.exec(sql.getNavDetail, request.query.id);
            if (nav && nav.length > 0) {
                response.json({
                    code: 200,
                    data: nav,
                    msg: "success",
                })
                return;
            } else {
                response.json({
                    code: 201,
                    data:[],
                    msg: "没查到商品",
                })
            }
        }catch (err) {
            console.log(err)
            response.json({
                code: -200,
                msg: "服务器异常",
                err
            })
        }
    }
    // test change BC files
    async changenName(request, response, next) {
        try {
            fs.readFile('./theme/renogy-us-new/templates/pages/home.html', 'utf8', (err, data) => {
                if (err) {
                    response.json({
                        code: -200,
                        msg: "服务器异常",
                        err
                    })
                    return;
                }
                let name = request.body.name
                var $ = cheerio.load(data,{
                    xml: {
                        xmlMode: false,
                        decodeEntities: false, // Decode HTML entities.
                    },
                  })
                $('.title-l').html(name)
                fs.writeFile("./theme/renogy-us-new/templates/pages/home.html", $.html(), function(err) {
                    if(err) {
                        throw err;
                    }
                    setTimeout(() => {
                            exec(`cd ${repoPath} && git add . && git commit -m "Auto commit test" && git push origin node-branch`, (error, stdout, stderr) => {
                            if (error) {
                              console.error(`exec error: ${error}`);
                              return;
                            }
                            console.log('commit ok')
                          });
                    })
                });
                response.json({
                    code: 200,
                    data: [],
                    msg: "success",
                })
                return;
            });
        }catch (err) {
            response.json({
                code: -200,
                msg: "服务器异常",
                err
            })
        }
    }
}
module.exports = new PageController();
