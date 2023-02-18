import assert from 'node:assert'
import { describe, it } from 'node:test'

import { app } from '../../src/app'

describe('Testing in endpoints from habits', () => {
  it('GET /summary', async () => {
    const mockResult = [
      {
        date: '2023-0-16T03:00:00.000Z',
        amount: 5,
        completed: 1,
        userId: 'UUID',
      },
    ]
    const injectRepsonse = await app.inject().get('/summary')
    const summary = injectRepsonse.json()

    console.log(summary)
    console.log(mockResult)
    // const response = await request.get('/summary').expect(200)
    assert.deepStrictEqual(summary.hasOwnProperty('date'), true)
    assert.deepStrictEqual(summary.hasOwnProperty('amount'), true)
    assert.deepStrictEqual(summary.hasOwnProperty('complete'), true)
    assert.deepStrictEqual(summary.hasOwnProperty('userId'), true)
  })
})
