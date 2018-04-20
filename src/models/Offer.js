// @flow

import mongoose from 'mongoose'
import forms from './forms'

const offerSchema = mongoose.Schema({
  email: {
    type: String,
    lowercase: true,
    required: [true, 'Missing email']
  },
  city: {
    type: String,
    lowercase: true,
    required: [true, 'Missing city']
  },
  expirationDate: {
    type: Date,
    required: [true, 'Missing expiration date']
  },
  confirmed: {
    type: Boolean,
    required: [true, 'Missing confirmed property'],
    default: false
  },
  deleted: {
    type: Boolean,
    required: [true, 'Missing deleted property'],
    default: false
  },
  createdDate: {
    type: Date,
    required: [true, 'Missing created date'],
    default: Date.now
  },
  hashedToken: {
    type: String,
    required: [true, 'Missing hashed token'],
    unique: true // Create a mongodb unique index
  },
  formData: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Array.from(Object.keys(forms)), // Must be one of the forms defined in forms.js
    required: [true, 'Missing form data']
  }
})

// Arrow functions don't work here for some reason
offerSchema.methods.isExpired = function (): boolean {
  return this.expirationDate <= Date.now()
}

export default mongoose.model('Offer', offerSchema)
