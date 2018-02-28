import {Router} from 'express'
import {OfferResponse} from '../services/OfferService'
import {sendDeletionMail, sendExtensionMail} from '../services/MailService'
import {body, param, validationResult} from 'express-validator/check'
import {matchedData} from 'express-validator/filter'
import {TOKEN_LENGTH} from '../utils/createToken'
import HttpStatus from 'http-status-codes'

const validateMiddleware = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({errors: errors.mapped()})
  } else {
    next()
  }
}

export default ({offerService}) => {
  const router = new Router()

  router.get('/getAll', (req, res) => {
    res.json(offerService.getAllOffers())
  })

  router.get('/', (req, res) => {
    res.json(offerService
      .getActiveOffers(req.city)
      .map(offer => offer.formData))
  })

  router.put('/', [
    body('email').isEmail().trim().normalizeEmail(),
    body('duration').isInt().toInt().custom(value => [3, 7, 14, 30].includes(value)),
    validateMiddleware,
    async (req, res) => {
      const {email, formData, duration} = matchedData(req)

      try {
        const token = await offerService.createOffer(req.city, email, formData, duration)
        return res.status(HttpStatus.CREATED).json(token)
      } catch (e) {
        console.error(e)
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e)
      }
    }
  ])

  router.post(`/:token/confirm`, [
    param('token').isHexadecimal().isLength(TOKEN_LENGTH),
    validateMiddleware,
    async (req, res) => {
      const {token} = matchedData(req)
      const offer = offerService.findOfferByToken(token)

      if (!offer) {
        return res.status(HttpStatus.NOT_FOUND).json('No such offer')
      } else if (offer.isExpired() || offer.deleted) {
        return res.status(HttpStatus.GONE).json('Offer not available')
      }

      try {
        await offerService.confirmOffer(offer, token)
        return res.status(HttpStatus.OK)
      } catch (e) {
        console.error(e)
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e)
      }
    }
  ])

  router.post(`/:token/extend`, (req, res) => {
    const {duration} = req.body

    const {response, offer} = offerService.extendOffer(req.params.token, Number(duration))
    switch (response) {
      case OfferResponse.OK:
        sendExtensionMail({res: res, email: offer.email, expirationDate: offer.expirationDate})
        break
      case OfferResponse.INVALID:
        res.status(HttpStatus.BAD_REQUEST)
        res.send('Offer not available')
        break
      case OfferResponse.NOT_FOUND:
        res.status(HttpStatus.NOT_FOUND)
        res.send('No such offer')
        break
      default:
        res.status(HttpStatus.INTERNAL_SERVER_ERROR)
        res.end()
    }
  })

  router.delete(`:token`, (req, res) => {
    const {response, offer} = offerService.delete(req.params.token)
    switch (response) {
      case OfferResponse.OK:
        sendDeletionMail({res: res, email: offer.email})
        break
      case OfferResponse.INVALID:
        res.status(HttpStatus.BAD_REQUEST)
        res.send('Offer not available')
        break
      case OfferResponse.NOT_FOUND:
        res.status(HttpStatus.NOT_FOUND)
        res.send('No such offer')
        break
      default:
        res.status(HttpStatus.INTERNAL_SERVER_ERROR)
        res.end()
    }
  })

  return router
}
