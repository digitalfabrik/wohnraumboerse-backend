import {Router} from 'express'

export default ({offerService}) => {
  const router = new Router()
  router.get('/', (req, res) => {
    res.json(offerService.getOffers(req.city))
  })

  router.put('/', (req, res) => {
    const {email, formData, duration} = req.body
    const id = offerService.createOffer(req.city, email, formData, duration)
    res.json(id)
  })

  return router
}
