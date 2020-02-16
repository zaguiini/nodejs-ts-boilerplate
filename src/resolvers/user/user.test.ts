import { gql } from 'apollo-server'
import faker from 'faker'

import { User } from 'src/entities/user'
import { mockDatabase, mockServer } from 'src/setup-tests'

const GET_USERS_QUERY = gql`
  {
    users {
      id
      name
      email
    }
  }
`

const INSERT_USER_MUTATION = gql`
  mutation InsertUser($input: AddUserInput!) {
    insertUser(data: $input) {
      id
      email
      name
    }
  }
`

describe('User resolver', () => {
  it('should insert a user', async () => {
    const name = faker.name.findName()
    const email = faker.internet.email().toLowerCase()

    await mockServer.mutate({
      mutation: INSERT_USER_MUTATION,
      variables: {
        input: {
          name,
          email,
        },
      },
    })

    const result = await mockServer.query({
      query: GET_USERS_QUERY,
    })

    expect(result.data).toEqual({
      users: [
        {
          id: expect.any(String),
          name,
          email,
        },
      ],
    })
  })

  it('should get users', async () => {
    const name = faker.name.findName()
    const email = faker.internet.email().toLowerCase()

    const user = User.create({
      name,
      email,
    })

    await mockDatabase.manager.save(user)

    const result = await mockServer.query({
      query: GET_USERS_QUERY,
    })

    expect(result.data).toEqual({
      users: [
        {
          id: expect.any(String),
          name,
          email,
        },
      ],
    })
  })
})
