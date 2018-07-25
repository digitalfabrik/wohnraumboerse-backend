// @flow

import mongoose from 'mongoose'

export const ACTION_GET = 'get'
export const ACTION_CREATED = 'created'
export const ACTION_ACTIVELY_DELETED = 'actively_deleted'
export const ACTION_CONFIRMED = 'confirmed'
export const ACTION_EXTENDED = 'extended'
export const ACTION_AUTOMATICALLY_DELETED = 'automatically_deleted'

const userActionSchema = mongoose.Schema({
  city: {
    type: String,
    lowercase: true,
    required: [true, 'Missing city']
  },
  timeStamp: {
    type: Date,
    required: [true, 'Missing timestamp']
  },
  action: {
    type: String,
    enum: [ACTION_ACTIVELY_DELETED, ACTION_AUTOMATICALLY_DELETED, ACTION_CONFIRMED,
      ACTION_CREATED, ACTION_EXTENDED, ACTION_GET],
    required: [true, 'Missing action type']
  }
})

export default mongoose.model('UserAction', userActionSchema)
