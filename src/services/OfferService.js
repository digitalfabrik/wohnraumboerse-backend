// @flow

import Offer from '../models/Offer'
import hash from '../utils/hash'
import createToken from '../utils/createToken'
import MailService from './MailService'
import forms from '../models/forms'

const MILLISECONDS_IN_A_DAY = 1000 * 60 * 60 * 24

export default class OfferService {
  async createOffer (city: string, email: string, formData: mixed, duration: number): Promise<string> {
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

  getAllOffers (): Promise<void> {
    return Offer.find()
      .select('-_id -__v')
      .populate({path: 'formData', select: '-_id -__v'})
      .exec()
  }

  getActiveOffers (city: string): Promise<void> {
    return Offer.find()
      .select('-_id -__v')
      .where('city').equals(city)
      .where('expirationDate').gt(Date.now())
      .where('deleted').equals(false)
      .populate({path: 'formData', select: '-_id -__v'})
      .exec()
  }

  async getOfferByToken (token: string): Offer {
    // Don't populate, otherwise an 'Offer' Object cannot be properly created
    const offerResult = await Offer.findOne()
      .where('hashedToken').equals(hash(token))
      .exec()
    return new Offer(offerResult)
  }

  async confirmOffer (offer: Offer, token: string): Promise<void> {
    if (!offer.confirmed) {
      const mailService = new MailService()
      await mailService.sendConfirmationMail(offer, token)
      await Offer.findByIdAndUpdate(offer._id, {confirmed: true}).exec()
    }
  }

  async extendOffer (offer: Offer, duration: number, token: string): Promise<void> {
    const newExpirationDate = new Date(Date.now() + duration * MILLISECONDS_IN_A_DAY).toISOString()
    const mailService = new MailService()
    await mailService.sendExtensionMail(offer, token)
    await Offer.findByIdAndUpdate(offer._id, {expirationDate: newExpirationDate}).exec()
  }

  async deleteOffer (offer: Offer): Promise<void> {
    if (!offer.deleted) {
      const mailService = new MailService()
      await mailService.sendDeletionMail(offer)
      await Offer.findByIdAndUpdate(offer._id, {deleted: true}).exec()
    }
  }
}
