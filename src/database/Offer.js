import mongoose from 'mongoose'

const offerSchema = mongoose.Schema({
  id: String,
  email: String,
  city: String,
  formData: Object,
  expirationDate: Date,
  confirmed: Boolean,
  deleted: Boolean,
  createdDate: Date,
  hashedToken: String
})

export default mongoose.model('Offer', offerSchema)