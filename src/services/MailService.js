// @flow

import {createTransport, SMTPTransport} from 'nodemailer'
import {compileFile} from 'pug'
import Offer from '../models/Offer'
import getCityConfigs from '../cities/cityConfigs'
import moment from 'moment'
import getProjectRoot from '../utils/getProjectRoot'
import path from 'path'

const develop = process.env.NODE_ENV === 'development'

const projectRoot = getProjectRoot()

type RendererType = (mixed) => string

const compile = (viewPath: string): RendererType => compileFile(path.resolve(projectRoot, `views/${viewPath}`))

const renderConfirmationMail = compile('confirmationMail.pug')
const renderRequestConfirmationMail = compile('requestConfirmationMail.pug')
const renderDeletionMail = compile('deletionMail.pug')
const renderExtensionMail = compile('extensionMail.pug')

const getConfirmationUrl = (hostname: string, token: string): string => `https://${hostname}/offer/${token}/confirm`
const getExtensionUrl = (hostname: string, token: string): string => `https://${hostname}/offer/${token}/extend`
const getDeletionUrl = (hostname: string, token: string): string => `https://${hostname}/offer/${token}/delete`

const getFormattedDate = (date: Date): string => moment(date).locale('de').format('dddd, Do MMMM YYYY')

export default class MailService {
  smtpConfig: SMTPTransport

  constructor (smtpConfig: SMTPTransport) {
    this.smtpConfig = smtpConfig
  }

  async sendMail ({to, subject, html}: { to: string, subject: string, html: string }): Promise<void> {
    await createTransport(this.smtpConfig).sendMail({to, subject, html})
  }

  async sendRequestConfirmationMail (offer: Offer, token: string): Promise<void> {
    const subject = 'Bestätigen Sie Ihr Wohnungsangebot'
    const confirmationUrl = getConfirmationUrl(getCityConfigs()[offer.city].hostName, token)

    const html = renderRequestConfirmationMail({confirmationUrl, portalName: getCityConfigs[offer.city].title})
    if (!develop) {
      await this.sendMail({to: offer.email, subject, html})
    }
  }

  async sendConfirmationMail (offer: Offer, token: string): Promise<void> {
    const subject = 'Informationen zu Ihrem Wohnungsangebot'
    const expirationDate = getFormattedDate(offer.expirationDate)
    const deletionUrl = getDeletionUrl(getCityConfigs()[offer.city].hostName, token)
    const extensionUrl = getExtensionUrl(getCityConfigs()[offer.city].hostName, token)

    const html = renderConfirmationMail({
      expirationDate,
      deletionUrl,
      extensionUrl,
      portalName: getCityConfigs()[offer.city].title
    })
    if (!develop) {
      await this.sendMail({to: offer.email, subject, html})
    }
  }

  async sendDeletionMail (offer: Offer): Promise<void> {
    const subject = 'Löschung Ihres Wohnungsangebotes erfolgreich'

    const html = renderDeletionMail({portalName: getCityConfigs()[offer.city].title})
    if (!develop) {
      await this.sendMail({to: offer.email, subject, html})
    }
  }

  async sendExtensionMail (offer: Offer, token: string): Promise<void> {
    const subject = 'Erneuerung Ihres Wohungsangebotes erfolgreich'
    const expirationDate = getFormattedDate(offer.expirationDate)
    const deletionUrl = getDeletionUrl(getCityConfigs()[offer.city].hostName, token)
    const extensionUrl = getExtensionUrl(getCityConfigs()[offer.city].hostName, token)

    const html = renderExtensionMail({
      expirationDate,
      deletionUrl,
      extensionUrl,
      portalName: getCityConfigs()[offer.city].title
    })
    if (!develop) {
      await this.sendMail({to: offer.email, subject, html})
    }
  }
}
