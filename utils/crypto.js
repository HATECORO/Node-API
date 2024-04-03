const crypto = require('crypto');
const md5 = crypto.createHash('md5');
module.exports = {
    md5 : (content) => {
        return crypto.createHash('md5').update(content).digest("hex")
    } 
}
