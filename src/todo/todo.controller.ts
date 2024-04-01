import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { TodoService } from "./todo.service";
import { CreateTodoDto } from "./dto/create-todo.dto";
import { UpdateTodoDto } from "./dto/update-todo.dto";
import { TodoParamsDto } from "./dto/todoparams.dto";

@Controller("user/todo")
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post(":id")
  create(@Param("id") id: string, @Body() createTodoDto: CreateTodoDto) {
    console.log(id, createTodoDto);
    return this.todoService.create(+id, createTodoDto);
  }

  @Get(":id")
  findAll(@Param("id") id: string) {
    console.log(+id);
    return this.todoService.findAll(+id);
  }

  @Get(":userId/:todoId")
  findOne(@Param() params: TodoParamsDto) {
    console.log(params);
    return this.todoService.findOne(params);
  }

  @Patch(":userId/:todoId")
  update(@Param() params: TodoParamsDto, @Body() updateTodoDto: UpdateTodoDto) {
    const todoId = +params.todoId;
    return this.todoService.update(+todoId, updateTodoDto);
  }

  @Delete(":userId/:todoId")
  remove(@Param() params: TodoParamsDto) {
    const todoId = +params.todoId;
    const userId = +params.userId;
    return this.todoService.remove(todoId, userId);
  }
}
