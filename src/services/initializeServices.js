// @flow

import OfferService from './OfferService'

export default () => {
  const offerService = new OfferService()
  return {offerService}
}
