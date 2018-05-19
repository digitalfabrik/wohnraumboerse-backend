// @flow

import neuburgForm from './forms/neuburgForm'
import mongoose from 'mongoose'
import cityConfigs from '../cities/cityConfigs'

const schemaOptions = {strict: 'throw'}

const Neuburg = mongoose.model(
  cityConfigs.neuburgschrobenhausenwohnraum.cmsName, mongoose.Schema(neuburgForm, schemaOptions)
)

export default {
  [cityConfigs.neuburgschrobenhausenwohnraum.cmsName]: Neuburg
}
