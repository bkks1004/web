const nodemailer = require('nodemailer')
const authConfig = require('../../config/auth.json')

exports.sendMail = ({ to, subject, html }) => {
  const transporter = nodemailer.createTransport(
    authConfig.nodeMailerTransporterSettings
  )
  console.log(authConfig.nodeMailerTransporterSettings)

  const mailOptions = {
    from: {
      name: authConfig.nodeMailerTransporterSettings.auth.name,
      address: authConfig.nodeMailerTransporterSettings.auth.user,
    },
    to,
    subject,
    html,
  }

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err)
    } else {
      console.log(info.response)
      transporter.close()
    }
  })
}
