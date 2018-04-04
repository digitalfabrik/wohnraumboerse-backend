import mongoose from 'mongoose'

export default (dbUrl, callback) => {
  mongoose.connect(dbUrl)
  const db = mongoose.connection
  callback(db)
}
