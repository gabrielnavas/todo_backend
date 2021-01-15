import { AddUserAccount } from '@/domain/usecases/create-user-account'
import { Request, Response } from 'express'

export class SignupController {
  constructor (
    private readonly dbUserInsertOne: AddUserAccount
  ) {}

  private checkDatas = (body: any): void => {
    const bodyDatas = ['name', 'email', 'password', 'passwordConfirmation']
    bodyDatas.forEach(attr => {
      if (!body[attr]) throw new Error(`missing params ${attr}`)
    })
  }

  handle = async (req: Request, res: Response) => {
    try {
      this.checkDatas(req.body)
      const userModel = await this.dbUserInsertOne.insert(req.body)
      if (!userModel) {
        return res.status(400).json({ body: new Error('Email is exists').message })
      }
      res.status(201).json({ body: userModel })
    } catch (error) {
      res.status(500).json({ body: new Error('unexpected error').message })
    }
  }
}
