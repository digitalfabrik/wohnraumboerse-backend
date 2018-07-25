// @flow

import OfferService from './OfferService'
import { Config } from '../Config'
import ErrorService from './ErrorService'

export default (config: Config): {offerService: OfferService, errorService: ErrorService} => {
  const offerService = new OfferService(config)
  const errorService = new ErrorService()
  return {offerService, errorService}
}
