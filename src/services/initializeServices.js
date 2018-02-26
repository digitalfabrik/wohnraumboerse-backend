import OfferService from './OfferService'

export default () => {
  const offersFileName = './offers.json'
  const offerService = new OfferService(offersFileName)

  return {offerService}
}
