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
    ],
    where: {
      id: userId,
    },
    transaction: t,
  })
}

exports.updateUserInfo = async (updateAttributes, id, t) => {
  await models.user.update(
    updateAttributes,
    {
      where: {
        id,
      },
    },
    { transaction: t }
  )
}
