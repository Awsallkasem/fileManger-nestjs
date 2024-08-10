import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Files } from 'src/database/models/file.model';
import { Group } from 'src/database/models/group.model';
import { User } from 'src/database/models/user.model';
import { UserGroups } from 'src/database/models/userGroups';
import { DatabaseLoggerService } from '../logging/DatabaseLogger.Service';
import { Logging } from 'src/database/models/logging.model';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
    @InjectModel(Group)
    private groupModel: typeof Group,
    @InjectModel(UserGroups)
    private userGroupsModel: typeof UserGroups,
    @InjectModel(Files)
    private FileModele: typeof Files,
    @InjectModel(Logging)
    private loggingModele: typeof Logging,
    private readonly logger: DatabaseLoggerService,
    private sequelize: Sequelize,
  ) {}

  async showGroups(userId: number) {
    return (
      (await this.groupModel.findAll({
        include: [
          {
            model: UserGroups,
            where: { userId: userId },
          },
        ],
      })) || null
    );
  }
  async getFiles() {
    return await this.FileModele.findAll({
      include: [
        this.FileModele.associations.user,
        this.FileModele.associations.attachedByUser,
      ],
    });
  }

  async bookFile(fileId:number,userId:number){
    return await this.sequelize.transaction(async (transaction) => {
        const file = await this.FileModele.findOne({
          where: { id: fileId },
          lock: transaction.LOCK.UPDATE,
          transaction,
        });
  
        if (!file) {
          throw new NotFoundException('file not found');
        }
        if(file.isBlocked){
            throw new BadRequestException('file already booked')
        }
         file.isBlocked=true;
         file.UsedBy=userId;
        await file.save({transaction});
        
         this.logger.log(`userId:${userId} fileId:${fileId} action:book`);       
         return file;
      });
  }

  async bookFiles(fileIds:[number],userId:number){
    return  fileIds.map( async fileId=>{
        await this.sequelize.transaction(async (transaction) => {
            const file = await this.FileModele.findOne({
              where: { id: fileId },
              lock: transaction.LOCK.UPDATE,
              transaction,
            });
      
            if (!file) {
                return  new NotFoundException('file not found');
            }
            if(file.isBlocked){
               return  new BadRequestException('file already booked')
            }
             file.isBlocked=true;
             file.UsedBy=userId;
            await file.save({transaction});
            
             this.logger.log(`userId:${userId} fileId:${fileId} action:book`);       
              });
    
        })
    
  }
  async UnbookFiles(fileIds:[number],userId:number){
    return  fileIds.map( async fileId=>{
        await this.sequelize.transaction(async (transaction) => {
            const file = await this.FileModele.findOne({
              where: { id: fileId },
              lock: transaction.LOCK.UPDATE,
              transaction,
            });
      
            if (!file) {
                return  new NotFoundException('file not found');
            }
            const user=await this.userModel.findByPk(userId);

            if(file.UsedBy!=userId&&!user.isAdmin){
                return new UnauthorizedException(' cant unbook'); 
            }
           
             file.isBlocked=false;
             file.UsedBy=null;
            await file.save({transaction});
            
             this.logger.log(`userId:${userId} fileId:${fileId} action:unbook`);       
              });
    
        })
    
  }
  async unBookFile(fileId:number,userId:number){
    return await this.sequelize.transaction(async (transaction) => {
        const file = await this.FileModele.findOne({
          where: { id: fileId },
          lock: transaction.LOCK.UPDATE,
          transaction,
        });
  const user=await this.userModel.findByPk(userId);
        if (!file) {
          throw new NotFoundException('file not found');
        }
        if(file.UsedBy!=userId&&!user.isAdmin){
            return new UnauthorizedException(' cant unbook'); 
        }
         file.isBlocked=false;
         file.UsedBy=null;
        await file.save({transaction});
        
         this.logger.log(`userId:${userId} fileId:${fileId} action:unbook`);       
         return file;
      });

  }
  async showMyBookedFile(userId,groupId){
   return await this.FileModele.findAll({where:{UsedBy:userId,groupId:groupId}, include:[
    this.FileModele.associations.user,
    this.FileModele.associations.attachedByUser,
    ]});

  }

}
