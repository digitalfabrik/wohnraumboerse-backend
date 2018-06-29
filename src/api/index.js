// @flow

import {Router} from 'express'
import type {$Request, $Response, NextFunction} from 'express'
import offers from './offers'
import OfferService from '../services/OfferService'
import ErrorService from '../services/ErrorService'

export default ({offerService, errorService}: {offerService: OfferService, errorService: ErrorService}): Router => {
  const api = Router()

  api.param('city', (request: $Request, response: $Response, next: NextFunction, id: string) => {
    request.city = id
    next()
  })
  api.use('/v0/:city([-a-z]+)/offer', offers({offerService, errorService}))

  return api
}
