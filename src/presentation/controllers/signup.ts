import { DbUserInsertOne } from 'data/usecases/db-user-insert-one'
import { Request, Response } from 'express'

export class SignupController {
  constructor (
    private readonly dbUserInsertOne: DbUserInsertOne
  ) {}

  handle (req: Request, res: Response) {
    const bodyDatas = ['name', 'email', 'password', 'passwordConfirmation']
    bodyDatas.forEach(attr => {
      if (!req.body[attr]) throw new Error(`missing params ${attr}`)
    })
    const userModel = this.dbUserInsertOne.insert(req.body)
    res.status(201).json(userModel)
  }
}
