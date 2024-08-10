import { Controller, Injectable, Get } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';

import { User } from './database/models/user.model';
import { get } from 'http';

@Injectable()
@Controller()

export class UserService {
  constructor(private readonly sequelize: Sequelize) { }
  @Get()
  async getAllUsers(): Promise<any> {
    return this.sequelize.models.User.findAll();
  }

  // Other methods...
}
