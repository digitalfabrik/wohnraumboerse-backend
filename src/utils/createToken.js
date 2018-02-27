import crypto from 'crypto'

const BUFFER_LENGTH = 64

export default () => {
  const buf = Buffer.alloc(BUFFER_LENGTH)
  return crypto.randomFillSync(buf).toString('hex')
}
