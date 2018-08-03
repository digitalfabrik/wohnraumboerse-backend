// @flow

import Offer from '../models/Offer'
import hash from '../utils/hash'
import type {Config} from '../Config'
import createToken from '../utils/createToken'
import MailService from './MailService'
import forms from '../models/forms'
import UserAction, {
  ACTION_ACTIVELY_DELETED,
  ACTION_CONFIRMED,
  ACTION_CREATED,
  ACTION_EXTENDED,
  ACTION_GET
} from '../models/UserAction'

const MS_IN_S = 1000
const S_IN_MIN = 60
const MIN_IN_H = 60
const H_IN_D = 60
const MILLISECONDS_IN_A_DAY = MS_IN_S * S_IN_MIN * MIN_IN_H * H_IN_D

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

    new UserAction({city, action: ACTION_CREATED}).save()

    return token
  }

  getAllOffers (): Promise<Array<Offer>> {
    return Offer.find()
      .populate({path: 'formData', select: '-_id -__v'})
      .lean()
      .exec()
  }

  getAllForms (city: string): Promise<Array<any>> {
    const {FormModel} = forms[city]
    return FormModel.find()
      .lean()
      .exec()
  }

  getActiveOffers (city: string): Promise<Array<Offer>> {
    const offers = Offer.find()
      .select('-_id -__v -city -confirmed -expirationDate -hashedToken')
      .where('city')
      .equals(city)
      .where('expirationDate')
      .gt(Date.now())
      .where('confirmed')
      .equals(true)
      .populate({path: 'formData', select: '-_id -__v'})
      .lean()
      .exec()

    new UserAction({city, action: ACTION_GET}).save()

    return offers
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

      new UserAction({city: offer.city, action: ACTION_CONFIRMED}).save()
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

    new UserAction({city: offer.city, action: ACTION_EXTENDED}).save()
  }

  async deleteOffer (offer: Offer, token: string, city: string): Promise<void> {
    const {FormModel} = forms[city]
    await FormModel.findByIdAndDelete(offer.formData._id).exec()
    await Offer.findOneAndDelete()
      .where('hashedToken')
      .equals(hash(token))
      .exec()
    const mailService = new MailService(this.config.smtp)
    await mailService.sendDeletionMail(offer)
    new UserAction({city, action: ACTION_ACTIVELY_DELETED}).save()
  }
}
