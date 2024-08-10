import { SequelizeModuleOptions } from '@nestjs/sequelize';

export const sequelizeConfig: SequelizeModuleOptions = {
  dialect: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'file',
  password: 'file',
  database: 'file',
  autoLoadModels: true,
  synchronize: true,
};


