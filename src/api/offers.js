import {Router} from 'express'

export default ({offerService}) => {
  const router = Router()

  router.get('/', (req, res) => {
    res.json(offerService.getOffers(req.city))
  })

  router.put('/', (req, res) => {
    const {email, formData, duration} = req.body
    const id = offerService.createOffer(req.city, email, formData, duration)
    console.log(id)

    res.mailer.send('email', {
      to: email,
      subject: 'Test Email'
    }, function (err) {
      if (err) {
        // handle error
        console.log(err)
        res.send('There was an error sending the email')
        return
      }
      res.send('Email Sent')
    })
  })

  return router
}
