// @flow
import {SMTPTransport} from 'nodemailer'

export interface Config {
    port: number,
    bodyLimit: string,
    corsHeaders: Array<string>,
    mongoDBUrl: string,
    smtp: SMTPTransport
}
