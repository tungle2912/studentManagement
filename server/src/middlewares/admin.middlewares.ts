import { checkSchema } from 'express-validator/lib/middlewares/schema'
import { ObjectId } from 'mongodb'
import { envConfig } from '~/constants/config'
import { RoleType } from '~/constants/enums'
import HTTP_STATUS from '~/constants/httpStatus'
import { AUTH_MESSAGES } from '~/constants/messages'
import { ErrorWithStatus } from '~/models/Errors'
import databaseService from '~/services/database.services'
import { verifyToken } from '~/utils/jwt'
import { validate } from '~/utils/validation'

export const adminValidator = validate(
  checkSchema(
    {
      Authorization: {
        custom: {
          options: async (value, { req }) => {
            try {
              const access_token = (value || '').split('Bearer ')[1]
              const decoded_access_token = await verifyToken({
                token: access_token,
                secretOrPublicKey: envConfig.jwtSecretAccessToken
              })
              const user = await databaseService.users.findOne({
                _id: new ObjectId(decoded_access_token.user_id)
              })
              if (!user) {
                throw new ErrorWithStatus({
                  message: AUTH_MESSAGES.ACCESS_TOKEN_INVALID,
                  status: HTTP_STATUS.UNAUTHORIZED
                })
              }
              if (user.role !== RoleType.Admin) {
                throw new ErrorWithStatus({
                  message: AUTH_MESSAGES.PERMISSION_DENIED,
                  status: HTTP_STATUS.FORBIDDEN
                })
              }
              return true
            } catch (error) {
              throw new ErrorWithStatus({
                message: AUTH_MESSAGES.ACCESS_TOKEN_INVALID,
                status: HTTP_STATUS.UNAUTHORIZED
              })
            }
          }
        }
      }
    },
    ['headers']
  )
)

export const paginationValidator = validate(
  checkSchema(
    {
      limit: {
        isNumeric: true,
        custom: {
          options: async (value) => {
            const num = Number(value)
            if (num > 100 || num < 1) {
              throw new Error('1 <= limit <= 100')
            }
            return true
          }
        }
      },
      page: {
        isNumeric: true,
        custom: {
          options: async (value) => {
            const num = Number(value)
            if (num < 1) {
              throw new Error('page >= 1')
            }
            return true
          }
        }
      }
    },
    ['query']
  )
)
