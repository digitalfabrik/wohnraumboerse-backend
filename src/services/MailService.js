import {STATUS_OK, STATUS_SERVER_ERROR} from '../api/offers'

const getConfirmationUrl = (city, token) => `http://neuburg.wohnen.integreat-app.de/offer/${token}/confirm`
const getDeletionUrl = (city, token) => `http://neuburg.wohnen.integreat-app.de/offer/${token}/delete`
const getExtentionUrl = (city, token) => `http://neuburg.wohnen.integreat-app.de/offer/${token}/extend`

export const sendCreationMail = ({res, email, city, token}) => res.mailer.send('creationMail', {
  to: email,
  subject: 'Bestätigung Ihres Wohungsangebotes benötigt',
  confirmUrl: getConfirmationUrl(city, token)
}, err => {
  if (err) {
    console.log(err)
    res.status(STATUS_SERVER_ERROR)
    res.send('There was an error sending the email')
    return
  }
  res.status(STATUS_OK)
  res.json(token)
})

export const sendConfirmationMail = ({res, email, city, token, expirationDate}) => res.mailer.send('confirmationMail', {
  to: email,
  subject: 'Bestätigung Ihres Wohnungsangebotes erfolgreich',
  deleteUrl: getDeletionUrl(city, token),
  extendUrl: getExtentionUrl(city, token),
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

export const sendDeletionMail = ({res, email}) => res.mailer.send('deletionMail', {
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

export const sendExtentionMail = ({res, email, expirationDate}) => res.mailer.send('extentionMail', {
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
