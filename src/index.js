// @flow

import 'babel-polyfill'
import http from 'http'
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import initializeDb from './db'
import api from './api'
import type {Config} from './Config'
import initializeServices from './services/initializeServices'
import commander from 'commander'
import cosmiconfig from 'cosmiconfig'

commander.version('0.0.1').parse(process.argv)

const explorer = cosmiconfig('neuburg-backend')
const result = explorer.searchSync()

if (!result) {
  console.error('Failed to find config!')
  process.exit(1)
}

const config: Config = result.config

const services = initializeServices(config)
const app = express()

const server = http.createServer(app)

// logger
app.use(morgan('dev'))

// 3rd party middleware
app.use(
  cors({
    exposedHeaders: config.corsHeaders
  })
)

app.use(
  bodyParser.json({
    limit: config.bodyLimit
  })
)

// api router
app.use('/', api(services))

// connect to db
const db = initializeDb(config.mongoDBUrl)
db.on('error', (message: string) => {
  console.error(message)
  process.exit(1)
})

db.once('open', () => {
  console.log('Connected to DB.')
  server.listen(process.env.PORT || config.port, () => {
    console.log(`Started on port ${server.address().port}`)
  })
})

export default app
