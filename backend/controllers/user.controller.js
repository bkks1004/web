const models = require('../models')
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
      year_of_birth: req.body.birthday.substr(0, 4),
      sex: req.body.sex,
      phone_number: req.body.phoneNumber,
      email: req.body.email,
    }

    const createdUserInfo = await models.user.create(userObject, {
      transaction: t,
    })

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

exports.registSnsUser = async (req, res) => {
  const t = await models.sequelize.transaction()
  try {
    const checkDuplicateMail = await userModules.getUserIdFromEmail(
      req.body.email,
      t
    )
    let createdUserInfo
    if (!checkDuplicateMail.id) {
      const userObject = {
        id: req.body.id,
        name: req.body.name,
        birthday: req.body.birthday.substr(5),
        year_of_birth: req.body.birthday.substr(0, 4),
        sex: req.body.sex,
        phone_number: req.body.phoneNumber,
        email: req.body.email,
      }

      createdUserInfo = await models.user.create(userObject, {
        transaction: t,
      })
    } else {
      createdUserInfo = await userModules.getUserIdFromEmail(email, t)
    }
    await userModules.createSnsUserInfo(createdUserInfo.id, req.body.snsType, t)

    await t.commit()

    return regularResponse({}, 'OK', res, HTTP_CODE.CREATED)
  } catch (err) {
    console.log(err)
    return errorResponse(
      'user.con.registSnsUser',
      err,
      res,
      HTTP_CODE.BAD_REQUEST
    )
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
    const accessToken = authManager.createAccessToken(signObj)
    const refreshToken = authManager.createRefreshToken(signObj)

    await userModules.updateUserInfo({ refresh_token: refreshToken }, id, t)

    await t.commit()

    return regularResponse(
      { accessToken, refreshToken, userName: userInfo.name },
      'OK',
      res,
      HTTP_CODE.OK
    )
  } catch (err) {
    return errorResponse('user.con.login', err, res, HTTP_CODE.BAD_REQUEST)
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
