export interface InsertOneUserTokenAccessRepository {
  insertOne(token: InsertOneUserTokenAccessRepository.Params):
    Promise<InsertOneUserTokenAccessRepository.Result>
}

export namespace InsertOneUserTokenAccessRepository {
  export type Params = {idUser: number, token:string}
  export type Result = {id: number, token: string, createdAt: Date}
}
