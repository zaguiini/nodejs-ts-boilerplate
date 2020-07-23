import { Arg, Field, InputType, Mutation, Query, Resolver } from 'type-graphql'

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
    return User.find()
  }

  @Query(() => User)
  async user(@Arg('id') id: string) {
    const user = await User.findOne(id)

    if (user) {
      return user
    }

    throw new Error('User not found')
  }

  @Mutation(() => User)
  insertUser(@Arg('data') data: AddUserInput) {
    const user = User.create(data)

    return User.save(user)
  }

  @Mutation(() => User)
  async updateUser(@Arg('id') id: string, @Arg('data') data: AddUserInput) {
    const user = await User.findOne(id)

    if (user) {
      user.name = data.name
      user.email = data.email
      await user.save()

      return user
    }

    throw new Error('User not found')
  }

  @Mutation(() => Boolean)
  async removeUser(@Arg('id') id: string) {
    const user = await User.findOneOrFail(id)

    await user.remove()
    return true
  }
}
