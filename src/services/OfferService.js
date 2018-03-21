import Offer from '../database/Offer'
import fs from 'fs'
import hash from '../utils/hash'
import createToken from '../utils/createToken'
import MailService from './MailService'
import forms from '../database/forms'

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

    const form = new forms[city](formData)
    const offer = new Offer({
      id: id,
      email: email,
      city: city,
      formData: form,
      expirationDate: Date.now() + duration * MILLISECONDS_IN_A_DAY,
      confirmed: false,
      deleted: false,
      createdDate: Date.now(),
      hashedToken: hash(token)
    })

    form.save((err, testOffer) => {
      if (err) {
        return console.log(err.toString())
      }
      console.log('Saved')
    })
    forms[city].find((err, data) => {
      if (err) {
        return console.log(err.toString())
      }
      console.log(data)
    })

    const mailService = new MailService()
    // await mailService.sendCreationMail(offer, token)

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
    await mailService.sendConfirmationMail(offer, token)

    offer.confirmed = true
    this.save()
  }

  async extendOffer (offer, duration, token) {
    offer.expirationDate = Date.now() + duration * MILLISECONDS_IN_A_DAY
    const mailService = new MailService()
    await mailService.sendExtensionMail(offer, token)
    this.save()
  }

  async deleteOffer (offer) {
    if (offer.deleted) {
      return
    }
    const mailService = new MailService()
    await mailService.sendDeletionMail(offer)
    offer.deleted = true
    this.save()
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
