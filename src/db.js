// @flow

import mongoose from 'mongoose'

export default (dbUrl: string): mongoose.Connection => {
  mongoose.connect(dbUrl)
  return mongoose.connection
}
