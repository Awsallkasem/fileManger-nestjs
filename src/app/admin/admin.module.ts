import { decodeTokenMiddleware } from 'src/middlewares/authrization/decodeToken.middleware';
import { AdminService } from './admin.service';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AdminMiddleware } from 'src/middlewares/authrization/admin.middleware';
import { JwtModule } from '@nestjs/jwt';
import { DatabaseModule } from 'src/database/database.module';
import { AdminController } from './admin.controller';
import { AuthService } from '../auth/auth.service';

@Module({
  imports: [
    DatabaseModule,
    JwtModule.register({
      secret: 'your-secret-key',
      signOptions: { expiresIn: '1h' },
    }),

  ],
  
  controllers: [AdminController],
  providers: [AdminService, AuthService,decodeTokenMiddleware, AdminMiddleware],
})
export class AminModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(decodeTokenMiddleware)
      .forRoutes('api/admin')
      .apply(AdminMiddleware)
      .forRoutes('api/admin/*');
  }
}
