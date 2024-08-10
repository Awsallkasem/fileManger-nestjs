import {  Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { DatabaseModule } from 'src/database/database.module';
import { DatabaseLoggerService } from './DatabaseLogger.Service';

@Module({
  imports: [
    DatabaseModule,
   
  ],
  controllers: [],
  providers: [DatabaseLoggerService],
})
export class DatabaseLoggerModule { }
