import { ApolloServerTestClient, createTestClient } from 'apollo-server-testing'
import { Connection } from 'typeorm'

import { connectToDatabase, createServer } from './app'

export let mockDatabase: Connection
export let mockServer: ApolloServerTestClient

beforeAll(async () => {
  mockDatabase = await connectToDatabase({
    ...require('../ormconfig.js'),
    type: 'sqlite',
    database: ':memory:',
  })

  mockServer = createTestClient(await createServer())
})

afterEach(async () => {
  await mockDatabase.synchronize(true)
})

afterAll(() => {
  mockDatabase.close()
})
