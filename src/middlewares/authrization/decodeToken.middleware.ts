import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { AuthService } from 'src/app/auth/auth.service';

@Injectable()

export class decodeTokenMiddleware implements NestMiddleware {
  constructor(private readonly authService: AuthService) { }

  async use(req, res: Response, next: NextFunction) {
    const token = req.headers.authorization;
    
    const decodedToken = this.authService.decodeToken(token);
    if (!decodedToken) {
      return res.status(403).json({ message: 'access denied' })
    }

    const user = await this.authService.findByEmail(decodedToken.email);

    if(!user){
      return res.status(404).json({message:'user not found'});
    }

    req.body.user = user;


    next();
  }
}