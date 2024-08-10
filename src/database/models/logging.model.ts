import { Model, Table, Column, DataType, HasMany, PrimaryKey, AutoIncrement, HasOne, BelongsTo, ForeignKey } from 'sequelize-typescript';
import { Files } from './file.model';
import { User } from './user.model';




@Table({ tableName: 'logging' })
export class Logging extends Model<Logging>  {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id: number;
  
    @Column({ type: DataType.STRING })
    action: string;
    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER, allowNull: false })
    userId: number;
  
    @BelongsTo(() => User)
    user: User;
  
    @ForeignKey(() => Files)
    @Column({ type: DataType.INTEGER, allowNull: false })
    fileId: number;
  
    @BelongsTo(() => Files)
    file: Files;
  

}