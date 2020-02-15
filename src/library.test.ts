import { log } from 'src/library'

describe('Logging utility', () => {
  it('should return undefined', () => {
    expect(log('Hey there')).toBeUndefined()
  })
})
