import {Router} from 'express'
import Offer from '../models/Offer'

export default ({db}) => {
  const router = new Router()
  router.get('/', (req, res) => {
    res.json(req.city)
  })

  router.put('/', (req, res) => {
    const {email, formData} = req.body
    const offer = new Offer({email, city: req.city, formData})
    res.json(offer)

  })

  return router
}
