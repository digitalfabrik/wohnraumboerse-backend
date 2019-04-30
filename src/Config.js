// @flow
import {SMTPTransport} from 'nodemailer'

export interface Config {
  internalHost: string,
  internalPort: number,
  externalHost: string,
  externalProtocol: string,
  externalPort: number,
  bodyLimit: string,
  mongoDBUrl: string,
  smtp: SMTPTransport,
  logFile?: string
}
