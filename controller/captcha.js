const svgCaptcha = require('svg-captcha');
const uuid = require('uuid');
const redis = require('redis');
// const redisClient = redis.createClient();


class Captcha {
    async captcha(req, res, next) {
        const captcha = svgCaptcha.create();
        const captchaId = uuid.v4();
        // redisClient.set(captchaId, captcha.text);
        res.set('X-UUID', captchaId);
        res.set('Access-Control-Expose-Headers', 'X-UUID');
        console.log(captchaId)
        res.type('svg');
        res.status(200).send(captcha.data)
    }
}

module.exports = new Captcha()