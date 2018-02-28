import {STATUS_OK, STATUS_SERVER_ERROR} from '../api/offers'
import {createTransport} from 'nodemailer'
import smptConfig from '../smptConfig'
import {compile} from 'pug'
import template creationMailPug from '../views/creationMail.pug'
import deletionMailPug from '../views/deletionMail.pug'
import extensionMailPug from '../views/extensionMail.pug'
import confirmationMailPug from '../views/confirmationMail.pug'

const renderConfirmationMail = compile(confirmationMailPug)
const renderCreationMail = compile(creationMailPug)
const renderExtensionMail = compile(extensionMailPug)
const renderDeletionMail = compile(deletionMailPug)

const getConfirmationUrl = (city, token) => `http://neuburg.wohnen.integreat-app.de/offer/${token}/confirm`
const getDeletionUrl = (city, token) => `http://neuburg.wohnen.integreat-app.de/offer/${token}/delete`
const getExtensionUrl = (city, token) => `http://neuburg.wohnen.integreat-app.de/offer/${token}/extend`

export default class MailService {
  sendCreationMail (offer, token) {
    const transporter = createTransport(smptConfig)
    const subject = 'Bestätigen Sie Ihr Angebot'
    return transporter.sendMail({
      to: offer.email,
      subject,
      html: renderCreationMail({ subject, confirmationUrl: getConfirmationUrl(offer.city, token) })
    })
  }

  sendConfirmationMail (offer, token) {
    const transporter = createTransport(smptConfig)
    const subject = 'Bestätigung erfolgreich'
    return transporter.sendMail({
      to: offer.email,
      subject,
      html: confirmationMail(subject,
        new Date(offer.expirationDate).toDateString(),
        getDeletionUrl(offer.city, token),
        getExtensionUrl(offer.city, token))
    })
  }
}

export const sendDeletionMail = ({res, email}) => {
  const createDeletionMail = compile(deletionMail)


  res.mailer.send('deletionMail', {
    to: email,
    subject: 'Löschung Ihres Wohungsangebotes'
  }, err => {
    if (err) {
      console.log(err)
      res.status(STATUS_SERVER_ERROR)
      res.send('There was an error sending the email')
      return
    }
    res.status(STATUS_OK)
    res.end()
  })
}

export const sendExtensionMail = ({res, email, expirationDate}) => res.mailer.send('extensionMail', {
  to: email,
  subject: 'Ihr Wohnungsangebot wurde erfolgreich verlängert',
  expirationDate: expirationDate
}, err => {
  if (err) {
    console.log(err)
    res.status(STATUS_SERVER_ERROR)
    res.send('There was an error sending the email')
    return
  }
  res.status(STATUS_OK)
  res.end()
})
