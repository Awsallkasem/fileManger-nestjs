import {  BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { hash, compare } from 'bcrypt';
import { validate } from 'class-validator';
import { User } from 'src/database/models/user.model';


@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,

    private readonly jwtService: JwtService,
  ) {}



async register(user: User): Promise<{ user: User; token: string }> {
  
  const validationErrors = await validate(new User(user));
  const isExist= await this.findByEmail(user.email);
      if(isExist){
        throw new BadRequestException('email already used');
  }

      if (validationErrors.length > 0) {
        const errorMessages = validationErrors.map((error) => Object.values(error.constraints));
        throw new BadRequestException(errorMessages);
      }
  
 const saltRounds = 10;
  user.password = await hash(user.password,saltRounds);

const newUser=await this.userModel.create(user);
  const token = await this.login(user);

  return { user: newUser, token };
}



async validatePassword(email: string, password: string): Promise<User | null> {
  const user = await this.findByEmail( email);

  if (user &&await compare(password ,user.password)) {
    return user;
  }

  return null;
}

async findByEmail(email: string): Promise<User | null> {
  const user = await this.userModel.findOne({
      where:{email:email},
    });
  if(user){
    return user.dataValues;

  }
  else
  return null;

}
async login(user: User): Promise<string> {
  const payload = { email: user.email };

  return this.jwtService.sign(payload);
}

 decodeToken(token :string) {
    try {
        const decodedToken = this.jwtService.decode(token);
      return decodedToken;
    } catch (err) {
      return err;
    }
  }

  async findById(id: number): Promise<User> {
    return await this.userModel.findOne({where:{id:id}});
  }
}
