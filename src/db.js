// @flow

import mongoose from 'mongoose'

export default (dbUrl: string, callback: (db: mongoose.Connection) => void) => {
  mongoose.connect(dbUrl)
  const db = mongoose.connection
  callback(db)
}
