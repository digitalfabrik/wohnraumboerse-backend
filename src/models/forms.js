// @flow

import neuburgForm from './forms/neuburgForm'
import mongoose from 'mongoose'
import cityConfigs from '../cities/cityConfigs'
import _ from 'lodash'
import Offer from './Offer'

const formTypes = null

const schemaOptions = {strict: 'throw'}

const Neuburg = mongoose.model(
  cityConfigs.neuburgschrobenhausenwohnraum.cmsName, mongoose.Schema(neuburgForm, schemaOptions)
)

// TODO: Create Union type instead of any
// eslint-disable-next-line flowtype/no-weak-types
const addNotIncludedFor = (offer: Offer, form: any, names: Array<string>, omit: Array<>) => {
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
