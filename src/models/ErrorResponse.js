// @flow

export default class ErrorResponse {
  errorType: string
  errorMessage: string

  constructor (errorType: string, errorMessage: string) {
    this.errorType = errorType
    this.errorMessage = errorMessage
  }
}
