import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../user/entities/user.entity";
import { Repository } from "typeorm";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    // private readonly userService: UserService,
  ) {}

  async register(userData) {
    const password = userData.password;
    const hashedPassword = await bcrypt.hash(password, 10);
    userData.password = hashedPassword;
    // console.log(userData);
    const user = this.userRepository.create(userData);
    // console.log(user);
    await this.userRepository.save(user);
    return "user registered successfully";
  }

  async login(userData) {
    const password = userData.password;
    const username = userData.username;
    const user = await this.userRepository.findOne({
      where: { username: username },
    });

    if (!user) {
      return "user not found";
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return "password incorrect";
    }
    delete user.password;
    const token = this.generateToken(user);
    return token;
  }

  async generateToken(user) {
    const payload = {
      user,
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
    };
    return await jwt.sign(payload, process.env.SECRET_KEY);
  }
}
