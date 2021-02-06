import { UserAccountModel } from '../models/user-account'

export interface CommunicateUserTemporaryNewPassword {
  handle(userAccount: UserAccountModel): Promise<void>
}
