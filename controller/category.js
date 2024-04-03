const db = require("../DBhelper/mysql");
const sql = require("../utils/sql");
const querystring = require('querystring'); 
const jwt = require('jsonwebtoken');
const secretKey = '77e5a50c00951d03e1a0f8338ca98758ee496447064119e743164862c99de8c9';
const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJjdXN0b21lciI6eyJpZCI6MjczNCwiZW1haWwiOiJuZXdjdXN0b21lcjEyM0ByZW5vZ3kuY29tIiwiZ3JvdXBfaWQiOiIxMiJ9LCJpc3MiOiJiYy9hcHBzIiwic3ViIjoic3cxZWJkdnV3bSIsImlhdCI6MTY4MDE1NzU5NywiZXhwIjoxNjgwMTU4NDk3LCJ2ZXJzaW9uIjoxLCJhdWQiOiJnMDM0YzBnNWFrOThxZ2x4NmE3YmVwZDg4YjFhajVrIiwiYXBwbGljYXRpb25faWQiOiJnMDM0YzBnNWFrOThxZ2x4NmE3YmVwZDg4YjFhajVrIiwic3RvcmVfaGFzaCI6InN3MWViZHZ1d20iLCJvcGVyYXRpb24iOiJjdXJyZW50X2N1c3RvbWVyIn0.UqiCI7vOojJ9PugHWnjiT3JTbcjN2noOs7troJgvYADVBa5C23U2DeOB7ZiFg7pVVgufqEFdk_qRIeShZFJqTg';
const [header, payload, signature] = token.split('.');
const decodedHeader = JSON.parse(Buffer.from(header, 'base64').toString());
const decodedPayload = JSON.parse(Buffer.from(payload, 'base64').toString());

class CategoryController {
    //创建
    async create(request, response, next) {
        let params = [
            request.body.name,
            request.body.createTime,
            request.body.updateTime,
            request.body.description,
            request.body.img,
        ];

        try {
            let findC = await db.exec(sql.findCategory, request.body.name);  
            if (findC && findC.length > 0) {
                response.json({
                    code: 201,
                    msg: "已有该分类",
                })
                return;
            } 
            let result = await db.exec(sql.createCategory, params);
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
    async getCategory(request, response, next) {
        const type = request.body.type
        const pageNow = request.body.pageNow || 1
        const pageSize = request.body.pageSize || 5
        let frage = ''
        let params = [
            request.body.start_time,
            request.body.end_time,
        ];
        frage = type ? ` AND type = '${type}' ` : ''
        try {
            let result = await db.exec(`SELECT * FROM category WHERE create_time BETWEEN "${request.body.start_time}" AND "${request.body.end_time}" AND user = "${request.body.user}"${frage}  ORDER BY create_time DESC  LIMIT ${(pageNow - 1) * pageSize },${pageSize};`, params);
            if (result && result.length >= 1) {
                response.json({
                    code: 200,
                    data:result,
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
    async getAllCategories(request, response, next) {
        try {
            let data = await db.exec(`SELECT * FROM category`);
            response.json({
                code: 200,
                data,
                msg: "成功",
            })
        } catch (error) {
            response.json({
                code: 201,
                data:[],
                msg: "失败",
            })
        }

    }

    async getCategoryDetail(request, response, next) {
        try {
            let category = await db.exec(sql.getCategoryDetail, request.query.id);
            if (category && category.length > 0) {
                response.json({
                    code: 200,
                    data: category,
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


    async update(request, response, next) {
        try {
            let params = [
                request.body.name,
                request.body.createTime,
                request.body.updateTime,
                request.body.description,
                request.body.img,
                request.body.categoryId,
            ];
            console.log(params)
            let result = await db.exec(sql.updateCategory, params);
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
    async test(request, response, next) {
        jwt.verify('eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJjdXN0b21lciI6eyJpZCI6OTM5ODMsImVtYWlsIjoiYWxsZW4uY2hlbkByZW5vZ3kuY24iLCJncm91cF9pZCI6IjM0In0sImlzcyI6ImJjL2FwcHMiLCJzdWIiOiJmaG5jaCIsImlhdCI6MTY4MDUwNzQzNiwiZXhwIjoxNjgwNTA4MzM2LCJ2ZXJzaW9uIjoxLCJhdWQiOiJnMDM0YzBnNWFrOThxZ2x4NmE3YmVwZDg4YjFhajVrIiwiYXBwbGljYXRpb25faWQiOiJnMDM0YzBnNWFrOThxZ2x4NmE3YmVwZDg4YjFhajVrIiwic3RvcmVfaGFzaCI6ImZobmNoIiwib3BlcmF0aW9uIjoiY3VycmVudF9jdXN0b21lciJ9.UPQkWuEziohsXWTeHQSW-eQ-3FgbAO1CW9mQLtF7nc6n6LzwUHe0L2XFJwKNYFKZAsTyu8RabpevR1J0QXb4mQ', '77e5a50c00951d03e1a0f8338ca98758ee496447064119e743164862c99de8c9', (err, data) => {
            if (err) {
                response.send({
                code: 200,
                data:{
                    msg: 'ok'
                },
                msg: 'token无效'
              })
            } else {
                console.log(data)
                response.send({
                    code: 200,
                    data:data,
                    msg: 'token无效'
                  })
              next()
            }
          })
        response.json({
            code: 201,
            data: decodedPayload,
            msg: "fail",
        })
    }
}
module.exports = new CategoryController();
