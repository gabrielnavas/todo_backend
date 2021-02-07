export interface InsertOnePasswordTemporaryByEmailRepository {
  insertOne (params: InsertOnePasswordTemporaryByEmailRepository.Params):
    Promise<InsertOnePasswordTemporaryByEmailRepository.Result>
}

export namespace InsertOnePasswordTemporaryByEmailRepository {
  export type Params = {
    idUser: number
    passwordTemporary: string
  }
  export type Result = {
    idTemporaryPassword: number
    idUser: number,
    passwordTemporary: string
  }
}
