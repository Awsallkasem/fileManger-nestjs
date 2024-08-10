import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { validate } from 'class-validator';
import { Group } from 'src/database/models/group.model';
import { Files } from 'src/database/models/file.model';
import { User } from 'src/database/models/user.model';
import { UserGroups } from 'src/database/models/userGroups';
import { Model, Sequelize } from 'sequelize-typescript';
import { Op, Transaction } from 'sequelize';
import { Logging } from 'src/database/models/logging.model';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
    @InjectModel(Group)
    private groupModel: typeof Group,
    @InjectModel(UserGroups)
    private userGroupsModel: typeof UserGroups,
    @InjectModel(Files)
    private FileModele:typeof Files,
    @InjectModel(Logging)
    private readonly loggingModele :typeof Logging,
    private sequelize: Sequelize,
  ) {}

  async addGroup(group: Group, userId) {
    if (!group) throw new BadRequestException('group is require');
    const validationErrors = await validate(new Group(group));
    if (validationErrors.length > 0) {
      const errorMessages = validationErrors.map((error) =>
        Object.values(error.constraints),
      );
      throw new BadRequestException(errorMessages);
    }

    const newGroup = await this.groupModel.create({
      name: group.name,
      createdBy: userId,
    });
    const addUserToGroup = await this.userGroupsModel.create({
      groupId: newGroup.id,
      userId: userId,
    });
    return newGroup;
  }

  async addUserToGroup(userId: number, groupId: number) {
    const user = await this.userModel.findByPk(userId);

    if (!user) throw new NotFoundException('User not found');
    const group = await this.groupModel.findByPk(groupId);

    if (!group) throw new NotFoundException('group not found');
    const isExist=await this.userGroupsModel.findOne({where:{userId:userId,groupId:groupId}});
    if(isExist) throw new BadRequestException('user already is exist');
    const addUserToGroup = await this.userGroupsModel.create({
      groupId: groupId,
      userId: userId,
    });
    return addUserToGroup;
  }

  async removeUserFromGroup(userId: number, groupId: number) {

    return await this.sequelize.transaction(async (transaction) => {

      const group = await this.groupModel.findOne({
        where: { id: groupId },
        lock: transaction.LOCK.UPDATE,
        transaction,
      });

      if (!group) {
        throw new NotFoundException('Group not found');
      }
      const user = await this.userModel.findByPk(userId);
      if (!user) throw new NotFoundException('User not found');

      const userGroups = await this.userGroupsModel.findOne({
        where: { userId: userId, groupId: groupId },
        transaction,
      });

      if (!userGroups) throw new NotFoundException('User not found');
      await userGroups.destroy({ transaction });
      return userGroups;
    });
  }
  async updateGroup(groupName: string, id: number) {
    if (!groupName) {
      throw new BadRequestException('groupName is required');
    }
    const group = await this.groupModel.findByPk(id);
    if (!group) throw new NotFoundException('Group not found');

    const transaction = await this.sequelize.transaction({
      isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
    });
    try {
      const group = await this.groupModel.findOne({
        where: { id: id },
        transaction,
      });
      if (!group) throw new NotFoundException('Group not found');

      group.name = groupName;
      await group.save();
      await transaction.commit();
      return group;
    } catch (e) {
      await transaction.rollback();
      throw e;
    }
  }

  async deleteGroup(id: number) {
    return await this.sequelize.transaction(async (transaction) => {
      const group = await this.groupModel.findOne({
        where: { id: id },
        lock: transaction.LOCK.UPDATE,
        transaction,
      });

      if (!group) {
        throw new NotFoundException('Group not found');
      }
      await group.destroy({ transaction });
      return group;
    });
  }

  async showGroups() {
    return (await this.groupModel.findAll()) || null;
  }
  async userInGroup(id: number) {
    return (
      (await this.userGroupsModel.findAll({
        where: { groupId: id },
        include: [
          {
            model: User,
            attributes: { exclude: ['password', 'updatedAt', 'createdAt'] },
          },
        ],
      })) || null
    );
  }
  async getUsers(){
    return await this.userModel.findAll({include:[{
      model:UserGroups,
    }]});
  }
  async getFiles(){
return await this.FileModele.findAll({ include:[
  this.FileModele.associations.user,
  this.FileModele.associations.attachedByUser,
  ]});
  }
  async getAllreports(){
return await this.loggingModele.findAll(
  {include:[
    {model:User} ,
   { model:Files}
  ]}
);
  }
  async getCheckInreports(){
    return await this.loggingModele.findAll(
      {where:{action:'book'},
        include:[
        {model:User} ,
       { model:Files}
      ]}
    );
      }

      async getCheckOutreports(){
        return await this.loggingModele.findAll(
          {where:{action:'unBook'},
            include:[
            {model:User} ,
           { model:Files}
          ]}
        );
          }
}
