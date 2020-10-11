import { Arg, Field, InputType, Mutation, Query, Resolver } from 'type-graphql'
import { getRepository } from 'typeorm'

import { User } from 'src/entities/user'

@InputType({ description: 'New user data' })
export class AddUserInput implements Pick<User, 'name' | 'email'> {
  @Field()
  name!: string

  @Field()
  email!: string
}

@Resolver(() => User)
export class UserResolver {
  @Query(() => [User])
  users() {
    const userRepository = getRepository(User)
    return userRepository.find()
  }

  @Query(() => User)
  async user(@Arg('id') id: string) {
    const userRepository = getRepository(User)

    try {
      return await userRepository.findOneOrFail(id)
    } catch {
      throw new Error('User not found')
    }
  }

  @Mutation(() => User)
  insertUser(@Arg('data') data: AddUserInput) {
    const userRepository = getRepository(User)
    const user = userRepository.create(data)

    return userRepository.save(user)
  }

  @Mutation(() => User)
  async updateUser(@Arg('id') id: string, @Arg('data') data: AddUserInput) {
    const userRepository = getRepository(User)
    const user = await userRepository.findOne(id)

    if (user) {
      user.name = data.name
      user.email = data.email
      await userRepository.save(user)

      return user
    }

    throw new Error('User not found')
  }

  @Mutation(() => Boolean)
  async removeUser(@Arg('id') id: string) {
    const userRepository = getRepository(User)
    const user = await userRepository.findOneOrFail(id)

    await userRepository.remove(user)
    return true
  }
}
