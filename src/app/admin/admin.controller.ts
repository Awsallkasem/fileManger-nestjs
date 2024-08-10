/*
https://docs.nestjs.com/controllers#controllers
*/

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
  Response,
  UseFilters,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { HttpExceptionFilter } from 'src/filters/global-exception.filter';
import { Group } from 'src/database/models/group.model';
import { NotFoundException } from '@nestjs/common';

@UseFilters(HttpExceptionFilter)
@Controller('api/admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}
  @Post('/addGroup')
  async addGroup(@Request() req, @Response() res, @Body('group') group: Group) {
    const data = await this.adminService.addGroup(group, req.body.user.id);
    return res.status(201).json({ date: data });
  }

  @Put('/updateGroup/:id')
  async updateGroup(
    @Request() req,
    @Response() res,
    @Body('groupName') groupName: string,
    @Param('id') id: string,
  ) {
    const data = await this.adminService.updateGroup(groupName, parseInt(id));
    return res.status(201).json({ date: data });
  }

  @Delete('/deleteGroup/:groupId')
  async deleteGroup(
    @Request() req,
    @Response() res,
    @Param('groupId') groupId: string,
  ) {
    const data = await this.adminService.deleteGroup(parseInt(groupId));
    return res.status(200).json({ date: data });
  }

  @Get('/showGroups')
  async showGroups(@Request() req, @Response() res) {
    const data = await this.adminService.showGroups();
    if (!data) throw new NotFoundException('No groups found');
    return res.status(201).json({ date: data });
  }
  @Post('/addUserToGroup/:userId')
  async addUserToGroup(
    @Request() req,
    @Response() res,
    @Body('groupId') groupId: number,
    @Param('userId') userId: string,
  ) {
    const data = await this.adminService.addUserToGroup(parseInt(userId), groupId);
    return res.status(201).json({ date: data });
  }

  @Post('/removeUserFromGroup/:userId')
  async removeUserFromGroup(
    @Request() req,
    @Response() res,
    @Body('groupId') groupId: number,

    @Param('userId') userId: string,
  ) {
    console.log(groupId);
    
    const data = await this.adminService.removeUserFromGroup(
      parseInt(userId),
      groupId,
    );
    return res.status(201).json({ date: data });
  }

  @Get('/showUsersinGroup/:groupId')
  async showUsersinGroup(
    @Request() req,
    @Response() res,
    @Param('groupId') groupId: string,
  ) {
    const data = await this.adminService.userInGroup(parseInt(groupId));
    if (!data) throw new NotFoundException('No groups found');
    return res.status(200).json({ data: data });
  }
  @Get('/getUsers/')
  async getUsers(@Response() res){
const users= await this.adminService.getUsers();    

return res.status(200).json({data:users})
  }
  @Get('/getFiles/')
  async getFiles(@Response() res){
const Files= await this.adminService.getFiles();    

return res.status(200).json({data:Files})
  }
  @Get('/getAllReports/')
  async getAllreports(@Response() res){
const Files= await this.adminService.getAllreports();    

return res.status(200).json({data:Files})
  }
  
  @Get('/getChekInReports/')
  async getCheckInreports(@Response() res){
const Files= await this.adminService.getCheckInreports();    

return res.status(200).json({data:Files})
}

@Get('/getCheckOutReports/')
async getCheckOutreports(@Response() res){
const Files= await this.adminService.getCheckOutreports();    

return res.status(200).json({data:Files})
}
}
