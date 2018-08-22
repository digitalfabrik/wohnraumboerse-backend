// @flow
import {SMTPTransport} from 'nodemailer'

export interface Config {
  host: string,
  port: number,
  protocol: string,
  bodyLimit: string,
  mongoDBUrl: string,
  smtp: SMTPTransport,
  logFile?: string
}
