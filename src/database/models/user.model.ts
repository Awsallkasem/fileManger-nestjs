import {
  Model,
  Table,
  Column,
  DataType,
  HasMany,
  PrimaryKey,
  AutoIncrement,
  HasOne,
} from 'sequelize-typescript';
import { IsEmail, IsString, Length, IsNotEmpty } from 'class-validator';
import { Files } from './file.model';
import { UserGroups } from './userGroups';
import { Logging } from './logging.model';

@Table({ tableName: 'users' })
export class User extends Model<User> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  @IsNotEmpty({ message: 'email is required' })
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @Column({ type: DataType.STRING, allowNull: false })
  @IsNotEmpty({ message: ' name is required' })
  Fname: string;

  @Column({ type: DataType.STRING, allowNull: false })
  @IsNotEmpty({ message: ' name is required' })
  Lname: string;

  @Column({ type: DataType.STRING, validate: { len: [8, 255] } })
  @Length(8, 255, { message: 'pasword must be 10 characters long' })
  password: string;

  @Column({ type: DataType.BOOLEAN })
  isAdmin: boolean;

  @HasMany(() => Files, { onDelete: 'cascade', hooks: true })
  files: Files[];

  @HasMany(() => UserGroups, { onDelete: 'cascade', hooks: true })
  userGroups: UserGroups[];

  @HasMany(() => Logging, { onDelete: 'cascade', hooks: true })
  logging: Logging[];
}
