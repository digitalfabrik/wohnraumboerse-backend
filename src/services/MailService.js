// @flow

import {createTransport, SMTPTransport} from 'nodemailer'
import {compileFile} from 'pug'
import Offer from '../models/Offer'
import neuburgConfig from '../cityConfigs/neuburg'
import moment from 'moment'

const develop = process.env.NODE_ENV === 'development'

const renderConfirmationMail = compileFile('src/views/confirmationMail.pug')
const renderRequestConfirmationMail = compileFile('src/views/requestConfirmationMail.pug')
const renderDeletionMail = compileFile('src/views/deletionMail.pug')
const renderExtensionMail = compileFile('src/views/extensionMail.pug')

const getConfirmationUrl = (city: string, token: string): string => `http://neuburg.wohnen.integreat-app.de/offer/${token}/confirm`
const getDeletionUrl = (city: string, token: string): string => `http://neuburg.wohnen.integreat-app.de/offer/${token}`
const getExtensionUrl = (city: string, token: string): string => `http://neuburg.wohnen.integreat-app.de/offer/${token}/extend`

const getFormattedDate = (date: Date): string => moment(date).locale('de').format('dddd, Do MMMM YYYY')

export default class MailService {
  smtpConfig: SMTPTransport

  constructor (smtpConfig: SMTPTransport) {
    this.smtpConfig = smtpConfig
  }

  async sendMail ({to, subject, html}: {to: string, subject: string, html: string}): Promise<void> {
    await createTransport(this.smtpConfig).sendMail({to, subject, html})
  }

  async sendRequestConfirmationMail (offer: Offer, token: string): Promise<void> {
    const subject = 'Bestätigen Sie Ihr Wohnungsangebot'
    const confirmationUrl = getConfirmationUrl(offer.city, token)
    const {accentColor, logoSrc, portalName} = neuburgConfig

    const html = renderRequestConfirmationMail({subject, confirmationUrl, accentColor, logoSrc, portalName})
    if (!develop) {
      await this.sendMail({to: offer.email, subject, html})
    }
  }

  async sendConfirmationMail (offer: Offer, token: string): Promise<void> {
    const subject = 'Informationen zu Ihrem Wohnungsangebot'
    const expirationDate = getFormattedDate(offer.expirationDate)
    const deletionUrl = getDeletionUrl(offer.city, token)
    const extensionUrl = getExtensionUrl(offer.city, token)
    const {accentColor, logoSrc, portalName} = neuburgConfig

    const html = renderConfirmationMail({expirationDate, deletionUrl, extensionUrl, accentColor, logoSrc, portalName})
    if (!develop) {
      await this.sendMail({to: offer.email, subject, html})
    }
  }

  async sendDeletionMail (offer: Offer): Promise<void> {
    const subject = 'Löschung Ihres Wohnungsangebotes erfolgreich'
    const {accentColor, logoSrc, portalName} = neuburgConfig

    const html = renderDeletionMail({accentColor, logoSrc, portalName})
    if (!develop) {
      await this.sendMail({to: offer.email, subject, html})
    }
  }

  async sendExtensionMail (offer: Offer, token: string): Promise<void> {
    const subject = 'Verlängerung Ihres Wohungsangebotes erfolgreich'
    const expirationDate = getFormattedDate(offer.expirationDate)
    const deletionUrl = getDeletionUrl(offer.city, token)
    const extensionUrl = getExtensionUrl(offer.city, token)
    const {accentColor, logoSrc, portalName} = neuburgConfig

    const html = renderExtensionMail({expirationDate, deletionUrl, extensionUrl, accentColor, logoSrc, portalName})
    if (!develop) {
      await this.sendMail({to: offer.email, subject, html})
    }
  }
}
