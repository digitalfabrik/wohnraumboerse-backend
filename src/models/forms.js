// @flow

import neuburgForm from './forms/neuburgForm'
import mongoose from 'mongoose'
import cityConfigs from '../cities/cityConfigs'
import _ from 'lodash'
import Offer from './Offer'

type AllFormsType = | typeof neuburgForm;

const schemaOptions = {strict: 'throw'}

const Neuburg = mongoose.model(
  cityConfigs.neuburgschrobenhausenwohnraum.cmsName, mongoose.Schema(neuburgForm, schemaOptions)
)

const addNotIncludedFor = (offer: Offer, form: AllFormsType, names: Array<string>, omit: Array<string>) => {
  names.forEach((name: string) => {
    const diff = _.difference(_.get(form, name)['enum'], _.get(offer, `formData.${name}`))
    _.pull(diff, ...omit)
    _.set(offer, `formData.${name}Diff`, diff)
  })
}

export default {
  [cityConfigs.neuburgschrobenhausenwohnraum.cmsName]: {
    Schema: Neuburg,
    setAdditionalFields: (offer: Offer): Offer => {
      return addNotIncludedFor(offer, neuburgForm,
        ['costs.ofRunningServices', 'accommodation.ofRooms', 'costs.ofAdditionalServices'], ['other'])
    }
  }
}
