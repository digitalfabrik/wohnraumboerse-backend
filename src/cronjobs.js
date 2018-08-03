// @flow

import {CronJob} from 'cron'
import Offer from './models/Offer'
import forms from './models/forms'
import UserAction, {
  ACTION_AUTOMATICALLY_DELETED_EXPIRED,
  ACTION_AUTOMATICALLY_DELETED_NOT_CONFIRMED
} from './models/UserAction'

const TIMEZONE = 'Europe/Berlin'

const deleteOffer = async (offer: Offer) => {
  const {FormModel} = forms[offer.city]
  // Delete the form data
  await FormModel.findByIdAndDelete(offer.formData._id).exec()
  // Delete the offer
  await Offer.findByIdAndDelete(offer._id).exec()
}

const deleteExpired = async () => {
  const twoYearsAgo = new Date()
  twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2)

  const offersToDelete = await Offer.find()
    .where('createdDate')
    .lte(twoYearsAgo)
    .populate({path: 'formData'})
    .exec()

  offersToDelete.forEach(async offer => {
    await deleteOffer(offer)
    new UserAction({city: offer.city, action: ACTION_AUTOMATICALLY_DELETED_EXPIRED}).save()
  })
}

const deleteNotConfirmed = async () => {
  const twoDaysAgo = new Date()
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2)

  const offersToDelete = await Offer.find()
    .where('createdDate')
    .lte(twoDaysAgo)
    .where('confirmed')
    .equals(false)
    .populate({path: 'formData'})
    .exec()

  offersToDelete.forEach(async offer => {
    await deleteOffer(offer)
    new UserAction({city: offer.city, action: ACTION_AUTOMATICALLY_DELETED_NOT_CONFIRMED}).save()
  })
}

export default () => {
  // Execute at 00:00:00 every day
  const deleteExpiredJob = new CronJob({
    cronTime: '00 00 00 * * *',
    onTick: deleteExpired,
    timezone: TIMEZONE,
    runOnInit: true
  })

  const deleteNotConfirmedJob = new CronJob({
    cronTime: '00 00 00 * * *',
    onTick: deleteNotConfirmed,
    timezone: TIMEZONE,
    runOnInit: true
  })

  // start jobs
  deleteExpiredJob.start()
  deleteNotConfirmedJob.start()
}
