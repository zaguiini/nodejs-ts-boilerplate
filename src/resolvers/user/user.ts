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
  users(): Promise<User[]> {
    return this.userRepository.find()
  }

  @Mutation(() => User)
  insertUser(@Arg('data') data: AddUserInput): Promise<User> {
    const user = User.create(data)

    return this.userRepository.save(user)
  }
}
