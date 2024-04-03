const db = require("../DBhelper/mysql");
const sql = require("../utils/sql");

class ProductController {
    //创建
    async create(request, response, next) {
        const data = request.body
        let params = [
            data.name,
            data.stockLeven,
            data.imgs,
            data.sku,
            data.create_time,
            data.category,
            data.description,
            data.user,
            data.basePrice,
            data.salePrice,
            data.type,
        ];
        try {   
            let result = await db.exec(sql.createProduct, params);
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
    async getProducts(request, response, next) {
        const type = request.body.type
        const pageNow = request.body.pageNow || 1
        const pageSize = request.body.pageSize || 10
        let frage = ''
        let params = [
            request.body.start_time,
            request.body.end_time,
            request.body.user,
            request.body.type
        ];
        frage = type ? ` AND type = '${type}' ` : ''
        try {
            let result = await db.exec(`SELECT * FROM products ORDER BY create_time DESC  LIMIT ${(pageNow - 1) * pageSize },${pageSize};`, params);
            let count = await db.exec(`SELECT count(*) as total FROM products;`);
            if (result && result.length >= 0) {
                response.json({
                    code: 200,
                    data:result,
                    pagination: {
                        total: count[0].total,
                        pageNow,
                        pageSize
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
    async getAllProducts(request, response, next) {
        const type = request.body.type
        let params = [
            request.body.start_time,
            request.body.end_time,
            request.body.user,
        ];
        let data = {
            des:[],
            inc:[]
        }
        try {
            let desResult = await db.exec(`SELECT * FROM products WHERE create_time BETWEEN "${request.body.start_time}" AND "${request.body.end_time}" AND user = "${request.body.user}" AND type = "des";`, params);
            let incResult = await db.exec(`SELECT * FROM products WHERE create_time BETWEEN "${request.body.start_time}" AND "${request.body.end_time}" AND user = "${request.body.user}" AND type = "inc";`, params);
            data.des = desResult;
            data.inc = incResult;
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
    async getProduct(request, response, next) {
        try {
            let product = await db.exec(sql.getProduct, request.query.id);
            if (product && product.length > 0) {
                response.json({
                    code: 200,
                    data: product,
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
                request.body.stockLevel,
                request.body.imgs,
                request.body.sku,
                request.body.category,
                request.body.description,
                request.body.basePrice,
                request.body.salePrice,
                request.body.updateTime,
                request.body.id,
            ];
            let result = await db.exec(sql.updateProduct, params);
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
    async updateProductField(request, response, next) {
        try {
            const { productId, fieldName, newValue } = request.body
            const updateQuery = `UPDATE products SET ${fieldName} = ? WHERE id = ?`;
            console.log(updateQuery)
            let result = await db.exec(updateQuery, [newValue, productId]);
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

    async delete(request, response, next) {
        let params = [
            request.body.id,
        ];
        try {
            let result = await db.exec(sql.deleteProduct, params);
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
    async find(request, response, next) {
        let params = [
            request.body.searchKey,
            request.body.searchKey,
            request.body.searchKey
        ];  
        try {
            let result = await db.exec("SELECT * FROM products WHERE sku LIKE ? OR id LIKE ? OR name LIKE ?;", params);
            if (result.length >= 0) {
                response.json({
                    code: 200,
                    data:result,
                    pagination: {
                        total: result.length,
                        pageNow: 1,
                        pageSize: 999
                    },
                    msg: `共计${result.length}个产品`,
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

}
module.exports = new ProductController();
