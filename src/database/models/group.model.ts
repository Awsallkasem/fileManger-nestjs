import {
  Model,
  Table,
  Column,
  DataType,
  HasMany,
  PrimaryKey,
  AutoIncrement,
  HasOne,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { IsEmail, IsString, Length, IsNotEmpty } from 'class-validator';
import { User } from './user.model';
import { UserGroups } from './userGroups';
import { Files } from './file.model';

@Table({ tableName: 'group' })
export class Group extends Model<Group> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @Column({ type: DataType.STRING })
  name: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  createdBy: number;

  @BelongsTo(() => User)
  user: User;

  @HasMany(() => UserGroups, { onDelete: 'cascade', hooks: true })
  userGroups: UserGroups[];

  @HasMany(() => Files, { onDelete: 'cascade', hooks: true })
  files: Files[];
}
