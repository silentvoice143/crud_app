import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UserDataDto } from "./user.dto";
import { UserService } from "../user/user.service";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post("register")
  register(@Body() userData: UserDataDto) {
    return this.authService.register(userData);
  }

  @Post("login")
  login(@Body() userData) {
    return this.authService.login(userData);
  }
}
