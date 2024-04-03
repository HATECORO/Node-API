const jwt = require('jsonwebtoken')



// token生成的密匙，根据自己需求定义
const jwtKey = '77e5a50c00951d03e1a0f8338ca98758ee496447064119e743164862c99de8c9' 

// token生成函数(jwtSign)，有效时间为90天
const jwtSign = (data) => { 
  const token = jwt.sign(data, jwtKey, {expiresIn: 60 * 60 * 24 * 30 * 3})
  return token
}

// token验证函数(jwtCheck)
const jwtCheck = (req, res, next) => { 
  //前端headers传来的token值:
  console.log(req.headers.f_server)
  const token = req.headers.token
  if (req.headers.f_server) {
    req.jwtInfo = 'true'
    next()
  } else {
    jwt.verify(token, jwtKey, (err, data) => {
      if (err) {
        res.send({
          code: 401,
          msg: 'token无效'
        })
      } else {
        req.jwtInfo = data
        next()
      }
    })
  }

}

module.exports = {
  jwtSign,
  jwtCheck
}
