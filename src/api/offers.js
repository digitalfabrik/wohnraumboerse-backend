import {Router} from 'express'
import {OfferResponse} from '../services/OfferService'

const STATUS_OK = 200
const STATUS_NOT_FOUND = 404
const STATUS_INVALID_REQUEST = 400
const STATUS_SERVER_ERROR = 500

export default ({offerService}) => {
  const router = new Router()

  router.get('/', (req, res) => {
    res.json(offerService.getActiveOffers(req.city))
  })

  router.put('/', (req, res) => {
    const {email, formData, duration} = req.body
    const id = offerService.createOffer(req.city, email, formData, duration)
    res.json(id)
  })

  router.post('/:token/confirm', (req, res) => {
    const response = offerService.confirmOffer(req.params.token)
    switch (response) {
      case OfferResponse.CONFIRMED:
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

  router.delete('/:token', (req, res) => {
    const response = offerService.delete(req.params.token)
    switch (response) {
      case OfferResponse.CONFIRMED:
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

  return router
}
