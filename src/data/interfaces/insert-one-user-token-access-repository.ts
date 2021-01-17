export interface InsertOneUserTokenAccessRepository {
  insertOne(token: InsertOneUserTokenAccessRepository.Params):
    Promise<InsertOneUserTokenAccessRepository.Result>
}

export namespace InsertOneUserTokenAccessRepository {
  export type Params = string
  export type Result = {token: string, createdAt: Date}
}
