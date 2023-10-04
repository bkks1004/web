const { HTTP_CODE } = require('../constants/http')

exports.regularResponse = (obj, result, res, httpCode) => {
  obj.result = result
  obj.accessToken = res.locals.accessToken

  return res.status(httpCode).json(obj)
}

exports.errorResponse = (module, errorMsg, res, httpCode) => {
  console.error('[' + module + ']', errorMsg)
  return res.status(httpCode).json({
    error: errorMsg,
    accessToken: res.locals.accessToken,
  })
}

exports.throwError = async (msg, httpCode) => {
  throw {
    message: msg,
    httpCode,
  }
}

exports.rollbackAndResponse = async (module, err, res, t) => {
  const message = !err.message ? JSON.stringify(err) : err.message
  const httpCode = !err.httpCode ? HTTP_CODE.INTERNAL_ERROR : err.httpCode

  await t.rollback()
  console.error('[' + module + ']', err)
  return res.status(httpCode).json({
    error: message,
    accessToken: res.locals.accessToken,
  })
}
