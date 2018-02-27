import Offer from '../models/Offer'
import fs from 'fs'
import hash from '../utils/hash'

export const OfferResponse = {
  CONFIRMED: 'confirmed',
  NOT_FOUND: 'notFound',
  INVALID: 'inactive'
}

export default class OfferService {
  constructor (fileName) {
    this.fileName = fileName
    this.offers = this.read()
  }

  createOffer (city, email, formData, duration) {
    const id = this.offers.length > 0 ? this.offers[this.offers.length - 1].id + 1 : 0
    const offer = new Offer({id, city, email, formData, expirationDate: Date.now() + duration})
    this.offers.push(offer)
    this.save()
    return id
  }

  getActiveOffers (city) {
    return this.offers.filter(offer => offer.city === city && offer.isActive())
  }

  confirmOffer (token) {
    const hashedToken = hash(token)
    const offer = this.offers.find(offer => offer.hashedToken === hashedToken)
    if (!offer) {
      return OfferResponse.NOT_FOUND
    } else if (!offer.isExpired() && !offer.deleted) {
      return OfferResponse.INVALID
    } else {
      offer.confirmed = true
      this.save()
      return OfferResponse.CONFIRMED
    }
  }

  delete (token) {
    const hashedToken = hash(token)
    const offer = this.offers.find(offer => offer.hashedToken === hashedToken)
    if (!offer) {
      return OfferResponse.NOT_FOUND
    } else if (!offer.isActive()) {
      offer.deleted = true
      this.save()
      return OfferResponse.INVALID
    } else {
      offer.deleted = true
      this.save()
      return OfferResponse.CONFIRMED
    }
  }

  save () {
    fs.writeFileSync(this.fileName, JSON.stringify(this.offers))
  }

  read () {
    if (fs.existsSync(this.fileName)) {
      return JSON.parse(fs.readFileSync(this.fileName))
        .map(json => new Offer(json))
    } else {
      return []
    }
  }
}
