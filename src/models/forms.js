// @flow

import neuburgForm from './forms/neuburgForm'
import mongoose from 'mongoose'

const Neuburg = mongoose.model('neuburg', mongoose.Schema(neuburgForm))

export default {
  'neuburg': Neuburg
}
