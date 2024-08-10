import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { DatabaseModule } from 'src/database/database.module';
import { decodeTokenMiddleware } from 'src/middlewares/authrization/decodeToken.middleware';
import { AuthService } from '../auth/auth.service';
import { FileService } from './file.service';
import { FileController } from './file.controller';

@Module({
  imports: [
    DatabaseModule,
    JwtModule.register({
      secret: 'your-secret-key',
      signOptions: { expiresIn: '1h' },
    }),

  ],
  controllers: [FileController],
  providers: [AuthService,FileService],
})
export class FileModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(decodeTokenMiddleware)
          .forRoutes('api/file')
        }
 }
