import {createTransport} from 'nodemailer'
import smptConfig from '../smptConfig'
import { compileFile} from 'pug'

const renderConfirmationMail = compileFile('src/views/confirmationMail.pug')
const renderCreationMail = compileFile('src/views/creationMail.pug')
const renderDeletionMail = compileFile('src/views/deletionMail.pug')
const renderExtensionMail = compileFile('src/views/extensionMail.pug')

const getConfirmationUrl = (city, token) => `http://neuburg.wohnen.integreat-app.de/offer/${token}/confirm`
const getDeletionUrl = (city, token) => `http://neuburg.wohnen.integreat-app.de/offer/${token}/delete`
const getExtensionUrl = (city, token) => `http://neuburg.wohnen.integreat-app.de/offer/${token}/extend`

export default class MailService {
  async sendMail ({to, subject, html}) {
    await createTransport(smptConfig).sendMail({to, subject, html})
  }

  async sendCreationMail (offer, token) {
    const subject = 'Bestätigen Sie Ihr Angebot'
    const html = renderCreationMail({subject, confirmUrl: getConfirmationUrl(offer.city, token)})
    await this.sendMail({to: offer.email, subject, html})
  }

  async sendConfirmationMail (offer, token) {
    const subject = 'Bestätigung erfolgreich'
    const expirationDate = new Date(offer.expirationDate).toDateString()
    const deletionUrl = getDeletionUrl(offer.city, token)
    const extensionUrl = getExtensionUrl(offer.city, token)
    const html = renderConfirmationMail({expirationDate, deletionUrl, extensionUrl})
    await this.sendMail({to: offer.email, subject, html})
  }

  async sendDeletionMail (offer) {
    const subject = 'Angebot erfolgreich gelöscht'
    const html = renderDeletionMail()
    await this.sendMail({to: offer.email, subject, html})
  }

  async sendExtensionMail (offer, token) {
    const subject = 'Angebot erfolgreich verlängert'
    const expirationDate = new Date(offer.expirationDate).toDateString()
    const deletionUrl = getDeletionUrl(offer.city, token)
    const extensionUrl = getExtensionUrl(offer.city, token)
    const html = renderExtensionMail({expirationDate, deletionUrl, extensionUrl})
    await this.sendMail({to: offer.email, subject, html})
  }
}
