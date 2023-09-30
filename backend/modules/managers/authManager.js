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
const userModules = require('../user')

module.exports = {
  createAccessToken: signObj => {
    return jwt.sign(signObj, PRIVATE_KEY, {
      algorithm: 'ES256',
      expiresIn: authConfig.tokenSetting.defaultExpiredTime,
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
      algorithm: 'ES256',
      expiresIn: authConfig.tokenSetting.refreshTokenExpiredTime,
    })
  },
  verifyRefreshToken: async (token, id) => {
    try {
      const data = await userModules.getUserRefreshToken(id)
      if (token === data.refresh_token) {
        jwt.verify(token, PUBLIC_KEY)
        return true
      } else {
        return false
      }
    } catch (error) {
      return false
    }
  },
}
