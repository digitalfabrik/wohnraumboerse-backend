// @flow
import {SMTPTransport} from 'nodemailer'

export interface Config {
    port: number,
    bodyLimit: string,
    mongoDBUrl: string,
    smtp: SMTPTransport
}
