import { PGHelper } from '@/infra/db/postgresql/helpers/pg-helper'

describe('PGHelper', () => {
  test('should return a pool on call getPool()', async () => {
    const pool = await PGHelper.getPool()
    expect(pool).toBeTruthy()
  })

  test('should return a new client on call getNewConnection()', async () => {
    const client = await PGHelper.getNewConnection()
    expect(client).toBeTruthy()
  })
})
