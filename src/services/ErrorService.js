// @flow

import ErrorResponse from '../models/ErrorResponse'

const develop = process.env.NODE_ENV === 'development'

export default class ErrorService {
  createInternalServerErrorResponse (e: Error): Error | ErrorResponse {
    console.error(e)
    if (develop) {
      return e
    } else {
      return new ErrorResponse('server',
        'Ein interner Serverfehler ist aufgetreten. Bitte kontaktieren Sie Ihren Administrator.')
    }
  }

  createOfferNotFoundErrorResponse (token: string): ErrorResponse {
    return new ErrorResponse('token', `Das Angebot mit Token ${token} existiert nicht oder wurde gelöscht.`)
  }

  createOfferNotConfirmedErrorResponse (): ErrorResponse {
    return new ErrorResponse('confirmation', 'Das Angebot wurde noch nicht bestätigt. Bitte bestätigen Sie Ihr Angebot zuerst.')
  }

  createOfferExpiredErrorResponse (token: string): ErrorResponse {
    return new ErrorResponse('token', `Das Angebot Token ${token} ist bereits abgelaufen.`)
  }
}
