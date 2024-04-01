import { IsString, isString } from "class-validator";

export class CreateUserDto {
  @IsString()
  username: string;

  @IsString()
  email: string;
}
