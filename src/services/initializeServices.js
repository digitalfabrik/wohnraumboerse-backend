// @flow

import OfferService from './OfferService'
import { Config } from '../Config'

export default (config: Config): {offerService: OfferService} => {
  const offerService = new OfferService(config)
  return {offerService}
}
