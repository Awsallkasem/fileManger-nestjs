import { Body, Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction } from "express";
import { AuthService } from "src/app/auth/auth.service";
import { User } from "src/database/models/user.model";

@Injectable()
export class AdminMiddleware implements NestMiddleware {
  constructor() { }

  async use(req, res, next: NextFunction) {

    if (!req.body.user.isAdmin ) {
      return res.status(403).json({ message: 'access denied' });
    }
    next();
  }
}