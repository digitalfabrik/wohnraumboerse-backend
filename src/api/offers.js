import {Router} from 'express'
import {OfferResponse} from '../services/OfferService'
import {sendDeletionMail, sendExtensionMail} from '../services/MailService'
import {body, param, validationResult} from 'express-validator/check'
import {matchedData} from 'express-validator/filter'
import {TOKEN_LENGTH} from '../utils/createToken'

export const STATUS_OK = 200
export const STATUS_CREATED = 201
export const STATUS_NOT_FOUND = 404
export const STATUS_BAD_REQUEST = 400
export const STATUS_SERVER_ERROR = 500
export const STATUS_UNPROCESSABLE_ENTITY = 422
export const STATUS_GONE = 410

const validateMiddleware = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(STATUS_UNPROCESSABLE_ENTITY).json({errors: errors.mapped()})
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

  router.put('/',
    [
      body('email').isEmail().trim().normalizeEmail(),
      body('duration').isInt().toInt().custom(value => [3, 7, 14, 30].includes(value)),
      validateMiddleware,
      async (req, res) => {
        const {email, formData, duration} = matchedData(req)

        try {
          const token = await offerService.createOffer(req.city, email, formData, duration)
          return res.status(STATUS_CREATED).json(token)
        } catch (e) {
          return res.status(STATUS_SERVER_ERROR).json(e)
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
        return res.status(STATUS_NOT_FOUND).json('No such offer')
      } else if (offer.isExpired() || offer.deleted) {
        return res.status(STATUS_GONE).json('Offer not available')
      }

      try {
        await offerService.confirmOffer(offer, token)
        return res.status(STATUS_OK)
      } catch (e) {
        return res.status(STATUS_SERVER_ERROR).json(e)
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
        res.status(STATUS_BAD_REQUEST)
        res.send('Offer not available')
        break
      case OfferResponse.NOT_FOUND:
        res.status(STATUS_NOT_FOUND)
        res.send('No such offer')
        break
      default:
        res.status(STATUS_SERVER_ERROR)
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
        res.status(STATUS_BAD_REQUEST)
        res.send('Offer not available')
        break
      case OfferResponse.NOT_FOUND:
        res.status(STATUS_NOT_FOUND)
        res.send('No such offer')
        break
      default:
        res.status(STATUS_SERVER_ERROR)
        res.end()
    }
  })

  return router
}
