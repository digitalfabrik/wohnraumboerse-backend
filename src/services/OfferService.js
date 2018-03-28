import Offer from '../models/Offer'
import hash from '../utils/hash'
import createToken from '../utils/createToken'
import MailService from './MailService'
import forms from '../models/forms'

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
    await mailService.sendCreationMail(offer, token)

    return token
  }

  getAllOffers () {
    return Offer.find()
      .select('-_id -__v')
      .populate({path: 'formData', select: '-_id -__v'})
      .exec()
  }

  getActiveOffers (city) {
    return Offer.find()
      .select('-_id -__v')
      .where('city').equals(city)
      .where('expirationDate').gt(Date.now())
      .where('deleted').equals(false)
      .populate({path: 'formData', select: '-_id -__v'})
      .exec()
  }

  async getOfferByToken (token) {
    // Don't populate, otherwise an 'Offer' Object cannot be properly created
    const offerResult = await Offer.findOne()
      .where('hashedToken').equals(hash(token))
      .exec()
    return new Offer(offerResult)
  }

  async confirmOffer (offer, token) {
    if (offer.confirmed === true) {
      return
    }
    const mailService = new MailService()
    await mailService.sendConfirmationMail(offer, token)
    await Offer.findByIdAndUpdate(offer._id, {confirmed: true}).exec()
  }

  async extendOffer (offer, duration, token) {
    const newExpirationDate = new Date(Date.now() + duration * MILLISECONDS_IN_A_DAY).toISOString()
    const mailService = new MailService()
    await mailService.sendExtensionMail(offer, token)
    await Offer.findByIdAndUpdate(offer._id, {expirationDate: newExpirationDate}).exec()
  }

  async deleteOffer (offer) {
    if (offer.deleted) {
      return
    }
    const mailService = new MailService()
    await mailService.sendDeletionMail(offer)
    await Offer.findByIdAndUpdate(offer._id, {deleted: true}).exec()
  }
}
