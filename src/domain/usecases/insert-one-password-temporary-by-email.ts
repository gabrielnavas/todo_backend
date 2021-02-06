export interface InsertOnePasswordTemporaryByEmail {
  insertOne (password: string): Promise<void>
}
