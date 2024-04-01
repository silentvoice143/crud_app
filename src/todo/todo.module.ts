import { Module } from "@nestjs/common";
import { TodoService } from "./todo.service";
import { TodoController } from "./todo.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Todo } from "./entities/todo.entity";

import { User } from "src/user/entities/user.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Todo, User])],
  controllers: [TodoController],
  providers: [TodoService],
})
export class TodoModule {}
