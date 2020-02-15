import { Arg, Mutation, Query, Resolver } from 'type-graphql'
import { Repository } from 'typeorm'
import { InjectRepository } from 'typeorm-typedi-extensions'

import { AddUserInput, User } from 'src/entity/user'

@Resolver(() => User)
export class UserResolver {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>
  ) {}

  @Query(() => [User])
  users(): Promise<User[]> {
    return this.userRepository.find()
  }

  @Mutation(() => User)
  insertUser(@Arg('data') { email, name }: AddUserInput): Promise<User> {
    const user = new User()
    user.email = email
    user.name = name

    return this.userRepository.save(user)
  }
}
