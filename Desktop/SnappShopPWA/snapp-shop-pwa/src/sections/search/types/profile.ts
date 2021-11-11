import {User} from '@schema/user'

export interface EditUserResponse {
  status: boolean
  error: {code: number; message: string}
  data: {
    user: User
    password: string
    isUserVerified: boolean
  }
}
