class Test {
    test(req, res, next) {

        res.send({
            code: 200,
            data: [],
            msg: 'success'
        })
    }
}

module.exports = new Test()