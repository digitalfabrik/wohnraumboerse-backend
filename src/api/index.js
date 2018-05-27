// @flow

import {Router} from 'express'
import type {$Request, $Response, NextFunction} from 'express'
import offers from './offers'
import OfferService from '../services/OfferService'

export default ({offerService}: {offerService: OfferService}): Router => {
  const api = Router()

  api.param('city', (request: $Request, response: $Response, next: NextFunction, id: string) => {
    request.city = id
    next()
  })
  api.use('/v0/:city([-a-z]+)', offers({offerService}))

  return api
}
