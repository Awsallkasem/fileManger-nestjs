import { Sequelize } from 'sequelize-typescript';
import { User } from 'src/database/models/user.model';
import { Files } from './models/file.model';
import { UserGroups } from './models/userGroups';
import { Group } from './models/group.model';
import { Logging } from './models/logging.model';


export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      const sequelize = new Sequelize({
        dialect: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'file',
        password: 'file',
        database: 'file',
        logging:false
      });

      sequelize.addModels([User,Files,Group,UserGroups,Logging]);
      await sequelize.sync();
      return sequelize;
    },
  },
];
