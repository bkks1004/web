const authConfig = require('../../config/auth.json')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const JWT_SECRET = authConfig.jwtSecret
const JWT_PUBLIC = authConfig.jwtPublic
const PRIVATE_KEY = crypto.createPrivateKey({
  format: 'jwk',
  key: JWT_SECRET,
})
const PUBLIC_KEY = crypto.createPublicKey({
  format: 'jwk',
  key: JWT_PUBLIC,
})

module.exports = {
  createAccessToken: signObj => {
    return jwt.sign(signObj, PRIVATE_KEY, {
      expiresIn: authConfig.tokenSetting.defaultExpiredTime,
      algorithm: 'ES256',
    })
  },
  verifyAccessToken: token => {
    let decoded = null
    try {
      decoded = jwt.verify(token, PUBLIC_KEY)
      return {
        ok: true,
        id: decoded.id,
      }
    } catch (error) {
      return {
        ok: false,
        message: error.message,
      }
    }
  },
  createRefreshToken: () => {
    return jwt.sign({}, PRIVATE_KEY, {
      expiresIn: authConfig.tokenSetting.refreshTokenExpiredTime,
      algorithm: 'ES256',
    })
  },
  verifyRefreshToken: (token, id) => {
    try {
    } catch (error) {}
  },
}
