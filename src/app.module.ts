import { UserModule } from './app/user/User.module';
import { UserController } from './app/user/User.controller';
import { AminModule } from './app/admin/admin.module';
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { sequelizeConfig } from './config/sequelize.config';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './app/auth/auth.module';
import { FileModule } from './app/file/file.module';

@Module({
  imports: [
    
    UserModule,
    SequelizeModule.forRoot(sequelizeConfig),
    DatabaseModule,
    AuthModule,
    FileModule,
    AminModule,
    UserModule,
  ],
  controllers: [],
})
export class AppModule {}
