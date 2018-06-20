// @flow

import ErrorResponse from '../models/ErrorResponse'

const develop = process.env.NODE_ENV === 'development'

export default class ErrorService {
  createInternalServerErrorResponse (e: Error): Error | ErrorResponse {
    if (develop) {
      console.error(e)
      return e
    } else {
      return new ErrorResponse('server',
        'Ein interner Serverfehler ist aufgetreten. Bitte kontaktieren Sie Ihren Administrator.')
    }
  }

  createOfferNotFoundErrorResponse (token: string): ErrorResponse {
    return new ErrorResponse('token', `Das Angebot mit Token ${token} existiert nicht oder wurde gelöscht.`)
  }

}
