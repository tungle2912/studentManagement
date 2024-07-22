import 'dotenv/config'
import { Collection, Db, MongoClient } from 'mongodb'
import { envConfig } from '~/constants/config'
import Otp from '~/models/schemas/otps.chema'
import RefreshToken from '~/models/schemas/refreshtoken.schema'
import Student from '~/models/schemas/student.schema'
import User from '~/models/schemas/user.schema'

const uri = `mongodb+srv://${envConfig.dbUsername}:${envConfig.dbPassword}@studentmanagement.bygjalp.mongodb.net/`

class DatabaseService {
  private client: MongoClient
  private db: Db
  constructor() {
    this.client = new MongoClient(uri)
    this.db = this.client.db(envConfig.dbName)
  }
  async connect() {
    try {
      // Send a ping to confirm a successful connection
      await this.db.command({ ping: 1 })
      console.log('Pinged your deployment. You successfully connected to MongoDB!')
    } catch (error) {
      console.log('Error', error)
      throw error
    }
  }
  async indexUsers() {
    const exists = await this.users.indexExists(['email_1_password_1', 'email_1', 'username_1'])
    if (!exists) {
      this.users.createIndex({ email: 1, password: 1 })
      this.users.createIndex({ email: 1 }, { unique: true })
    }
  }
  async indexStudents() {
    const exists = await this.students.indexExists(['created_at_1'])
    if (!exists) {
      await this.students.createIndex({ created_at: 1 })
    }
  }
  async indexRefreshTokens() {
    const exists = await this.refreshTokens.indexExists(['exp_1', 'token_1'])

    if (!exists) {
      this.refreshTokens.createIndex({ token: 1 })
      this.refreshTokens.createIndex(
        { exp: 1 },
        {
          expireAfterSeconds: 0
        }
      )
    }
  }
  get users(): Collection<User> {
    return this.db.collection('users')
  }
  get refreshTokens(): Collection<RefreshToken> {
    return this.db.collection('refresh_token')
  }
  get otps(): Collection<Otp> {
    return this.db.collection('otps')
  }
  get students(): Collection<Student> {
    return this.db.collection('students')
  }
}

// Tạo object từ class DatabaseService
const databaseService = new DatabaseService()
export default databaseService
