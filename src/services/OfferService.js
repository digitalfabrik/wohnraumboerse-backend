import Offer from '../models/Offer'
import fs from 'fs'
import hash from '../utils/hash'
import createToken from '../utils/createToken'

export const OfferResponse = {
  OK: 'ok',
  ALREADY_CONFIRMED: 'alreadyConfirmed',
  NOT_FOUND: 'notFound',
  INVALID: 'invalid'
}

export default class OfferService {
  constructor (fileName) {
    this.fileName = fileName
    this.offers = this.read()
  }

  createOffer (city, email, formData, duration) {
    const id = this.offers.length > 0 ? this.offers[this.offers.length - 1].id + 1 : 0
    const token = createToken()
    const offer = new Offer({
      id,
      email,
      city,
      formData,
      expirationDate: new Date() + duration,
      confirmed: false,
      deleted: false,
      createdDate: new Date(),
      hashedToken: hash(token)
    })
    this.offers.push(offer)
    this.save()
    return token
  }

  getAllOffers () {
    return this.offers
  }

  getActiveOffers (city) {
    return this.offers.filter(offer => offer.city === city && offer.isActive())
  }

  confirmOffer (token) {
    const hashedToken = hash(token)
    const offer = this.offers.find(offer => offer.hashedToken === hashedToken)
    if (!offer) {
      return OfferResponse.NOT_FOUND
    } else if (offer.isExpired() || offer.deleted) {
      return OfferResponse.INVALID
    } else if (offer.confirmed === true) {
      return OfferResponse.ALREADY_CONFIRMED
    } else {
      offer.confirmed = true
      this.save()
      return {response: OfferResponse.OK, offer: offer}
    }
  }

  extendOffer (token, duration) {
    const hashedToken = hash(token)
    const offer = this.offers.find(offer => offer.hashedToken === hashedToken)
    if (!offer) {
      return OfferResponse.NOT_FOUND
    } else if (offer.deleted || !offer.confirmed) {
      return OfferResponse.INVALID
    } else {
      offer.expirationDate = Date() + duration
      this.save()
      return {response: OfferResponse.OK, offer: offer}
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
      return {response: OfferResponse.OK, offer: offer}
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
