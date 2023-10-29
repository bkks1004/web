const axios = require('axios')
const models = require('../models')
const dbConfig = require('../config/config')
const {
  regularResponse,
  errorResponse,
  throwError,
} = require('../middlewares/response')
const { HTTP_CODE } = require('../constants/http')
const crypto = require('crypto')
const bcrypt = require('bcrypt')
const authConfig = require('../config/auth.json')
const BCRYPT_ROUND = authConfig.bcryptSetting.round
const authManager = require('../modules/managers/authManager')
const mailManager = require('../modules/managers/mailManager')
const userModules = require('../modules/user')

exports.getUserInfo = async (req, res, next) => {
  const t = await models.sequelize.transaction()
  try {
    const userInfo = await userModules.getUserInfo(req.query.id, t)
    delete userInfo.dataValues.password

    await t.commit()

    return regularResponse({}, userInfo, res, HTTP_CODE.OK)
  } catch (err) {
    console.log(err)
    return errorResponse(
      'user.con.getUserInfo',
      err,
      res,
      HTTP_CODE.BAD_REQUEST
    )
  }
}

exports.registUser = async (req, res, next) => {
  const t = await models.sequelize.transaction()
  try {
    const userId = req.body.id
    const userInfo = await userModules.getUserInfo(userId, t)
    if (userInfo) {
      await throwError('이미 등록된 아이디입니다.', HTTP_CODE.CONFLICT)
    }
    const userObject = {
      id: userId,
      password: bcrypt.hashSync(req.body.password, BCRYPT_ROUND),
      name: req.body.name,
      birthday: req.body.birthday.substr(5),
      yearOfBirth: req.body.birthday.substr(0, 4),
      sex: req.body.sex,
      phoneNumber: req.body.phoneNumber,
      email: req.body.email,
      site: true,
    }

    const createdUserInfo = await userModules.createUserInfo(userObject, t)

    await t.commit()

    return regularResponse(
      { id: createdUserInfo.id },
      'OK',
      res,
      HTTP_CODE.CREATED
    )
  } catch (err) {
    console.log(err)
    return errorResponse('user.con.registUser', err, res, HTTP_CODE.BAD_REQUEST)
  }
}

exports.login = async (req, res, next) => {
  const t = await models.sequelize.transaction()
  try {
    const { id, password } = req.body
    const userInfo = await userModules.getUserInfo(id, t)

    if (!userInfo) {
      await throwError(
        '등록된 아이디가 없습니다.\n회원가입을 해주세요.',
        HTTP_CODE.NOT_FOUND
      )
    }
    if (!bcrypt.compareSync(password, userInfo.password)) {
      await throwError('비밀번호가 일치하지 않습니다.', HTTP_CODE.FORBIDDEN)
    }
    const signObj = {
      id,
    }
    res.locals.accessToken = authManager.createAccessToken(signObj)
    const refreshToken = authManager.createRefreshToken()
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: 14 * 24 * 60 * 60 * 1000,
      // expires: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    })

    await userModules.updateUserInfo({ refresh_token: refreshToken }, id, t)

    await t.commit()

    return regularResponse(
      { userName: userInfo.name, id: userInfo.id },
      'Login Success',
      res,
      HTTP_CODE.OK
    )
  } catch (err) {
    return errorResponse('user.con.login', err, res, HTTP_CODE.BAD_REQUEST)
  }
}

exports.updateUser = async (req, res) => {
  const t = await models.sequelize.transaction()
  try {
    const temp = await userModules.updateUserInfo(
      req.body.updateObject,
      req.body.id,
      t
    )
    await t.commit()

    return regularResponse({}, 'OK', res, HTTP_CODE.OK)
  } catch (err) {
    return errorResponse('user.con.updateUser', err, res, HTTP_CODE.BAD_REQUEST)
  }
}

exports.checkDuplicateId = async (req, res, next) => {
  const t = await models.sequelize.transaction()
  try {
    const userId = req.body.id
    const userInfo = await userModules.getUserInfo(userId, t)
    if (userInfo) {
      await throwError('이미 등록된 아이디입니다.', HTTP_CODE.CONFLICT)
    }
    await t.commit()

    return regularResponse({}, 'OK', res, HTTP_CODE.OK)
  } catch (err) {
    return errorResponse(
      'user.con.checkDuplicateId',
      err,
      res,
      HTTP_CODE.BAD_REQUEST
    )
  }
}

exports.checkSnsId = async (req, res, next) => {
  const t = await models.sequelize.transaction()
  try {
    const snsInfo = await userModules.getSnsUserInfo(
      req.query.id,
      req.query.snsType,
      t
    )
    await t.commit()

    if (snsInfo) return regularResponse({ snsInfo }, 'exist', res, HTTP_CODE.OK)
    else return regularResponse({}, 'not exist', res, HTTP_CODE.OK)
  } catch (err) {
    return errorResponse('user.con.checkSnsId', err, res, HTTP_CODE.BAD_REQUEST)
  }
}

exports.sendMailAuth = async (req, res, next) => {
  const t = await models.sequelize.transaction()
  try {
    const email = req.body.email
    const checkDuplicateMail = await userModules.getUserIdFromEmail(email, t)
    if (checkDuplicateMail?.id) {
      await throwError(
        `해당 메일로 가입된 아이디가 있습니다.\n(ID: ${checkDuplicateMail.id})`,
        HTTP_CODE.CONFLICT
      )
    }
    const hashedValue = crypto.randomBytes(82).toString('hex').substr(24, 6)
    const mailParams = {
      to: email,
      subject: '회원가입 인증 메일',
      // text: '여기에다가 인증 번호 적자', // html이 있으면 text는 안 나옴
      html:
        '<h1>안녕하세요</h1>' +
        '<h1>회원가입 인증 메일입니다.</h1><br>' +
        '<p>아래 인증코드를 회원가입 페이지에 입력해주세요.</p><br><br>' +
        '<div align="center" style="border:2px; width:40%"; solid black>' +
        '<h3 style="color:blue">회원가입 인증코드입니다.</h3>' +
        '<div style="font-size:130%">' +
        `<strong>${hashedValue}</strong>` +
        '</div><br>' +
        '</div>',
    }
    mailManager.sendMail(mailParams)
    await t.commit()

    return regularResponse({ authCode: hashedValue }, 'OK', res, HTTP_CODE.OK)
  } catch (err) {
    return errorResponse('user.con.createUser', err, res, HTTP_CODE.BAD_REQUEST)
  }
}

exports.getNaverToken = async (req, res, next) => {
  const t = await models.sequelize.transaction()
  try {
    const { data } = await axios({
      method: 'get',
      url: 'https://nid.naver.com/oauth2.0/token', //`https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id=${dbConfig.naver.clientId}&client_secret=${dbConfig.naver.clientSecret}&code=${req.query.code}&state=${dbConfig.naver.state}`,
      params: {
        grant_type: 'authorization_code',
        client_id: dbConfig.naver.clientId,
        code: req.query.code,
        client_secret: dbConfig.naver.clientSecret,
        state: dbConfig.naver.state,
      },
    })

    if (!data.access_token) {
      return errorResponse(
        'user.con.getNaverToken',
        'Can not get token',
        res,
        HTTP_CODE.UNAUTHORIZED
      )
    }
    const naverUserInfo = await getNaverUserInfo(data.access_token)
    const siteUserInfo = await userModules.getUserIdFromEmail(
      naverUserInfo.response.email,
      t
    )
    let userInfo = {
      id: null,
      name: null,
    }
    if (siteUserInfo) {
      const snsInfo = await userModules.getSnsUserInfo(
        siteUserInfo.id,
        'naver',
        t
      )
      if (!snsInfo) {
        await userModules.createSnsUserInfo(siteUserInfo.id, 'naver', t)
      }
      userInfo = {
        id: siteUserInfo.id,
        name: siteUserInfo.name,
      }
    } else {
      // 첫 이용자
      const userObject = {
        id: naverUserInfo.response.id,
        name: naverUserInfo.response.name,
        birthday: naverUserInfo.response.birthday,
        yearOfBirth: naverUserInfo.response.birthyear,
        sex: naverUserInfo.response.gender,
        phone_number: naverUserInfo.response.mobile.replaceAll('-', ''),
        email: naverUserInfo.response.email,
        site: false,
      }
      const createdUserInfo = await userModules.createUserInfo(userObject, t)

      await userModules.createSnsUserInfo(createdUserInfo[0].id, 'naver', t)
      userInfo = {
        id: createdUserInfo[0].id,
        name: createdUserInfo[0].name,
      }
    }

    // 토큰 저장, 로그인
    const signObj = {
      id: userInfo.id,
    }
    res.locals.accessToken = authManager.createAccessToken(signObj)
    const refreshToken = authManager.createRefreshToken()
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: 14 * 24 * 60 * 60 * 1000,
    })
    await userModules.updateUserInfo(
      { refresh_token: refreshToken },
      userInfo.id,
      t
    )

    await t.commit()

    return regularResponse(userInfo, 'ok', res, HTTP_CODE.OK)
  } catch (err) {
    return errorResponse(
      'user.con.getNaverToken',
      err,
      res,
      HTTP_CODE.BAD_REQUEST
    )
  }
}

const getNaverUserInfo = async accessToken => {
  const url = 'https://openapi.naver.com/v1/nid/me'
  const headers = { Authorization: `Bearer ${accessToken}` }
  const { data } = await axios.get(url, { headers })
  return data
}
