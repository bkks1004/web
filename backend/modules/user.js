const models = require('../models')

exports.getUserInfo = async (userId, t) => {
  return await models.user.findOne({
    attributes: [
      'id',
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
