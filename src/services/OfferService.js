import Offer from '../models/Offer'
import fs from 'fs'
import hash from '../utils/hash'
import createToken from '../utils/createToken'
import MailService from './MailService'

export const OfferResponse = {
  OK: 'ok',
  ALREADY_CONFIRMED: 'alreadyConfirmed',
  NOT_FOUND: 'notFound',
  INVALID: 'invalid'
}

const MILLISECONDS_IN_A_DAY = 1000 * 60 * 60 * 24

export default class OfferService {
  constructor (fileName) {
    this.fileName = fileName
    this.offers = this.read()
  }

  createNewId () {
    if (this.offers.length === 0) {
      return 0
    } else {
      return this.offers[this.offers.length - 1].id + 1
    }
  }

  async createOffer (city, email, formData, duration) {
    const id = this.createNewId()
    const token = createToken()
    const offer = new Offer({
      id,
      email,
      city,
      formData,
      expirationDate: Date.now() + duration * MILLISECONDS_IN_A_DAY,
      confirmed: false,
      deleted: false,
      createdDate: Date.now(),
      hashedToken: hash(token)
    })

    const mailService = new MailService()
    await mailService.sendCreationMail(offer, token)

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

  findOfferByToken (token) {
    return this.offers.find(offer => offer.hashedToken === hash(token))
  }

  async confirmOffer (offer, token) {
    if (offer.confirmed === true) {
      return
    }
    const mailService = new MailService()
    await mailService.sendConfirmationMail()

    offer.confirmed = true
    this.save()
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
