import {Router} from 'express'
import {OfferResponse} from '../services/OfferService'

const STATUS_OK = 200
const STATUS_NOT_FOUND = 404
const STATUS_INVALID_REQUEST = 400
const STATUS_SERVER_ERROR = 500

export default ({offerService}) => {
  const router = new Router()

  router.get('/getAll', (req, res) => {
    res.json(offerService.getAllOffers())
  })

  router.get('/', (req, res) => {
    res.json(offerService.getActiveOffers(req.city))
  })

  router.put('/', (req, res) => {
    const {email, formData, duration} = req.body
    const token = offerService.createOffer(req.city, email, formData, Number(duration))

    res.mailer.send('email', {
      to: email,
      subject: 'Test Email',
      token
    }, err => {
      if (err) {
        // handle error
        console.log(err)
        res.status(STATUS_SERVER_ERROR)
        res.send('There was an error sending the email')
        return
      }
      res.status(STATUS_OK)
      res.json(token)
    })
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
