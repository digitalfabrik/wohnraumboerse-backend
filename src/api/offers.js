import {Router} from 'express'
import {OfferResponse} from '../services/OfferService'
import {sendCreationMail, sendConfirmationMail, sendDeletionMail, sendExtentionMail} from '../services/MailService'

export const STATUS_OK = 200
export const STATUS_NOT_FOUND = 404
export const STATUS_INVALID_REQUEST = 400
export const STATUS_SERVER_ERROR = 500

const emailRegExp = new RegExp('^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\\.[a-zA-Z0-9._-]+$')
const durationRegExp = new RegExp('^[0-9]+$')

const TOKEN_PARAM = ':token([a-z0-9]{128})'

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

  router.put('/', (req, res) => {
    const {email, formData, duration} = req.body
    if (!emailRegExp.test(email)) {
      res.status(STATUS_INVALID_REQUEST)
      res.send('Not a valid email')
      return
    } else if (!durationRegExp.test(duration)) {
      res.status(STATUS_INVALID_REQUEST)
      res.send('Not a valid duration')
      return
    }
    // todo check formData

    const token = offerService.createOffer(req.city, email, formData, Number(duration))

    sendCreationMail({res: res, email: email, city: req.city, token: token})
  })

  router.post(`/${TOKEN_PARAM}/confirm`, (req, res) => {
    const {response, offer} = offerService.confirmOffer(req.params.token)

    switch (response) {
      case OfferResponse.OK:
        sendConfirmationMail({res: res, email: offer.email, city: offer.city, token: req.params.token, expirationDate: offer.expirationDate})
        break
      case OfferResponse.ALREADY_CONFIRMED:
        res.status(STATUS_OK)
        res.end()
        break
      case OfferResponse.INVALID:
        res.status(STATUS_INVALID_REQUEST)
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

  router.post(`/${TOKEN_PARAM}/extend`, (req, res) => {
    const {duration} = req.body

    if (!durationRegExp.test(duration)) {
      res.status(STATUS_INVALID_REQUEST)
      res.send('Not a valid duration')
      return
    }

    const {response, offer} = offerService.extendOffer(req.params.token, Number(duration))
    switch (response) {
      case OfferResponse.OK:
        sendExtentionMail({res: res, email: offer.email, expirationDate: offer.expirationDate})
        break
      case OfferResponse.INVALID:
        res.status(STATUS_INVALID_REQUEST)
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

  router.delete(`${TOKEN_PARAM}`, (req, res) => {
    const {response, offer} = offerService.delete(req.params.token)
    switch (response) {
      case OfferResponse.OK:
        sendDeletionMail({res: res, email: offer.email})
        break
      case OfferResponse.INVALID:
        res.status(STATUS_INVALID_REQUEST)
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
