// @flow

import OfferService from './OfferService'
import {Config} from '../Config'
import ErrorService from './ErrorService'
import CityConfigService from './CityConfigService'

export type AllServicesType = {
  offerService: OfferService,
  errorService: ErrorService,
  cityConfigService: CityConfigService
}

export default (config: Config): AllServicesType => {
  const offerService = new OfferService(config)
  const errorService = new ErrorService()
  const cityConfigService = new CityConfigService(config)
  return {offerService, errorService, cityConfigService}
}
