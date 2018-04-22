# Neuburg Backend
The aim of this repository is to build a backend server for the Neuburger-Modell.
## Setup
You need to install a mongodb on your machine. Follow https://docs.mongodb.com/getting-started/shell/installation/ and choose the guide for your OS. Before starting the neuburg-backend, make sure that the mongodb is running.
For development: Before running the lint script or the flow type checker, execute the `flow-typed` script first.

## API Version v0
### Offers Endpoint

#### GET `/v0/:city/offers`
Returns all currently available offers (Array of objects that represent only the formData).

#### PUT `/v0/:city/offers`
Creates a new offer. Expected request body sample:
```javascript
{
  "email": "erika@mustermann.de",   /* The landlord's email */
  "duration": 3,                    /* Either 3, 7, 14 or 30. Duration in days of visibility of the offer */
  "formData": { ... }               /* The filled data of the form which is validated against the :city's form scheme */
}
```
On a correct request, the server will send a confirmation-email to `email` containing the `token` and respond:
```javascript
{
  "token": "0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF" /* A token for the created offer */
}
```

#### POST `/v0/:city/offers/:token/confirm`
Confirms the email-adress of the offer with the specified `token`.
If the corresponding offer is not yet expired and has not been deleted, the confirmation will be accepted and the server will
send an email to the offer's `email` and to a city administrator with a link to delete the offer.

#### DELETE `/v0/:city/offers/:token`
Sets the offer with the specified `token` as deleted.
