// @flow

import ErrorResponse from '../models/ErrorResponse'

const develop = process.env.NODE_ENV === 'development'

export default class ErrorService {

  computeInternalServerErrorResponse (e: Error): Error | ErrorResponse {
    if (develop) {
      console.error(e)
      return e
    } else {
      return new ErrorResponse('server',
        'An internal server error occurred. Please contact your administrator.')
    }
  }


}