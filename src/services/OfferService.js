import Offer from '../models/Offer'
import fs from 'fs'

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

  getOffers (city) {
    return this.offers.filter(offer => offer.city === city)
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
