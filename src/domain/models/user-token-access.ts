export type UserTokenAccessModel = {
  id: number,
  token: string,
  createdAt: Date
  invalidAt?: Date
}
