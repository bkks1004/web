const {
  verifyAccessToken,
  verifyRefreshToken,
  createAccessToken,
  createRefreshToken,
} = require('../modules/managers/authManager')
const models = require('../models')
const { HTTP_CODE } = require('../constants/http')
const { regularResponse, errorResponse } = require('./response')

const checkAccessToken = async (req, res, next) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(' ')[1]
    const accessResult = verifyAccessToken(token)
    if (accessResult.ok) {
      // refresh token 검증
      const refreshResult = await verifyRefreshToken(
        req.cookies.refreshToken,
        accessResult.id
      )
      if (!refreshResult) {
        // refresh token 만료되었을 경우 재발급
        const refreshToken = createRefreshToken()
        res.cookie('refreshToken', refreshToken, {
          httpOnly: true,
          secure: true,
          maxAge: 14 * 24 * 60 * 60 * 1000,
          // expires: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        })
        await models.user.update(
          { refresh_token: refreshToken },
          {
            where: {
              id: accessResult.id,
            },
          }
        )
      }
      next()
    } else {
      return errorResponse(
        'auth.middleware.checkAccessToken',
        'Access token is expired',
        res,
        HTTP_CODE.UNAUTHORIZED
      )
    }
  }
}
// cookies에 있는 refresh token이랑, 받은 id 값을 이용해 refresh token 검증하고 통과하면 access token 발급, 아니면 로그아웃!
const checkRefreshToken = async (req, res, next) => {
  console.log('리프레쉬 토큰 체크합니다!!!!!!!!!!!!!!!!')
  if (req.cookies.refreshToken) {
    // refresh token 검증
    const refreshResult = await verifyRefreshToken(
      req.cookies.refreshToken + 1,
      req.query.id
    )
    if (refreshResult) {
      // refresh token 검증된 경우 access token 발급
      const signObj = { id: req.query.id }
      res.locals.accessToken = createAccessToken(signObj)
      return regularResponse({}, 'Reissue access token', res, HTTP_CODE.OK)
    } else {
      res.clearCookie('refreshToken')
      return errorResponse(
        'auth.middleware.checkRefreshToken',
        'Refresh token is expired',
        res,
        HTTP_CODE.UNAUTHORIZED
      )
    }
  } else {
    return errorResponse(
      'auth.middleware.checkRefreshToken',
      'Refresh token is not existed',
      res,
      HTTP_CODE.UNAUTHORIZED
    )
  }
}

module.exports = { checkAccessToken, checkRefreshToken }
