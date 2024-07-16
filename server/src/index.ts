import express from 'express'
import 'dotenv/config'
import { usersRouter } from './routes/users.routes'
import databaseService from './services/database.services'
import { defaultErrorHandler } from './middlewares/error.middlewares'
import { envConfig } from './constants/config'
import cors from 'cors'

databaseService.connect()
const app = express()
app.use(cors())
const port = envConfig.port
app.use(express.json())
app.use('/users', usersRouter)
app.use(defaultErrorHandler)
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
