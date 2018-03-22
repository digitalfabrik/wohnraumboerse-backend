import mongoose from 'mongoose'

export default callback => {
  mongoose.connect('mongodb://localhost/livingDB')
  const db = mongoose.connection
  callback(db)
}
