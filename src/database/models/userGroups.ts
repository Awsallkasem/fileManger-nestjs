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
import { Group } from './group.model';

@Table({ tableName: 'UserGroups' })
export class UserGroups extends Model<UserGroups> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  userId: number;

  @BelongsTo(() => User)
  user: User;

  @ForeignKey(() => Group)
  @Column({ type: DataType.INTEGER, allowNull: false })
  groupId: number;

  @BelongsTo(() => Group)
  group: Group;
}
