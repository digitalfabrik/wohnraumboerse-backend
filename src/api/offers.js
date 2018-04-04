// @flow

import {Router} from 'express'
import {body, param, validationResult} from 'express-validator/check'
import {matchedData} from 'express-validator/filter'
import {TOKEN_LENGTH} from '../utils/createToken'
import HttpStatus from 'http-status-codes'
import Offer from '../models/Offer'
import OfferService from '../services/OfferService'

const validateMiddleware = (request, response, next) => {
  const errors = validationResult(request)
  if (!errors.isEmpty()) {
    return response.status(HttpStatus.UNPROCESSABLE_ENTITY).json({errors: errors.mapped()})
  } else {
    next()
  }
}

export default ({offerService} : {offerService: OfferService}) => {
  const router = new Router()

  router.get('/getAll', async (request, response) => {
    try {
      const queryResult = await offerService.getAllOffers()
      return response.json(queryResult)
    } catch (e) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e)
    }
  })

  router.get('/', async (request, response) => {
    try {
      const queryResult = await offerService.getActiveOffers(request.city)
      return response.json(queryResult)
    } catch (e) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e)
    }
  })

  router.put('/', [
    body('email').isEmail().trim().normalizeEmail(),
    body('duration').isInt().toInt().custom(value => [3, 7, 14, 30].includes(value)),
    body('formData').exists(),
    validateMiddleware,
    async (request, response) => {
      const {email, formData, duration} = matchedData(request)
      try {
        const token = await offerService.createOffer(request.city, email, formData, duration)
        return response.status(HttpStatus.CREATED).json(token)
      } catch (e) {
        console.error(e)
        return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e)
      }
    }
  ])

  router.post(`/:token/confirm`, [
    param('token').isHexadecimal().isLength(TOKEN_LENGTH),
    validateMiddleware,
    async (request, response) => {
      try {
        const {token} = matchedData(request)
        const offer = await offerService.getOfferByToken(token)

        if (!offer) {
          return response.status(HttpStatus.NOT_FOUND).json('No such offer')
        } else if (offer.isExpired() || offer.deleted) {
          return response.status(HttpStatus.GONE).json('Offer not available')
        }

        await offerService.confirmOffer(offer, token)
        return response.status(HttpStatus.OK).end()
      } catch (e) {
        console.error(e)
        return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e)
      }
    }
  ])

  router.post(`/:token/extend`, [
    param('token').isHexadecimal().isLength(TOKEN_LENGTH),
    body('duration').isInt().toInt().custom(value => [3, 7, 14, 30].includes(value)),
    validateMiddleware,
    async (request, response) => {
      try {
        const {token, duration} = matchedData(request)
        const offer = await offerService.getOfferByToken(token)

        if (!offer) {
          return response.status(HttpStatus.NOT_FOUND).json('No such offer')
        } else if (offer.deleted || !offer.confirmed) {
          return response.status(HttpStatus.BAD_REQUEST).json('Offer not available')
        }

        await offerService.extendOffer(offer, duration, token)
        return response.status(HttpStatus.OK).end()
      } catch (e) {
        console.error(e)
        return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e)
      }
    }
  ])

  router.delete(`/:token`, [
    param('token').isHexadecimal().isLength(TOKEN_LENGTH),
    validateMiddleware,
    async (request, response) => {
      try {
        const {token} = matchedData(request)
        const offer = await offerService.getOfferByToken(token)

        if (!offer) {
          return response.status(HttpStatus.NOT_FOUND).json('No such offer')
        } else if (offer.deleted) {
          return response.status(HttpStatus.BAD_requestUEST).json('Already deleted')
        }

        await offerService.deleteOffer(offer)
        return response.status(HttpStatus.OK).end()
      } catch (e) {
        console.error(e)
        response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e)
      }
    }
  ])

  return router
}
