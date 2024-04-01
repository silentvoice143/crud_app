import { IsEmail, IsEmpty, IsString } from "class-validator";

export class UserDataDto {
  @IsString()
  username: string;

  @IsEmail()
  email: string;
}
