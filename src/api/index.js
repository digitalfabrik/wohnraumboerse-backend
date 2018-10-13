// @flow

import type {$Request, $Response, NextFunction} from 'express'
import {Router} from 'express'
import offersApi from './offers'
import HttpStatus from 'http-status-codes'
import cityConfigsApi from './cityConfigs'
import cityConfigs from '../cities/cityConfigs'
import type {AllServicesType} from '../services/initializeServices'

export default ({offerService, errorService, cityConfigService}: AllServicesType): Router => {
  const api = Router()

  api.param('city', (request: $Request, response: $Response, next: NextFunction, id: string) => {
    // $FlowFixMe Object.values() only returns an Array<mixed>, see https://github.com/facebook/flow/issues/2221.
    if (!Object.values(cityConfigs).map(cityConfig => cityConfig.cmsName).includes(id)) {
      const errorResponse = errorService.createCityNotFoundErrorResponse(id)
      response.status(HttpStatus.NOT_FOUND).json(errorResponse)
    } else {
      request.city = id
      next()
    }
  })
  api.use('/v0/:city([-a-z]+)/offer', offersApi({offerService, errorService}))
  api.use('/v0/city-configs', cityConfigsApi({cityConfigService}))

  return api
}
