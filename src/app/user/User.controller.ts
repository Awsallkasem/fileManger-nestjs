/*
https://docs.nestjs.com/controllers#controllers
*/

import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Request,
  Response,
  UseFilters,
} from '@nestjs/common';
import { UserService } from './User.service';
import { Body } from '@nestjs/common';
import { HttpExceptionFilter } from 'src/filters/global-exception.filter';
@UseFilters(HttpExceptionFilter)
@Controller('api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/showGroups')
  async showGroups(@Request() req, @Response() res) {
    const data = await this.userService.showGroups(req.body.user.id);
    if (!data) throw new NotFoundException('No groups found');
    return res.status(201).json({ date: data });
  }
  @Get('/getFiles/')
  async getFiles(@Response() res) {
    const Files = await this.userService.getFiles();

    return res.status(200).json({ data: Files });
  }

  @Post('/bookFile/:fileId')
  async bookFile(
    @Request() req,
    @Response() res,
    @Param('fileId') fileId: string,
  ) {
    const file = await this.userService.bookFile(
      parseInt(fileId),
      req.body.user.id,
    );

    return res.status(200).json({ data: file });
  }
  @Post('/bookFiles')
  async bookFiles(
    @Request() req,
    @Response() res,
    @Body('fileId') fileId: [number],
  ) {
    const file = await this.userService.bookFiles(fileId, req.body.user.id);

    return res.status(200).json({ data: file });
  }

  @Post('/unBookFiles')
  async unBookFiles(
    @Request() req,
    @Response() res,
    @Body('fileId') fileId: [number],
  ) {
    const file = await this.userService.UnbookFiles(fileId, req.body.user.id);

    return res.status(200).json({ data: file });
  }
  @Post('/unBookFile/:fileId')
  async unBookFile(
    @Request() req,
    @Response() res,
    @Param('fileId') fileId: string,
  ) {
    const file = await this.userService.unBookFile(
      parseInt(fileId),
      req.body.user.id,
    );

    return res.status(200).json({ data: file });
  }

  @Get('/showMyBookedFile/:groupId')
  async showMyBookedFile(@Request() req, @Response() res,@Param('groupId') groupId:string) {
    const data=await this.userService.showMyBookedFile(req.body.user.id,parseInt(groupId));
    return res.status(200).json({ data: data });

  }
}
