// @flow

import mongoose from 'mongoose'

export const ACTION_GET = 'get'
export const ACTION_CREATED = 'created'
export const ACTION_ACTIVELY_DELETED = 'actively_deleted'
export const ACTION_CONFIRMED = 'confirmed'
export const ACTION_EXTENDED = 'extended'
export const ACTION_AUTOMATICALLY_DELETED_EXPIRED = 'automatically_deleted_expired'
export const ACTION_AUTOMATICALLY_DELETED_NOT_CONFIRMED = 'automatically_deleted_not_confirmed'

const userActionSchema = mongoose.Schema({
  city: {
    type: String,
    lowercase: true,
    required: [true, 'Missing city']
  },
  timeStamp: {
    type: Date,
    required: [true, 'Missing timestamp'],
    default: Date.now
  },
  action: {
    type: String,
    enum: [ACTION_ACTIVELY_DELETED, ACTION_AUTOMATICALLY_DELETED_EXPIRED, ACTION_AUTOMATICALLY_DELETED_NOT_CONFIRMED,
      ACTION_CONFIRMED, ACTION_CREATED, ACTION_EXTENDED, ACTION_GET],
    required: [true, 'Missing action type']
  }
})

export default mongoose.model('UserAction', userActionSchema)
