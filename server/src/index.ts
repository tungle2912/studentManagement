import express from 'express'
import 'dotenv/config'
import { usersRouter } from './routes/users.routes'
import databaseService from './services/database.services'
import { defaultErrorHandler } from './middlewares/error.middlewares'

databaseService.connect()
const app = express()
const port = process.env.PORT || 5000
app.use(express.json())
app.use('/users', usersRouter)
app.use(defaultErrorHandler)
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
