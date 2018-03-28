import {Router} from 'express'
import {body, param, validationResult} from 'express-validator/check'
import {matchedData} from 'express-validator/filter'
import {TOKEN_LENGTH} from '../utils/createToken'
import HttpStatus from 'http-status-codes'
import Offer from '../models/Offer'

const validateMiddleware = (request, res, next) => {
  const errors = validationResult(request)
  if (!errors.isEmpty()) {
    return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({errors: errors.mapped()})
  } else {
    next()
  }
}

export default ({offerService}) => {
  const router = new Router()

  router.get('/getAll', async (request, result) => {
    try {
      const queryResult = await offerService.getAllOffers()
      return result.json(queryResult)
    } catch (e) {
      return result.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e)
    }
  })

  router.get('/', async (request, result) => {
    try {
      const queryResult = await offerService.getActiveOffers(request.city)
      return result.json(queryResult)
    } catch (e) {
      return result.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e)
    }
  })

  router.put('/', [
    body('email').isEmail().trim().normalizeEmail(),
    body('duration').isInt().toInt().custom(value => [3, 7, 14, 30].includes(value)),
    body('formData').exists(),
    validateMiddleware,
    async (request, result) => {
      const {email, formData, duration} = matchedData(request)
      try {
        const token = await offerService.createOffer(request.city, email, formData, duration)
        return result.status(HttpStatus.CREATED).json(token)
      } catch (e) {
        console.error(e)
        return result.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e)
      }
    }
  ])

  router.post(`/:token/confirm`, [
    param('token').isHexadecimal().isLength(TOKEN_LENGTH),
    validateMiddleware,
    async (request, result) => {
      try {
        const {token} = matchedData(request)
        const offer = new Offer(await offerService.getOfferByToken(token))

        if (!offer) {
          return result.status(HttpStatus.NOT_FOUND).json('No such offer')
        } else if (offer.isExpired() || offer.deleted) {
          return result.status(HttpStatus.GONE).json('Offer not available')
        }

        await offerService.confirmOffer(offer, token)
        return result.status(HttpStatus.OK).end()
      } catch (e) {
        console.error(e)
        return result.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e)
      }
    }
  ])

  router.post(`/:token/extend`, [
    param('token').isHexadecimal().isLength(TOKEN_LENGTH),
    body('duration').isInt().toInt().custom(value => [3, 7, 14, 30].includes(value)),
    validateMiddleware,
    async (request, result) => {
      try {
        const {token, duration} = matchedData(request)
        const offer = new Offer(await offerService.getOfferByToken(token))

        if (!offer) {
          return result.status(HttpStatus.NOT_FOUND).json('No such offer')
        } else if (offer.deleted || !offer.confirmed) {
          return result.status(HttpStatus.BAD_REQUEST).json('Offer not available')
        }

        await offerService.extendOffer(offer, duration, token)
        return result.status(HttpStatus.OK).end()
      } catch (e) {
        console.error(e)
        return result.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e)
      }
    }
  ])

  router.delete(`/:token`, [
    param('token').isHexadecimal().isLength(TOKEN_LENGTH),
    validateMiddleware,
    async (request, result) => {
      try {
        const {token} = matchedData(request)
        const offer = new Offer(await offerService.getOfferByToken(token))

        if (!offer) {
          return result.status(HttpStatus.NOT_FOUND).json('No such offer')
        } else if (offer.deleted) {
          return result.status(HttpStatus.BAD_requestUEST).json('Already deleted')
        }

        await offerService.deleteOffer(offer)
        return result.status(HttpStatus.OK).end()
      } catch (e) {
        console.error(e)
        result.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e)
      }
    }
  ])

  return router
}
