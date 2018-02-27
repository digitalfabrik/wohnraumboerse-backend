import {STATUS_OK, STATUS_SERVER_ERROR} from '../api/offers'

const getConfirmUrl = (city, token) => `http://neuburg.wohnen.integreat-app.de/offer/${token}/confirm`
const getDeleteUrl = (city, token) => `http://neuburg.wohnen.integreat-app.de/offer/${token}/delete`

export const sendConfirmationMail = (res, email, city, token) => res.mailer.send('confirmationEmail', {
  to: email,
  subject: 'Bitte bestätigen Sie Ihr Wohnungsangebot',
  confirmUrl: getConfirmUrl(city, token)
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

export const sendDeleteMail = (res, email, city, token) => res.mailer.send('deleteEmail', {
  to: email,
  subject: 'Bestätigung Ihres Wohnungsangebotes',
  deleteUrl: getDeleteUrl(city, token)
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
