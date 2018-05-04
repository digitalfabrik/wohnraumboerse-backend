// @flow

import neuburgForm from './forms/neuburgForm'
import mongoose from 'mongoose'

const schemaOptions = {strict: 'throw'}

const Neuburg = mongoose.model('neuburg', mongoose.Schema(neuburgForm, schemaOptions))

export default {
  'neuburg': Neuburg
}
