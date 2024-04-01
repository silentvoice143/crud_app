import { IsNotEmpty, IsNumber } from "class-validator";
export class CreateTodoDto {
  @IsNotEmpty()
  title: string;
}
