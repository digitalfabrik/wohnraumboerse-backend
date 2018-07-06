// @flow

import Offer from '../models/Offer'
import hash from '../utils/hash'
import type {Config} from '../Config'
import createToken from '../utils/createToken'
import MailService from './MailService'
import forms from '../models/forms'

const MILLISECONDS_IN_A_DAY = 1000 * 60 * 60 * 24

export default class OfferService {
  config: Config

  constructor (config: Config) {
    this.config = config
  }

  async createOffer (
    city: string,
    email: string,
    formData: mixed,
    duration: number
  ): Promise<string> {
    const token = createToken()

    const {FormModel} = forms[city]
    const form = new FormModel(formData)

    const offer = new Offer({
      email: email,
      city: city,
      expirationDate: Date.now() + duration * MILLISECONDS_IN_A_DAY,
      hashedToken: hash(token),
      formData: form
    })

    await form.save()
    await offer.save()

    const mailService = new MailService(this.config.smtp)
    await mailService.sendRequestConfirmationMail(offer, token)

    return token
  }

  getAllOffers (): Promise<Array<Offer>> {
    return Offer.find()
      .select('-_id -__v')
      .populate({path: 'formData', select: '-_id -__v'})
      .lean()
      .exec()
  }

  getAllForms (city: string): Promise<Array> {
    const {FormModel} = forms[city]
    return FormModel.find()
      .lean()
      .exec()
  }

  getActiveOffers (city: string): Promise<Array<Offer>> {
    return Offer.find()
      .select('-_id -__v -city -deleted -confirmed -expirationDate -hashedToken')
      .where('city')
      .equals(city)
      .where('expirationDate')
      .gt(Date.now())
      .where('deleted')
      .equals(false)
      .where('confirmed')
      .equals(true)
      .populate({path: 'formData', select: '-_id -__v'})
      .lean()
      .exec()
  }

  fillAdditionalFieds (offer: Offer, city: string): Offer {
    return forms[city].setAdditionalFields ? forms[city].setAdditionalFields(offer) : offer
  }

  async getOfferByToken (token: string): Offer {
    return Offer.findOne()
      .where('hashedToken')
      .equals(hash(token))
      .populate({path: 'formData'})
      .lean()
      .exec()
  }

  async findByIdAndUpdate (id: string, values: {}): Offer {
    await Offer.findByIdAndUpdate(id, values).exec()
    return Offer.findById(id).exec()
  }

  async confirmOffer (offer: Offer, token: string): Promise<void> {
    if (!offer.confirmed) {
      offer = await this.findByIdAndUpdate(offer._id, {confirmed: true})
      const mailService = new MailService(this.config.smtp)
      await mailService.sendConfirmationMail(offer, token)
    }
  }

  async extendOffer (
    offer: Offer,
    duration: number,
    token: string
  ): Promise<void> {
    const newExpirationDate = new Date(
      Date.now() + duration * MILLISECONDS_IN_A_DAY
    ).toISOString()

    offer = await this.findByIdAndUpdate(offer._id, {expirationDate: newExpirationDate})
    const mailService = new MailService(this.config.smtp)
    await mailService.sendExtensionMail(offer, token)
  }

  async deleteOffer (offer: Offer): Promise<void> {
    if (!offer.deleted) {
      offer = await this.findByIdAndUpdate(offer._id, {deleted: true})
      const mailService = new MailService(this.config.smtp)
      await mailService.sendDeletionMail(offer)
    }
  }
}
