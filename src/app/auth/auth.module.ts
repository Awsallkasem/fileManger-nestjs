import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from '../../database/models/user.model';
import { SequelizeModule } from '@nestjs/sequelize';

import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [
    DatabaseModule,
    JwtModule.register({
      secret: 'your-secret-key',
      signOptions: { expiresIn: '1h' },
    }),

  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule { }
