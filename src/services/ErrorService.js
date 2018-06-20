// @flow

import ErrorResponse from '../models/ErrorResponse'
import _ from 'lodash'

const develop = process.env.NODE_ENV === 'development'

export default class ErrorService {
  createInternalServerErrorResponse (error: Error): Error | ErrorResponse {
    console.error(error)
    if (develop) {
      return error
    } else {
      return new ErrorResponse('server',
        'Ein interner Serverfehler ist aufgetreten. Bitte kontaktieren Sie Ihren Administrator.')
    }
  }

  createOfferNotFoundErrorResponse (token: string): ErrorResponse {
    return new ErrorResponse('token', `Das Angebot mit Token '${token}' existiert nicht oder wurde gelöscht.`)
  }

  createOfferNotConfirmedErrorResponse (): ErrorResponse {
    return new ErrorResponse('confirmation', 'Das Angebot wurde noch nicht bestätigt. Bitte bestätigen Sie Ihr Angebot zuerst.')
  }

  createOfferExpiredErrorResponse (token: string): ErrorResponse {
    return new ErrorResponse('token', `Das Angebot mit Token '${token}' ist bereits abgelaufen.`)
  }

  createValidationFailedErrorResponse (error: ValidationError): ErrorResponse {
    const fieldErrorMessages = Object.values(error.errors).map((e: mixed): string => e.message)
    return new ErrorResponse('validation', `Im Formular sind die folgenden Fehler aufgetreten: ${fieldErrorMessages.join(' ')}`)
  }

  createValidationFailedErrorResponseFromArray (errors: Array<Error>): ErrorResponse {
    const errorFields = errors.array().map((error: Error): string => this.translateOuterFormPaths(error.param))
    const errorFieldsWithoutDuplicates = _.uniq(errorFields)
    const message = `Ungültige oder fehlende Eingaben in dem/den folgenden Feld(ern): ${errorFieldsWithoutDuplicates.join(', ')}`
    return new ErrorResponse('validation', message)
  }

  translateOuterFormPaths (param: string): string {
    switch (param) {
      case 'email':
        return 'E-Mail'
      case 'duration':
        return 'Dauer des Angebots'
      case 'agreedToDataProtection':
        return 'Zustimmung zu den Datenschutzbestimmungen'
      case 'formData':
        return 'Formular'
      case 'token':
        return 'Token'
    }
  }
}
