import Offer from '../database/Offer'
import hash from '../utils/hash'
import createToken from '../utils/createToken'
import MailService from './MailService'
import forms from '../database/forms'

const MILLISECONDS_IN_A_DAY = 1000 * 60 * 60 * 24

export default class OfferService {

  async createOffer (city, email, formData, duration) {
    const token = createToken()

    const form = new forms[city](formData)
    await form.save()

    const offer = new Offer({
      email: email,
      city: city,
      expirationDate: Date.now() + duration * MILLISECONDS_IN_A_DAY,
      hashedToken: hash(token),
      formData: form
    })

    await offer.save()
/*    Offer.findOne().where('_id').equals(offer._id).populate('formData').exec((err, result) => {
      if (err) {
        console.log(err)
      }
      console.log('Offer after populate: ', offer)
      console.log('Result after populate:', result)
    })*/
    const mailService = new MailService()
    // await mailService.sendCreationMail(offer, token)

    return token
  }

/*  populateOffer (id) {
    Offer.findOne().where('_id').equals(id).populate('formData').exec((err, result) => {
      if (err) {
        console.log(err)
      }
      await result.save()
    })
  }*/

  validationCallback (err, result) {
    if (err) {
      return console.log(err.toString())
    }
    console.log('Saved.')
  }


  getAllOffersQuery () {
    return Offer.find().populate('formData')
  }

  getActiveOffersQuery (city) {
    return Offer.find().where('city').equals(city)
  }

  findOfferByToken (token) {
    return Offer.find().where('hashedToken').equals(hash(token)).exec(this.findCallback())
    // this.offers.find(offer => offer.hashedToken === hash(token))
  }

  async confirmOffer (offer, token) {
    if (offer.confirmed === true) {
      return
    }
    const mailService = new MailService()
    await
      mailService.sendConfirmationMail(offer, token)

    offer.confirmed = true
    offer.save(this.validationCallback)
  }

  async extendOffer (offer, duration, token) {
    offer.expirationDate = Date.now() + duration * MILLISECONDS_IN_A_DAY
    const mailService = new MailService()
    await
      mailService.sendExtensionMail(offer, token)
    offer.save(this.validationCallback)
  }

  async deleteOffer (offer) {
    if (offer.deleted) {
      return
    }
    const mailService = new MailService()
    await
      mailService.sendDeletionMail(offer)
    offer.deleted = true
    offer.save(this.validationCallback)
  }

  // save () {
  //   fs.writeFileSync(this.fileName, JSON.stringify(this.offers))
  // }

  // read () {
  //   if (fs.existsSync(this.fileName)) {
  //     return JSON.parse(fs.readFileSync(this.fileName))
  //       .map(json => new Offer(json))
  //   } else {
  //     return []
  //   }
  // }
}
