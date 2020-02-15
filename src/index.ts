import 'reflect-metadata'

import { ApolloServer } from 'apollo-server'
import { resolve } from 'path'
import { buildSchema } from 'type-graphql'
import { Container } from 'typedi'
import { createConnection, useContainer } from 'typeorm'

import { UserResolver } from './resolver/user'

useContainer(Container)

async function bootstrap() {
  await createConnection()

  const schema = await buildSchema({
    resolvers: [UserResolver],
    emitSchemaFile: resolve(__dirname, 'schema.gql'),
    container: Container,
  })

  const server = new ApolloServer({
    schema,
    playground: true,
    introspection: true,
  })

  await server.listen(process.env.PORT)
  console.log(`Up and running at port ${process.env.PORT}!`)
}

bootstrap().catch(console.error)
