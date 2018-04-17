// @flow

import OfferService from './OfferService'

export default (): {offerService: OfferService} => {
  const offerService = new OfferService()
  return {offerService}
}
