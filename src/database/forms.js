import neuburgForm from './forms/neuburgForm'
import mongoose from 'mongoose'

const Neuburg = mongoose.model('Neuburg', mongoose.Schema(neuburgForm))

export default {
  neuburg: Neuburg
}
