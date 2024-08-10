import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { hash, compare } from 'bcrypt';
import { validate } from 'class-validator';
import { User } from 'src/database/models/user.model';
import { Files } from 'src/database/models/file.model';
import * as path from 'path';
import * as fs from 'fs';
import { UserGroups } from 'src/database/models/userGroups';
import { where } from 'sequelize';

@Injectable()
export class FileService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
    @InjectModel(Files)
    private FileModel: typeof Files,

    private readonly jwtService: JwtService,
  ) {}

  async uploadFile(file, userId: number, groupId: number) {
    if (!file) {
      throw new BadRequestException('file is require');
    }
    const user = await this.userModel.findOne({
      where: { id: userId },
      include: [{ model: UserGroups, where: { groupId: groupId } }],
    });

    const isAdmin = (await this.userModel.findByPk(userId)).isAdmin;
    if (!user && !isAdmin) {
      throw new BadRequestException('user is not in group');
    }
    const filename = `file_${Date.now()}${file.originalname}`;
    const publicFolderPath = path.join(
      'C:\\Users\\awsal\\Desktop\\free\\public',
      '..',
      'public',
    );

    let filePath = path.join(publicFolderPath, filename);

    await fs.promises.mkdir(publicFolderPath, { recursive: true });

    await fs.promises.writeFile(filePath, file.buffer);

    filePath = filePath.replace(publicFolderPath, '').replace(/\\/g, '/');

    const newFile = await this.FileModel.create({
      filePath: filePath,
      attachedBy: userId,
      groupId: groupId,
      isBlocked: false,
    });

    return true;
  }
  async deleteFile(fileId: number, userId: number) {
    const file = await this.FileModel.findByPk(fileId);
    if (!file) {
      throw new NotFoundException();
    }
    const user = await this.userModel.findByPk(userId);

    if (file.attachedBy != userId && !user.isAdmin) {
      throw new UnauthorizedException();
    }
    const publicFolderPath = path.join(
      'C:\\Users\\awsal\\Desktop\\free\\public',
      '..',
      'public',
    );

    let filePath = path.join(publicFolderPath, file.filePath);

    await fs.unlink(filePath, async (err) => {
      if (!err) {
        await file.destroy();
      } else {
        console.log(err);
        return false;
      }
    });
    return 'file deleted succss';
  }

  async updateFile(file, userId: number, fileId: number) {
    if (!file) {
      throw new BadRequestException('file is require');
    }
    const user = await this.userModel.findOne({
      where: { id: userId },
      include: [{ model: UserGroups }],
    });

    if (!user && !user.isAdmin) {
      throw new BadRequestException('user is not in group');
    }
    const filename = `file_${Date.now()}${file.originalname}`;
    const publicFolderPath = path.join(
      'C:\\Users\\awsal\\Desktop\\free\\public',
      '..',
      'public',
    );

    let filePath = path.join(publicFolderPath, filename);

    await fs.promises.mkdir(publicFolderPath, { recursive: true });

    await fs.promises.writeFile(filePath, file.buffer);

    filePath = filePath.replace(publicFolderPath, '').replace(/\\/g, '/');

    const updatedFile = await this.FileModel.findByPk(fileId);
    if (!updatedFile) {
      return new BadRequestException('file not found');
    }

    let oldfilePath = path.join(publicFolderPath, updatedFile.filePath);

    await fs.unlink(oldfilePath, async (err) => {
      if (!err) {
        updatedFile.filePath = filePath;
        updatedFile.save();

        return true;
      } else {
        console.log(err);
        return false;
      }
    });
  }

  async getFilesInGroup(groupId: number) {
    return await this.FileModel.findAll({
      where: { groupId: groupId },
      include: [
        this.FileModel.associations.user,
        this.FileModel.associations.attachedByUser,
      ],
    });
  }
}
