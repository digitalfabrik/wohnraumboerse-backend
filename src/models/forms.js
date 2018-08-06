// @flow

import neuburgForm from './forms/neuburgForm'
import testumgebungForm from './forms/testumgebungForm'
import mongoose from 'mongoose'
import cityConfigs from '../cities/cityConfigs'
import {difference, get, pull, set} from 'lodash'
import Offer from './Offer'

type AllFormsType = | typeof neuburgForm

const schemaOptions = {strict: 'throw'}

const Neuburg = mongoose.model(
  cityConfigs.neuburgschrobenhausenwohnraum.cmsName, mongoose.Schema(neuburgForm, schemaOptions)
)

const Testumgebung = mongoose.model(
  cityConfigs.testumgebungwohnraum.cmsName, mongoose.Schema(testumgebungForm, schemaOptions)
)

const addNotIncludedFor = (offer: Offer, form: AllFormsType, names: Array<string>, omit: Array<string>) => {
  names.forEach((path: string) => {
    const arrayConfig = get(form, path)
    if (!arrayConfig || !arrayConfig.enum) {
      throw Error(`The supplied form has not the right shape for path '${path}'!`)
    }

    const arrayEnum = Array.isArray(arrayConfig.enum) ? arrayConfig.enum : arrayConfig.enum.values
    if (!arrayEnum || !Array.isArray(arrayEnum)) {
      throw Error('Could not find enum in form model!')
    }

    const offerArray = get(offer.formData, path)
    if (!Array.isArray(offerArray)) {
      throw Error(`The supplied offer has no array at path '${path}'!`)
    }
    const diff = difference(arrayEnum, offerArray)
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
  },
  [cityConfigs.testumgebungwohnraum.cmsName]: {
    FormModel: Testumgebung,
    setAdditionalFields: (offer: Offer): Offer => {
      return addNotIncludedFor(offer, neuburgForm,
        ['costs.ofRunningServices', 'accommodation.ofRooms', 'costs.ofAdditionalServices'], ['other'])
    }
  }
}
