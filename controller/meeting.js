const db = require("../DBhelper/mysql");
const sql = require("../utils/sql");
const excelPort = require('excel-export');
const fs = require('fs');
const path = require('path');

class MettingController {
    //create
    async create(request, response, next) {
        const data = request.body
        const create_time = new Date()
        let params = [
            data.country,
            data.method,
            data.value,
            data.time,
            data.url,
            data.productId,
            create_time
        ];
        try {   
            let result = await db.exec(sql.createMeeting, params);
            if (result && result.affectedRows >= 1) {
                response.json({
                    code: 200,
                    msg: "Success",
                })
            } else {
                response.json({
                    code: 201,
                    msg: "failed",
                })
            }
        }catch (err) {
            response.json({
                code: -200,
                msg: "Something went wrong!",
                err
            })
        }
    }

    async getMeeting(request, response, next) {
        try {
            let mettings = await db.exec(sql.getMeetings);
            if (mettings && mettings.length > 0) {
                response.json({
                    code: 200,
                    data: JSON.stringify(mettings),
                    msg: "success",
                })
                return;
            } else {
                response.json({
                    code: 201,
                    data:[],
                    msg: "No meeting",
                })
            }
        }catch (err) {
            response.json({
                code: -200,
                msg: "Something went wrong",
                err
            })
        }
    }

    async getMeetingExcel(request, response, next) {
        try {
            const pwd = request.query.pwd
            if (!pwd || pwd !== 'renogy1314') {
                response.send(`<!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Document</title>
                </head>
                <body>
                    <style>
                        .container {
                            width: 100vw;
                            height: 100vh;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                        }
                        #commit {
                            cursor: pointer;
                        }
                    </style>
                    <div class="container">
                        <input type="password" placeholder="请输入密码" id="input">
                        <div href="#" id="commit">
                            提交
                        </div>
                    </div>
                    <script>
                        const c = document.querySelector('#commit')
                        const i = document.querySelector('#input')
                        c.addEventListener('click', (e) => {
                            const v = i.value
                            window.location.href = window.location.pathname+"?pwd="+v
                        })
                    </script>
                </body>
                </html>`)
            }
            let mettings = await db.exec(sql.getMeetings);
            var conf = {};
            conf.cols = [
               {caption:'Id', type:'number', width:20},
               {caption:'Website', type:'string', width:40},
               {caption:'Method', type:'string', width:20},
               {caption:'Method Value', type:'string', width:30},
               {caption:'Date Time', type:'string', width:40},
               {caption:'Url', type:'string', width:40},
               {caption:'ProductId', type:'string', width:40},
               {caption:'Created Time', type:'string', width:40},
            ];
            var array = [];
            // 循环导入从数据库中获取的表内容
            for (var i=0;i<mettings.length;i++){
                //依次写入
                array[i] = [
                    mettings[i].id,
                    mettings[i].country,
                    mettings[i].method,
                    mettings[i].value,
                    mettings[i].time,
                    mettings[i].url,
                    mettings[i].product_id,
                    mettings[i].created_time
                ];
            }
            //写入道conf对象中
            conf.rows = array;
            var result = excelPort.execute(conf);
            fs.writeFile(path.join(__dirname, '../utils/util.xlsx'), result, 'binary', function(err){
                if(err){
                    console.log(err);
                }
                response.download(path.join(__dirname, '../utils/util.xlsx'), function() {
                    return
                })
            });
        }catch (err) {
            console.log(err)
            response.json({
                code: -200,
                msg: "Something went wrong",
                err
            })
        }
    }
}
module.exports = new MettingController();
