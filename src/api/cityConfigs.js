// @flow

import type {$Request, $Response} from 'express'
import express, {Router} from 'express'
import path from 'path'
import HttpStatus from 'http-status-codes'
import CityConfigService from '../services/CityConfigService'

export default ({cityConfigService}: { cityConfigService: CityConfigService }): Router => {
  const router = new Router()

  router.get('/', (request: $Request, response: $Response) => {
    const cityConfigs = cityConfigService.getFilledCityConfigs()
    response.status(HttpStatus.OK).json(cityConfigs)
  })

  router.use('/image', express.static(path.join(__dirname, '../cities/assets')))

  return router
}
