import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";

declare module "express" {
  interface Request {
    user?: any;
  }
}

@Injectable()
export class AuthUser implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log("req coming.....");
    const token = req.headers.authorization?.split(" ")[1];
    if (token) {
      jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
          return res.status(401).json({ message: "Token is not valid" });
        } else {
          // Attach the decoded payload to the request object
          req.user = decoded;
          next();
        }
      });
    } else {
      return res.status(401).json({ message: "Token not found" });
    }
  }
}
