// @flow

import type {$Request, $Response} from 'express'
import {Router} from 'express'
import HttpStatus from 'http-status-codes'
import cityConfigs from '../cities/cityConfigs'

export default (): Router => {
  const router = new Router()

  router.get('/', (request: $Request, response: $Response) => {
    response.status(HttpStatus.OK).json(cityConfigs)
  })

  return router
}