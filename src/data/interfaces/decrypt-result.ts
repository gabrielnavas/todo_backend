export interface DecryptResult<T> {
  issuedAt?: bigint
  payload: T
}
