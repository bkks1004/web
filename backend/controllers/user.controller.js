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
const mailManager = require('../modules/managers/mailManager')
const userModules = require('../modules/user')

exports.getUserInfo = async (req, res, next) => {
  // const t = await db.transaction()
  try {
    // await t.commit()
    return res.status(200)
  } catch (err) {
    console.log(err)
  }
}

exports.createUser = async (req, res, next) => {
  const t = await models.sequelize.transaction()
  try {
    const userId = req.body.id
    const userInfo = await userModules.getUserInfo(userId, t)
    if (userInfo) {
      await throwError(userId + ' is already registered', HTTP_CODE.CONFLICT)
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

    await models.user.create(userObject, { transaction: t })

    await t.commit()

    return regularResponse({}, 'OK', res, HTTP_CODE.CREATED)
  } catch (err) {
    console.log(err)
    return errorResponse('user.con.createUser', err, res, HTTP_CODE.BAD_REQUEST)
  }
}

exports.sendMailAuth = async (req, res, next) => {
  try {
    const hashedValue = crypto.randomBytes(82).toString('hex').substr(24, 6)
    const mailParams = {
      to: req.body.mail,
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

    return regularResponse({ authCode: hashedValue }, 'OK', res, HTTP_CODE.OK)
  } catch (err) {
    console.log(err)
    return errorResponse('user.con.createUser', err, res, HTTP_CODE.BAD_REQUEST)
  }
}
