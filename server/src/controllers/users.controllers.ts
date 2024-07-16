import { NextFunction, Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { ObjectId } from 'mongodb'
import HTTP_STATUS from '~/constants/httpStatus'
import { USERS_MESSAGES } from '~/constants/messages'
import { LoginReqBody, RegisterReqBody, TokenPayload, VerifyEmailReqBody } from '~/models/requests/User.requests'
import User from '~/models/schemas/User.schema'
import databaseService from '~/services/database.services'
import usersService from '~/services/users.services'

export const loginController = async (req: Request<ParamsDictionary, any, LoginReqBody>, res: Response) => {
  const user = req.user as User
  const user_id = user._id as ObjectId
  const result = await usersService.login({ user_id: user_id.toString(), verify: user.verify })
  return res.json({
    message: USERS_MESSAGES.LOGIN_SUCCESS,
    result
  })
}
export const registerController = async (
  req: Request<ParamsDictionary, any, RegisterReqBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await usersService.register(req.body)
    return res.json({
      message: USERS_MESSAGES.REGISTER_SUCCESS,
      result
    })
  } catch (error) {
    next(error)
  }
}
export const verifyEmailController = async (
  req: Request<ParamsDictionary, any, VerifyEmailReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { user_id } = req.decoded_email_verify_token as TokenPayload
  const user = await databaseService.users.findOne({
    _id: new ObjectId(user_id)
  })
  // nếu không tìm thấy user sẽ báo lỗi
  // if (!user) {
  //   return res.status(HTTP_STATUS.NOT_FOUND).json({
  //     message: USERS_MESSAGES.USER_NOT_FOUND
  //   })
  // }
  // // đã verify rồi thì không báo lỗi
  // // mà mình sẽ trả về status ok với message là đã verify rồi
  // if (user.email_verify_token === '') {
  //   return res.json({ message: USERS_MESSAGES.EMAIL_ALREADY_VERIFIED_BEFORE })
  // }

  // const result = await usersService.verifyEmail(user_id)
  // return res.json({
  //   message: USERS_MESSAGES.EMAIL_VERIFY_SUCCESS,
  //   result
  // })
  let message
  let redirectUrl = `http://localhost:3000/login`
  if (!user) {
    message = USERS_MESSAGES.USER_NOT_FOUND
  } else if (user.email_verify_token === '') {
    message = USERS_MESSAGES.EMAIL_ALREADY_VERIFIED_BEFORE
  } else {
    await usersService.verifyEmail(user_id)
    message = USERS_MESSAGES.EMAIL_VERIFY_SUCCESS
    redirectUrl = `http://localhost:3000/login?email=${encodeURIComponent(user.email)}`
  }
  res.send(`
    <html>
      <body>
        <h2>${message}</h2>
        <script>
          setTimeout(() => {
            window.location.href = '${redirectUrl}';
          }, 3000); // Chuyển hướng sau 3 giây
        </script>
      </body>
    </html>
  `)
}
