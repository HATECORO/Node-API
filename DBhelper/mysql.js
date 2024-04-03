const mysql = require('mysql');
//创建连接池对象
const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    port: process.env.MYSQL_PORT,
    database: process.env.MYSQL_DATABASE,
    },
    //tokenKey: "myUrl.com"
);
pool.on('connection', (connection) => {
    //logger.info("connection!");
});

pool.on('enqueue', () => {
    //logger.info('Waiting for available connection slot');
});

module.exports.Pool = pool;

module.exports.getConnection = (cb) => {
    if (typeof cb == "function") {
        pool.getConnection(function (err, connection) {
            cb(err, connection);
        });
    } else {
        return new Promise((resolve, reject) => {
            pool.getConnection((err, connection) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(connection);
                }
            });
        });
    }
};
module.exports.exec = (sql, values, cb) => {
    if (typeof cb == "function") {
        pool.getConnection((err, connection) => {
            if (err) {
                connection.release();
                console.log(err)
                cb(err);
            } else {
                connection.query(sql, values, (error, rows) => {
                    connection.release();
                    console.log(rows)
                    cb(error, rows);
                });
            }
        });
    } else {
        return new Promise((resolve, reject) => {
            pool.getConnection((err, connection) => {
                if (err) {
                    connection.release();
                    reject(err);
                } else {
                    connection.query(sql, values, (error, rows) => {
                        connection.release();
                        if (error)
                            reject(error);
                        else
                            resolve(rows);
                    });
                }
            });
        });
    }
};
module.exports.beginTransaction = (connection, cb) => {
    if (typeof cb == "function") {
        connection.beginTransaction(function (err) {
            if (err) {
                throw err;
            }
            cb(null, connection);
        });
    } else {
        return new Promise((resolve, reject) => {
            connection.beginTransaction(function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(connection);
                }
            });
        });
    }
};
module.exports.rollback = (connection, cb) => {
    if (typeof cb == "function") {
        connection.rollback(function () {
            connection.release();
            cb && cb();
        });
    } else {
        return new Promise((resolve, reject) => {
            connection.rollback(function (err) {
                connection.release();
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }
};
module.exports.commit = (connection, cb) => {
    if (typeof cb == "function") {
        connection.commit(function (err) {
            if (err) {
                connection.rollback(function () {
                    cb && cb(err);
                    throw err;
                });
            }
            connection.release();
            cb && cb();
        });
    } else {
        return new Promise((resolve, reject) => {
            connection.commit(function (err) {
                if (err) {
                    connection.rollback(function () {
                        reject(err);
                    });
                }
                connection.release();
                resolve();
            });
        });
    }
};
//检查是否链接失败
this.getConnection((err, connection) => {
    if (err) throw err;
    else {
        // logger.info("connected success!");
        connection.release();
    }
});
