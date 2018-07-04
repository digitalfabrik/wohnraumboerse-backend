// @flow

import neuburgForm from './forms/neuburgForm'
import mongoose from 'mongoose'
import cityConfigs from '../cities/cityConfigs'
import {difference, get, pull, set} from 'lodash'
import Offer from './Offer'

type AllFormsType = | typeof neuburgForm

const schemaOptions = {strict: 'throw'}

const Neuburg = mongoose.model(
  cityConfigs.neuburgschrobenhausenwohnraum.cmsName, mongoose.Schema(neuburgForm, schemaOptions)
)

const addNotIncludedFor = (offer: Offer, form: AllFormsType, names: Array<string>, omit: Array<string>) => {
  names.forEach((path: string) => {
    const arrayConfig = get(form, path)
    if (!arrayConfig || !Array.isArray(arrayConfig.enum)) {
      throw Error(`The supplied form has not the right shape for path '${path}'!`)
    }
    const offerArray = get(offer.formData, path)
    if (!Array.isArray(offerArray)) {
      throw Error(`The supplied offer has no array at path '${path}'!`)
    }
    const diff = difference(arrayConfig.enum, offerArray)
    pull(diff, ...omit)
    set(offer.formData, `${path}Diff`, diff)
  })
}

export default {
  [cityConfigs.neuburgschrobenhausenwohnraum.cmsName]: {
    FormModel: Neuburg,
    setAdditionalFields: (offer: Offer): Offer => {
      return addNotIncludedFor(offer, neuburgForm,
        ['costs.ofRunningServices', 'accommodation.ofRooms', 'costs.ofAdditionalServices'], ['other'])
    }
  }
}
