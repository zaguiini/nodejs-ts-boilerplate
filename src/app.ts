import 'reflect-metadata'

import { ApolloServer } from 'apollo-server'
import { useContainer as classValidatorUseContainer } from 'class-validator'
import { buildSchema } from 'type-graphql'
import { Container } from 'typedi'
import {
  ConnectionOptions,
  createConnection,
  useContainer as typeORMUseContainer,
} from 'typeorm'

import resolvers from './resolvers'

typeORMUseContainer(Container)
classValidatorUseContainer(Container)

export const connectToDatabase = (
  config: ConnectionOptions = require('../ormconfig.js')
) => {
  return createConnection(config)
}

export const createServer = async () => {
  const schema = await buildSchema({
    resolvers,
    container: Container,
    validate: false,
  })

  return new ApolloServer({
    schema,
    playground: true,
    introspection: true,
  })
}

export const bootstrap = async () => {
  await connectToDatabase()
  const instance = await createServer()

  await instance.listen(process.env.PORT)
  console.log(`Up and running at port ${process.env.PORT}!`)
}
