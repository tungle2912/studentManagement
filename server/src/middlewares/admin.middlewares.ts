import { NextFunction, Request, Response } from 'express'
import { checkSchema } from 'express-validator/lib/middlewares/schema'
import formidable from 'formidable'
import { ObjectId } from 'mongodb'
import { envConfig } from '~/constants/config'
import { UPLOAD_IMAGE_TEMP_DIR } from '~/constants/dir'
import { RoleType } from '~/constants/enums'
import HTTP_STATUS from '~/constants/httpStatus'
import { AUTH_MESSAGES } from '~/constants/messages'
import { ErrorWithStatus } from '~/models/Errors'
import databaseService from '~/services/database.services'
import { verifyToken } from '~/utils/jwt'
import { validate } from '~/utils/validation'
import { v2 as cloudinary } from 'cloudinary'
const form = formidable({})
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
      },
      search: {
        optional: true,
        isString: true,
        trim: true,
        escape: true
      },
      sortBy: {
        optional: true,
        isIn: {
          options: [['name', 'email', 'dateOfAdmission', 'created_at']],
          errorMessage: 'Invalid sort field'
        }
      },
      sortOrder: {
        optional: true,
        isIn: {
          options: [['ascend', 'descend']],
          errorMessage: 'Invalid sort order'
        }
      }
    },
    ['query']
  )
)

export const addStudentValidator = validate(
  checkSchema(
    {
      name: {
        isString: true
      },
      email: {
        isEmail: true
      },
      phone: {
        isString: true
      },
      enroll_number: {
        isString: true
      },
      date_of_admission: {
        isString: true
      }
    },
    ['body']
  )
)

export const handleRequest = async (req: Request, res: Response, next: NextFunction) => {

  try {
    const form = formidable({
      uploadDir: UPLOAD_IMAGE_TEMP_DIR,
      maxFiles: 1,
      keepExtensions: true,
      maxFileSize: 3000 * 1024 // 300KB
    })

    const result = await new Promise<{ files: formidable.Files; fields: formidable.Fields }>((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) {
          return reject(err)
        }
        req.files = files
        resolve({ files, fields })
      })
    })
    // Chuyển đổi các giá trị từ mảng thành chuỗi
    const processedFields: Record<string, string> = {}
    for (const [key, value] of Object.entries(result.fields)) {
      processedFields[key] = Array.isArray(value) ? value[0] : (value as unknown as string)
    }
    // // Gán các trường đã được xử lý vào req.body
    req.body = processedFields
    next()
  } catch (error) {
    next(error)
  }
}
