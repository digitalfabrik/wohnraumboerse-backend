import Offer from '../models/Offer'

export default class OfferService {
  constructor () {
    this.offers = []
  }

  createOffer (city, email, formData, duration) {
    const offer = new Offer({id: this.offers.length, city, email, formData, expirationDate: Date.now() + duration})
    this.offers.push(offer)
    return this.offers.length - 1
  }

  getOffers (city) {
    return this.offers.filter(offer => offer.city === city)
  }
}
