// @flow
import {SMTPTransport} from 'nodemailer'

export interface Config {
    host: string,
    port: number,
    bodyLimit: string,
    mongoDBUrl: string,
    smtp: SMTPTransport
}
