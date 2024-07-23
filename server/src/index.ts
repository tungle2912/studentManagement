import express from 'express'
import 'dotenv/config'
import { authRouter } from './routes/auth.routes'
import databaseService from './services/database.services'
import { defaultErrorHandler } from './middlewares/error.middlewares'
import { envConfig } from './constants/config'
import cors from 'cors'
import { adminRouter } from './routes/admin.routes'
import { initFolder } from './utils/file'
import { UPLOAD_IMAGE_DIR } from './constants/dir'
import path from 'path'

databaseService.connect().then(() => {
  databaseService.indexStudents()
  databaseService.indexUsers()
  databaseService.indexRefreshTokens()
})
initFolder()
const app = express()
app.use(cors())
const port = envConfig.port
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use('/api/auth', authRouter)
app.use('/api/admin', adminRouter)
app.use('/admin/students/', express.static(UPLOAD_IMAGE_DIR))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(defaultErrorHandler)
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
