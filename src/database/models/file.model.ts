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
import { Logging } from './logging.model';

@Table({ tableName: 'files' })
export class Files extends Model<Files> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @Column({ type: DataType.STRING })
  filePath: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  isBlocked: boolean;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  attachedBy: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER })
  UsedBy: number;

  @ForeignKey(() => Group)
  @Column({ type: DataType.INTEGER })
  groupId: number;

  @BelongsTo(() => User, 'UsedBy')
  user: User;

  @BelongsTo(() => User, 'attachedBy')
  attachedByUser: User;

  @BelongsTo(() => Group)
  group: Group;

  @HasMany(() => Logging, { onDelete: 'cascade', hooks: true })
  logging: Logging[];
}
