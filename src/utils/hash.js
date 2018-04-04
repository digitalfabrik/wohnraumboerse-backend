// @flow

import crypto from 'crypto'
import secret from '../secret'

export default function hash (value: string) {
  return crypto.createHmac('sha256', secret)
    .update(value)
    .digest('hex')
}
