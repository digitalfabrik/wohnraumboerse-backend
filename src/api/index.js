// @flow

import {Router} from 'express'
import offers from './offers'
import OfferService from '../services/OfferService'

export default ({offerService} : {offerService: OfferService}) => {
  const api = Router()

  api.param('city', (request, result, next, id) => {
    request.city = id
    next()
  })
  api.use('/v0/:city([-a-z]+)', offers({offerService}))

  return api
}
