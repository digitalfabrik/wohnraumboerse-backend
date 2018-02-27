export default class Offer {
  constructor ({id, email, city, formData, expirationDate, confirmed, createdDate, deleted, hashedToken}) {
    this.id = id
    this.email = email
    this.city = city
    this.formData = formData
    this.expirationDate = expirationDate
    this.confirmed = confirmed
    this.createdDate = createdDate
    this.deleted = deleted
    this.hashedToken = hashedToken
  }

  isExpired () {
    return this.expirationDate <= Date.now()
  }

  isActive () {
    return !this.isExpired() && this.confirmed && !this.deleted
  }
}
