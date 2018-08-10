// @flow

import type {$Request, $Response, NextFunction} from 'express'
import {Router} from 'express'
import offers from './offers'
import cityConfigs from './cityConfigs'
import type {AllServicesType} from '../services/initializeServices'

export default ({offerService, errorService, cityConfigService}: AllServicesType): Router => {
  const api = Router()

  api.param('city', (request: $Request, response: $Response, next: NextFunction, id: string) => {
    request.city = id
    next()
  })
  api.use('/v0/:city([-a-z]+)/offer', offers({offerService, errorService}))
  api.use('/v0/city-configs', cityConfigs({cityConfigService}))

  return api
}
