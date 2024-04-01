import { Injectable } from "@nestjs/common";
import { CreateTodoDto } from "./dto/create-todo.dto";
import { UpdateTodoDto } from "./dto/update-todo.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Todo } from "./entities/todo.entity";
import { Repository } from "typeorm";
import { User } from "../user/entities/user.entity";
import { TodoParamsDto } from "./dto/todoparams.dto";

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo) private readonly todoRepository: Repository<Todo>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    // private readonly userService: UserService,
  ) {}
  async create(userId: number, createTodoDto: CreateTodoDto) {
    // console.log(userId);
    const todo = this.todoRepository.create(createTodoDto);
    await this.todoRepository.save(todo);
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ["todos"],
    });
    console.log(user);
    user.todos.push(todo);
    console.log(user);
    await this.userRepository.save(user);
    return "This action adds a new todo";
  }

  async findAll(userId: number) {
    console.log("userid", userId);
    const user = await this.userRepository.find({
      where: { id: userId },
      relations: ["todos"],
    });
    console.log(user);
    // Map each user to an object containing user information and todos
    const usersTodos = user.map((user) => ({
      todos: user.todos,
    }));

    return usersTodos;
  }

  async findOne(params: TodoParamsDto) {
    console.log(params);
    const userId = +params.userId;
    const todoId = +params.todoId;
    const todo = await this.todoRepository.findOne({ where: { id: todoId } });
    return todo;
  }

  async update(id: number, updateTodoDto: UpdateTodoDto) {
    console.log(id, updateTodoDto);
    const todo = await this.todoRepository.findOne({ where: { id: id } });

    if (!todo) {
      return "there is no todo to update";
    }

    Object.assign(todo, updateTodoDto);
    // Save the updated todo to the database
    await this.todoRepository.save(todo);
    return `This action updates a #${id} todo`;
  }

  async remove(todoId: number, userId: number) {
    const todo = await this.todoRepository.findOne({ where: { id: todoId } });
    if (!todo) {
      return "there is no todo to update";
    }

    this.todoRepository.remove(todo);

    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ["todos"],
    });

    if (!user) {
      // Handle case where the user with the given ID doesn't exist
      // e.g., throw an exception, return null, etc.
      return "user not found";
    }

    // Remove the todo with the specified ID from the user's todos array
    user.todos = user.todos.filter((todo) => todo.id !== todoId);

    // Save the updated user record back to the database
    await this.userRepository.save(user);

    await this.todoRepository.remove(todo);
    return `This action removes a #${todoId} todo`;
  }
}
