const models = require('../models')

exports.getUserInfo = async (userId, t) => {
  return await models.user.findOne({
    attributes: [
      'id',
      'password',
      'email',
      'name',
      'sex',
      'phone_number',
      'year_of_birth',
      'birthday',
      'create_date',
      'site_id',
    ],
    where: {
      id: userId,
    },
    transaction: t,
  })
}

exports.getUserRefreshToken = async userId => {
  return await models.user.findOne({
    attributes: ['refresh_token'],
    where: {
      id: userId,
    },
  })
}

exports.getUserIdFromEmail = async (email, t) => {
  return await models.user.findOne({
    attributes: ['id', 'name', 'site_id'],
    where: {
      email,
    },
    transaction: t,
  })
}

exports.updateUserInfo = async (updateAttributes, id, t) => {
  return await models.user.update(updateAttributes, {
    where: {
      id,
    },
    transaction: t,
  })
}

exports.getSnsUserInfo = async (id, snsType, t) => {
  return await models.snsInfo.findOne({
    attributes: ['sns_id', 'sns_type', 'sns_connect_date'],
    where: {
      sns_id: id,
      sns_type: snsType,
    },
    transaction: t,
  })
}

exports.createUserInfo = async (attributes, t) => {
  return await models.user.upsert(
    {
      id: attributes.id,
      password: attributes?.password,
      name: attributes.name,
      birthday: attributes.birthday,
      year_of_birth: attributes.yearOfBirth,
      sex: attributes.sex,
      phone_number: attributes.phoneNumber,
      email: attributes.email,
      site_id: attributes.site,
    },
    { transaction: t }
  )
}

exports.createSnsUserInfo = async (id, snsType, t) => {
  return await models.snsInfo.upsert(
    {
      sns_id: id,
      sns_type: snsType,
      sns_connect_date: models.Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
    },
    { transaction: t }
  )
}
