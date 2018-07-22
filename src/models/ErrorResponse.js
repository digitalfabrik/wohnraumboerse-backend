// @flow

export default class ErrorResponse {
  constructor (errorType: string, errorMessage: string) {
    this.errorType = errorType
    this.errorMessage = errorMessage
  }
}
