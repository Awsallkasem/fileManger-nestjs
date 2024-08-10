import { Module } from '@nestjs/common';
import { databaseProviders } from './database.providers';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './models/user.model';
import { Files } from './models/file.model';
import { Group } from './models/group.model';
import { UserGroups } from './models/userGroups';
import { Logging } from './models/logging.model';


@Module({
  imports:[SequelizeModule.forFeature([User,Files,Group,UserGroups,Logging])],
  providers: [...databaseProviders],
  exports: [...databaseProviders,SequelizeModule],
})
export class DatabaseModule { }