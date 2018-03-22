import Offer from '../database/Offer'
import hash from '../utils/hash'
import createToken from '../utils/createToken'
import MailService from './MailService'
import forms from '../database/forms'

const MILLISECONDS_IN_A_DAY = 1000 * 60 * 60 * 24

export default class OfferService {
  async createOffer (city, email, formData, duration) {
    const token = createToken()

    const form = new forms[city](formData)
    const offer = new Offer({
      email: email,
      city: city,
      expirationDate: Date.now() + duration * MILLISECONDS_IN_A_DAY,
      hashedToken: hash(token),
      formData: form
    })

    await form.save()
    await offer.save()

    const mailService = new MailService()
    // await mailService.sendCreationMail(offer, token)

    return token
  }

  getAllOffersQuery () {
    return Offer.find().populate('formData')
  }

  getActiveOffersQuery (city) {
    return Offer.find()
      .where('city').equals(city)
      .where('expirationDate').gt(Date.now())
      .populate('formData')
  }

  getOfferByTokenQuery (token) {
    return Offer.find()
      .where('hashedToken').equals(hash(token))
      .populate('formData')
  }

  async confirmOffer (offer, token) {
    if (offer.confirmed === true) {
      return
    }
    const mailService = new MailService()
    // await mailService.sendConfirmationMail(offer, token)

    offer.confirmed = true
    await offer.save()
  }

  async extendOffer (offer, duration, token) {
    offer.expirationDate = Date.now() + duration * MILLISECONDS_IN_A_DAY
    const mailService = new MailService()
    // await mailService.sendExtensionMail(offer, token)
    await offer.save()
  }

  async deleteOffer (offer) {
    if (offer.deleted) {
      return
    }
    const mailService = new MailService()
    // await mailService.sendDeletionMail(offer)
    offer.deleted = true
    await offer.save()
  }
}
