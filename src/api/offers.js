// @flow

import {Router} from 'express'
import type {$Request, $Response, NextFunction} from 'express'
import {body, param, validationResult} from 'express-validator/check'
import {matchedData} from 'express-validator/filter'
import {TOKEN_LENGTH} from '../utils/createToken'
import HttpStatus from 'http-status-codes'
import OfferService from '../services/OfferService'
import Offer from '../models/Offer'
import ErrorService from '../services/ErrorService'

const develop = process.env.NODE_ENV === 'development'
const THREE_DAYS = 3
const ONE_WEEK = 7
const TWO_WEEKS = 14
const ONE_MONTH = 30
const ALLOWED_DURATIONS = [THREE_DAYS, ONE_WEEK, TWO_WEEKS, ONE_MONTH]

const validateMiddleware = (errorService: ErrorService): mixed => (request: $Request, response: $Response, next: NextFunction) => {
  const errors = validationResult(request)
  if (!errors.isEmpty()) {
    const errorResponse = errorService.createValidationFailedErrorResponseFromArray(errors)
    response.status(HttpStatus.BAD_REQUEST).json(errorResponse)
  } else {
    next()
  }
}

const catchInternalErrors = (fn: mixed, errorService: ErrorService): mixed => (request: $Request, response: $Response, next: NextFunction) => {
  const promise = fn(request, response, next)
  if (promise.catch) {
    promise.catch((e: Error) => {
      let errorResponse
      if (e.name && e.name === 'ValidationError') {
        errorResponse = errorService.createValidationFailedErrorResponse(e)
        response.status(HttpStatus.BAD_REQUEST).json(errorResponse)
      } else {
        errorResponse = errorService.createInternalServerErrorResponse(e)
        response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(errorResponse)
      }
    })
  }
}

export default ({offerService, errorService}: { offerService: OfferService, errorService: ErrorService }): Router => {
  const router = new Router()

  if (develop) {
    router.get('/getAll', catchInternalErrors(async (request: $Request, response: $Response): Promise<void> => {
      const queryResult = await offerService.getAllOffers()
      response.json(queryResult)
    }, errorService))

    router.get('/getAllForms', catchInternalErrors(async (request: $Request, response: $Response): Promise<void> => {
      const queryResult = await offerService.getAllForms(request.city)
      response.json(queryResult)
    }, errorService))
  }
  router.get('/', catchInternalErrors(async (request: $Request, response: $Response): Promise<void> => {
    const offers = await offerService.getActiveOffers(request.city)
    offers.forEach((offer: Offer): Offer => offerService.fillAdditionalFieds(offer, request.city))
    response.json(offers)
  }, errorService))

  router.put('/',
    body('email').isEmail().trim().normalizeEmail(),
    body('duration').isInt().toInt().custom((value: number): boolean => ALLOWED_DURATIONS.includes(value)),
    body('formData').exists(),
    body('agreedToDataProtection').isBoolean().toBoolean().custom((value: boolean): boolean => value),
    validateMiddleware(errorService),
    catchInternalErrors(async (request: $Request, response: $Response): Promise<void> => {
      const {email, formData, duration} = matchedData(request)
      const token = await offerService.createOffer(request.city, email, formData, duration)
      if (develop) {
        response.status(HttpStatus.CREATED).json(token)
      } else {
        response.status(HttpStatus.CREATED).end()
      }
    }, errorService)
  )

  router.post(`/:token/confirm`,
    param('token').isHexadecimal().isLength(TOKEN_LENGTH),
    validateMiddleware(errorService),
    catchInternalErrors(async (request: $Request, response: $Response): Promise<void> => {
      const {token} = matchedData(request)
      const offer = await offerService.getOfferByToken(token)

      if (!offer) {
        const errorResponse = errorService.createOfferNotFoundErrorResponse(token)
        response.status(HttpStatus.NOT_FOUND).json(errorResponse)
      } else if (offer.expirationDate <= Date.now()) {
        const errorResponse = errorService.createOfferExpiredErrorResponse(token)
        response.status(HttpStatus.GONE).json(errorResponse)
      } else {
        await offerService.confirmOffer(offer, token)
        response.status(HttpStatus.OK).end()
      }
    }, errorService)
  )

  router.post(`/:token/extend`,
    param('token').isHexadecimal().isLength(TOKEN_LENGTH),
    body('duration').isInt().toInt().custom((value: number): boolean => ALLOWED_DURATIONS.includes(value)),
    validateMiddleware(errorService),
    catchInternalErrors(async (request: $Request, response: $Response): Promise<void> => {
      const {token, duration} = matchedData(request)
      const offer = await offerService.getOfferByToken(token)

      if (!offer) {
        const errorResponse = errorService.createOfferNotFoundErrorResponse(token)
        response.status(HttpStatus.NOT_FOUND).json(errorResponse)
      } else if (!offer.confirmed) {
        const errorResponse = errorService.createOfferNotConfirmedErrorResponse()
        response.status(HttpStatus.BAD_REQUEST).json(errorResponse)
      } else {
        await offerService.extendOffer(offer, duration, token)
        response.status(HttpStatus.OK).end()
      }
    }, errorService)
  )

  router.delete(`/:token`,
    param('token').isHexadecimal().isLength(TOKEN_LENGTH),
    validateMiddleware(errorService),
    catchInternalErrors(async (request: $Request, response: $Response): Promise<void> => {
      const {token} = matchedData(request)
      const offer = await offerService.getOfferByToken(token)

      if (!offer) {
        const errorResponse = errorService.createOfferNotFoundErrorResponse(token)
        response.status(HttpStatus.NOT_FOUND).json(errorResponse)
      } else {
        await offerService.deleteOffer(offer, token, request.city)
        response.status(HttpStatus.OK).end()
      }
    }, errorService)
  )

  return router
}
