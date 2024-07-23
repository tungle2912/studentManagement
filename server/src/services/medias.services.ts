import { Request } from 'express'
import path from 'path'
import sharp from 'sharp'
import { UPLOAD_IMAGE_DIR, UPLOAD_IMAGE_TEMP_DIR } from '~/constants/dir'
import { Media } from '~/models/schemas/Other'
import { getNameFromFullname } from '~/utils/file'

class MediasService {
  async uploadImage(req: Request) {}
}
const mediasService = new MediasService()

export default mediasService
