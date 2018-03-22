import mongoose from 'mongoose'
import forms from './forms'

const offerSchema = mongoose.Schema({
  email: {
    type: String,
    lowercase: true,
    required: [true, 'ErrorMSG']
  },
  city: {
    type: String,
    lowercase: true,
    required: [true, 'ErrorMSG']
  },
  expirationDate: {
    type: Date,
    required: [true, 'ErrorMSG']
  },
  confirmed: {
    type: Boolean,
    required: [true, 'ErrorMSG'],
    default: false
  },
  deleted: {
    type: Boolean,
    required: [true, 'ErrorMSG'],
    default: false
  },
  createdDate: {
    type: Date,
    required: [true, 'ErrorMSG'],
    default: Date.now
  },
  hashedToken: {
    type: String,
    required: [true, 'ErrorMSG']
  },
  formData: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Array.from(Object.keys(forms)), // Must be one of the forms defined in forms.js
    required: [true, 'ErrorMSG']
  }
})

export default mongoose.model('Offer', offerSchema)
