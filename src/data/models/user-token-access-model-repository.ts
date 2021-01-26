export type UserTokenAccessModelRepository = {
  id: number,
  token: string,
  createdAt: Date
  invalidAt: Date
}
