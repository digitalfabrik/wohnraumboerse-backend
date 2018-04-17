// @flow

import 'babel-polyfill'
import http from 'http'
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import initializeDb from './db'
import api from './api'
import config from './config.json'
import initializeServices from './services/initializeServices'
import commander from 'commander'

commander
  .version('0.0.1')
  .option('-u, --database-url <url>', 'Set the database url', 'mongodb://localhost/livingDB')
  .parse(process.argv)

const dbUrl = commander.databaseUrl

const services = initializeServices()
const app = express()

app.server = http.createServer(app)

// logger
app.use(morgan('dev'))

// 3rd party middleware
app.use(cors({
  exposedHeaders: config.corsHeaders
}))

app.use(bodyParser.json({
  limit: config.bodyLimit
}))

// connect to db
initializeDb(dbUrl, db => {
  db.on('error', console.error.bind(console, 'connection error:'))
  db.once('open', function () {
    console.log('Connected to DB.')
  })
  // api router
  app.use('/', api(services))

  app.server.listen(process.env.PORT || config.port, () => {
    console.log(`Started on port ${app.server.address().port}`)
  })
})

export default app
