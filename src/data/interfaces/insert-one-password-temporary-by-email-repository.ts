export interface InsertOnePasswordTemporaryByEmailRepository {
  insertOne (params: InsertOnePasswordTemporaryByEmailRepository.Params): Promise<void>
}

export namespace InsertOnePasswordTemporaryByEmailRepository {
  export type Params = {
    idUser: number
    passwordRandom: string
  }
}
