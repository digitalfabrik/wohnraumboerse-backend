// @flow

import {CronJob} from 'cron'
import Offer from '../models/Offer'

const TIMEZONE = 'Europe/Berlin'

const deleteExpired = async () => {
  const twoYearsAgo = Date.now()
  twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2)

  await Offer.delete()
    .where('createdDate')
    .lte(twoYearsAgo)
    .exec()
}

const deleteNotConfirmed = async () => {

}

export default () => {
  const deleteExpiredJob = CronJob('00 00 00 * * *', deleteExpired, null, true, TIMEZONE)

  const deleteNotConfirmedJob = CronJob('00 00 00 * * *', deleteNotConfirmed, null, true, TIMEZONE)

  // start jobs
  deleteExpiredJob.start()
  deleteNotConfirmedJob.start()
}
