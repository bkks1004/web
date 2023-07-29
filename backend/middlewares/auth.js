const { verifyAccessToken } = require('../modules/managers/authManager')
const { HTTP_CODE } = require('../constants/http')
const { errorResponse } = require('./response')

const authJWT = (req, res, next) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(' ')[1]
    const result = verifyAccessToken(token)
    if (result.ok) {
      next()
    } else {
      return errorResponse(
        'auth.middleware.authJWT',
        err,
        res,
        HTTP_CODE.UNAUTHORIZED
      )
    }
  }
}

module.exports = authJWT
