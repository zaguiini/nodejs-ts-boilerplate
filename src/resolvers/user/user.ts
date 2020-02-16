import { Arg, Field, InputType, Mutation, Query, Resolver } from 'type-graphql'
import { Repository } from 'typeorm'
import { InjectRepository } from 'typeorm-typedi-extensions'

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
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>
  ) {}

  @Query(() => [User])
  users() {
    return this.userRepository.find()
  }

  @Query(() => User)
  async user(@Arg('id') id: string) {
    const user = await this.userRepository.findOne(id)

    if (user) {
      return user
    }

    throw new Error('User not found')
  }

  @Mutation(() => User)
  insertUser(@Arg('data') data: AddUserInput) {
    const user = User.create(data)

    return this.userRepository.save(user)
  }

  @Mutation(() => User)
  async updateUser(@Arg('id') id: string, @Arg('data') data: AddUserInput) {
    const user = await this.userRepository.findOne(id)

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
    const user = await this.userRepository.findOne(id)

    if (user) {
      await user.remove()
      return true
    }

    throw new Error('User not found')
  }
}
