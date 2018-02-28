import crypto from 'crypto'

const TOKEN_LENGTH = 64
const BYTE_LENGTH = TOKEN_LENGTH / 2

export default () => {
  return crypto.randomBytes(BYTE_LENGTH).toString('hex')
}
