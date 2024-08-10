import {
  Controller,
  Post,
  Get,
  Body,
  Response,
  Request,
  UnauthorizedException,
  BadRequestException,
  UseFilters,
  Delete,
  Param,
  Req,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { HttpExceptionFilter } from 'src/filters/global-exception.filter';
import { FileService } from './file.service';
@UseFilters(HttpExceptionFilter)
@Controller('api/file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('/upload/:groupId/:userId')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file,
    @Request() req,
    @Response() res,
    @Param('groupId') groupId: string,
    @Param('userId') userId: string,
  ) {
    const upload = await this.fileService.uploadFile(
      file,
      parseInt(userId),
      parseInt(groupId),
    );
    return res.status(201).json({ isDone: upload });
  }
  @Delete('/deletFile/:fileId')
  async deleteFile(
    @Param('fileId') fileId: string,
    @Response() res,
    @Request() req,
  ) {
    const deleteFile = await this.fileService.deleteFile(
      parseInt(fileId),
      req.body.user.id,
    );
    console.log(deleteFile);

    return res.status(200).json({ isDone: deleteFile });
  }
  @Post('/updateFile/:fileId/:userId')
  @UseInterceptors(FileInterceptor('file'))
  async updateFile(
    @UploadedFile() file,
    @Request() req,
    @Response() res,
    @Param('fileId') fileId: string,
    @Param('userId') userId: string,
  ) {
    const update = await this.fileService.updateFile(
      file,
      parseInt(userId),
      parseInt(fileId),
    );
    return res.status(201).json({ isDone: update });
  }

  @Get('/getFilesInGroup/:groupId')
  async getFilesInGroup(@Param('groupId') groupId: string, @Response() res) {
    await res.status(200).json({
      data: await this.fileService.getFilesInGroup(parseInt(groupId)),
    });
  }
}
