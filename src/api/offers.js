import {Router} from 'express'
import {OfferResponse} from '../services/OfferService'
import {sendCreationMail, sendConfirmationMail, sendDeletionMail, sendExtentionMail} from '../services/MailService'
import {body, validationResult} from 'express-validator/check'
import {matchedData} from 'express-validator/filter'

export const STATUS_OK = 200
export const STATUS_NOT_FOUND = 404
export const STATUS_BAD_REQUEST = 400
export const STATUS_SERVER_ERROR = 500
export const STATUS_UNPROCESSABLE_ENTITY = 422

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
    body('duration').isInt().toInt().custom(value => [3, 7, 14, 30].includes(value))
  ], (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(STATUS_UNPROCESSABLE_ENTITY).json({errors: errors.mapped()})
    }
    const {email, formData, duration} = matchedData(req)

    console.log(typeof duration)

    const token = offerService.createOffer(req.city, email, formData, duration)
    sendCreationMail({res, email, city: req.city, token})
  })

  router.post(`/:token/confirm`, (req, res) => {
    const {response, offer} = offerService.confirmOffer(req.params.token)

    switch (response) {
      case OfferResponse.OK:
        sendConfirmationMail({
          res: res,
          email: offer.email,
          city: offer.city,
          token: req.params.token,
          expirationDate: offer.expirationDate
        })
        break
      case OfferResponse.ALREADY_CONFIRMED:
        res.status(STATUS_OK)
        res.end()
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

  router.post(`/:token/extend`, (req, res) => {
    const {duration} = req.body

    const {response, offer} = offerService.extendOffer(req.params.token, Number(duration))
    switch (response) {
      case OfferResponse.OK:
        sendExtentionMail({res: res, email: offer.email, expirationDate: offer.expirationDate})
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
