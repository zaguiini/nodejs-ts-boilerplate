import 'reflect-metadata'

import { ApolloServer } from 'apollo-server'
import path from 'path'
import { buildSchema } from 'type-graphql'

import { QueryResolver } from './resolvers/query'

async function bootstrap() {
  const schema = await buildSchema({
    resolvers: [QueryResolver],
    emitSchemaFile: path.resolve(__dirname, 'schema.gql'),
  })

  const server = new ApolloServer({
    schema,
    playground: true,
    introspection: true,
  })

  await server.listen(process.env.PORT)
}

bootstrap()
