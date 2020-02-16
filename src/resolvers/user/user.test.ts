import { gql } from 'apollo-server'
import faker from 'faker'

import { User } from 'src/entities/user'
import { mockDatabase, mockServer } from 'src/setup-tests'

const GET_USERS_QUERY = gql`
  query GetUsers {
    users {
      id
      name
      email
    }
  }
`

const GET_USER_QUERY = gql`
  query GetUser($id: String!) {
    user(id: $id) {
      id
      name
      email
    }
  }
`

const INSERT_USER_MUTATION = gql`
  mutation InsertUser($data: AddUserInput!) {
    insertUser(data: $data) {
      id
      email
      name
    }
  }
`

const UPDATE_USER_MUTATION = gql`
  mutation UpdateUser($id: String!, $data: AddUserInput!) {
    updateUser(id: $id, data: $data) {
      id
      email
      name
    }
  }
`

const REMOVE_USER_MUTATION = gql`
  mutation RemoveUser($id: String!) {
    removeUser(id: $id)
  }
`

describe('User resolver', () => {
  let fakeName: string
  let fakeEmail: string
  let createUser: () => Promise<string>

  beforeEach(() => {
    fakeName = faker.name.findName()
    fakeEmail = faker.internet.email().toLowerCase()

    createUser = async () => {
      const user = User.create({
        name: fakeName,
        email: fakeEmail,
      })

      const { id } = await mockDatabase.manager.save(user)

      return id
    }
  })

  it('should insert a user', async () => {
    await mockServer.mutate({
      mutation: INSERT_USER_MUTATION,
      variables: {
        data: {
          name: fakeName,
          email: fakeEmail,
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
          name: fakeName,
          email: fakeEmail,
        },
      ],
    })
  })

  it('should get users list', async () => {
    const id = await createUser()
    const result = await mockServer.query({
      query: GET_USERS_QUERY,
    })

    expect(result.data).toEqual({
      users: [
        {
          id,
          name: fakeName,
          email: fakeEmail,
        },
      ],
    })
  })

  it('should get one user', async () => {
    const id = await createUser()

    const result = await mockServer.query({
      query: GET_USER_QUERY,
      variables: {
        id,
      },
    })

    expect(result.data).toEqual({
      user: {
        id,
        name: fakeName,
        email: fakeEmail,
      },
    })
  })

  it('should update user', async () => {
    const id = await createUser()

    const newName = faker.name.findName()
    const newEmail = faker.internet.email().toLowerCase()

    await mockServer.mutate({
      mutation: UPDATE_USER_MUTATION,
      variables: {
        id,
        data: {
          name: newName,
          email: newEmail,
        },
      },
    })

    const result = await mockServer.query({
      query: GET_USER_QUERY,
      variables: {
        id,
      },
    })

    expect(result.data).toEqual({
      user: {
        id,
        name: newName,
        email: newEmail,
      },
    })
  })

  it('should remove user', async () => {
    const id = await createUser()

    const result = await mockServer.mutate({
      mutation: REMOVE_USER_MUTATION,
      variables: {
        id,
      },
    })

    expect(result.data).toEqual({ removeUser: true })
  })
})
