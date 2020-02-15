import { Field, InputType, ObjectType } from 'type-graphql'
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity({ name: 'users' })
@ObjectType()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Field()
  id!: string

  @Column()
  @Field()
  name!: string

  @Column({ unique: true })
  @Field()
  email!: string
}

@InputType({ description: 'New user data' })
export class AddUserInput implements Omit<User, 'id'> {
  @Field()
  name!: string

  @Field()
  email!: string
}
