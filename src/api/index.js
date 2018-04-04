// @flow

import {Router} from 'express'
import offers from './offers'

export default ({offerService}) => {
  const api = Router()

  api.param('city', (request, result, next, id) => {
    request.city = id
    next()
  })
  api.use('/v0/:city([-a-z]+)', offers({offerService}))

  return api
}
