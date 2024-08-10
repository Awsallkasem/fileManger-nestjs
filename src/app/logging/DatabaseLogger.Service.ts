// database-logger.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { InjectRepository } from '@nestjs/typeorm';
import { Sequelize } from 'sequelize';
import { Logging } from 'src/database/models/logging.model';
import { Repository } from 'typeorm';

@Injectable()
export class DatabaseLoggerService extends Logger {
  constructor(
    @InjectModel(Logging)
    private readonly logModele: typeof Logging,
    private sequelize: Sequelize,
  ) {
    super();
  }

  async log(message: string) {
    const pattern = /userId:(\d+) fileId:(\d+) action:(\w+)/;
    const match = pattern.exec(message);
    const [, userId, fileId, action] = match;
    super.log(match);

    if (match) {

      await this.logModele.create({
        action: action,
        userId: parseInt(userId),
        fileId: parseInt(fileId),
      });
    }
  }
}
