import { decodeTokenMiddleware } from 'src/middlewares/authrization/decodeToken.middleware';
import { UserController } from './User.controller';
import { UserService } from './User.service';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { JwtModule } from '@nestjs/jwt';
import { AdminService } from '../admin/admin.service';
import { AuthService } from '../auth/auth.service';
import { DatabaseLoggerModule } from '../logging/DatabaseLogger.Module';
import { DatabaseLoggerService } from '../logging/DatabaseLogger.Service';

@Module({
  imports: [
    DatabaseModule,
    JwtModule.register({
      secret: 'your-secret-key',
      signOptions: { expiresIn: '1h' },
    }),
    DatabaseLoggerModule,
  ],
  controllers: [UserController],
  providers: [
    UserService,
    DatabaseLoggerService,
    AuthService,
    decodeTokenMiddleware,
  ],
})
export class UserModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(decodeTokenMiddleware).forRoutes('api/user');
  }
}
