# Neuburg Backend
The aim of this repository is to build a backend server for the Neuburger-Modell.
## Setup
You need to install a mongodb on your machine. Follow https://docs.mongodb.com/getting-started/shell/installation/ and choose the guide for your OS. Before starting the neuburg-backend, make sure that the mongodb is running.

For development: Before running the lint script or the flow type checker, execute the `flow-typed` script first. It will install the flow type definitions for external libraries.

## Using configs for development
neuburg-backend will look for configs in the current working directory. If it does not find the config it will start to search up the directory tree. The priority of config files is the following (first path has the highest priority):
* `.neuburg-brackendrc-dev.json`,
* `.neuburg-brackendrc-dev.js`,
* `neuburg-brackend-dev.config.js`,
* `.neuburg-brackendrc.json`,
* `.neuburg-brackendrc.js`,
* `neuburg-brackend.config.js`

Look into the `templates/` folder for a config template. The config library/engine is [cosmiconfig](https://github.com/davidtheclark/cosmiconfig).

## Deployment

1. Create new release on Jira (should be empty)
2. Update old issues to use the created release as Fix Version
   * Query to find old issues: `project = "neuburg-model" AND label = "backend" AND Sprint = "Highway to I10K!" AND Sprint != "Highway to IXIK!" AND fixVersion is empty`
3. Release the Jira release
4. Generate release notes in Jira

5. Create a branch and create a Pull Request to develop:
    * Update version number e.g "2018.03.02" in package.json
6. Merge branch in develop

7. Create Pull Request to merge develop in master:
8. Merge develop in master

9. Tag the master HEAD as "2018.03.02". Add the release notes from Jira as description.
10. Send release notes to Slack channel #passauer-modell

11. Deploy via SSH: `tools/deploy/ssh-deploy.sh wohnen.integreat-app.de /opt/neuburg-backend wohnen:wohnen`

## API Version v0
### Offers Endpoint

#### GET `/v0/:city/offer`
Returns all currently available offers (Array of objects that represent the formData, the email-addresses and the date the offer has been created). Every `formData` object has a key `version` that indicates its version. Result Sample
```javascript
[
{
  "email": "erika@mustermann.de"
  "createdDate": "2018-05-27T11:19:49.185Z"
  "formData": { ... }
},
{
  "email": "peter@mustermensch.de"
  "createdDate": "2018-06-05T12:13:27.679Z"
  "formData": { ... }
},
...
]
```

#### PUT `/v0/:city/offer`
Creates a new offer. E-mail, duration and agreedToDataProtection are required (and agreedToDataProtection must be set to `true`). Expected request body sample:
```javascript
{
  "email": "erika@mustermann.de",   /* The landlord's email */
  "duration": 3,                    /* Either 3, 7, 14 or 30. Duration in days of visibility of the offer */
  "agreedToDataProtection": true,
  "formData": { ... }               /* The filled data of the form which is validated against the :city's form scheme */
}
```
On a correct request, the server will send a confirmation-email to `email` containing the `token` and respond with HTTP-statuscode 200.

#### POST `/v0/:city/offer/:token/confirm`
Confirms the email-address of the offer with the specified `token`.
If the corresponding offer is not yet expired and has not been deleted, the confirmation will be accepted and the server will
send an email to the offer's `email` and to a city administrator with a link to delete the offer.

#### POST `/v0/:city/offer/:token/extend`
Renews the expiration date of the offer with the specified `token` if the email-address has already been confirmed.
The new duration must be passed in the request body. Body sample:
```javascript
{
  "duration": 7
}
```

#### DELETE `/v0/:city/offer/:token`
Deletes the offer with the specified `token`.
