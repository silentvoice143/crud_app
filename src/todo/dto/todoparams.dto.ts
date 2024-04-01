import { IsNotEmpty, IsUUID } from "class-validator";

export class TodoParamsDto {
  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  todoId: string;
}
