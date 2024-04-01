import { Test, TestingModule } from "@nestjs/testing";
import { TodoService } from "./todo.service";
import { Repository } from "typeorm";
import { Todo } from "./entities/todo.entity";
import { getRepositoryToken } from "@nestjs/typeorm";
import { User } from "../user/entities/user.entity";

describe("TodoService", () => {
  let service: TodoService;
  let todoRepository: Repository<Todo>;
  let userRepository: Repository<User>;

  const todoRepositoryToken = getRepositoryToken(Todo);
  const userRepositoryToken = getRepositoryToken(User);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodoService,
        {
          provide: todoRepositoryToken,
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            remove: jest.fn(),
          },
        },
        {
          provide: userRepositoryToken,
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TodoService>(TodoService);
    todoRepository = module.get<Repository<Todo>>(todoRepositoryToken);
    userRepository = module.get<Repository<User>>(userRepositoryToken);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should create a new todo and associate it with the user", async () => {
    const userId = 1;
    const userWithTodos: User = {
      id: userId,
      username: "testUser",
      email: "test@example.com",
      password: "password123",
      todos: [], // Initialize todos array
    };

    const createTodoDto = {
      id: 1,
      title: "goodmorning",
      user: userWithTodos,
    };

    const createdTodo: Todo = {
      id: 1,
      title: "goodmorning",
      user: userWithTodos,
    };

    // Mock the push function on the todos array
    const pushMock = jest.fn();
    userWithTodos.todos.push = pushMock;

    jest.spyOn(userRepository, "findOne").mockResolvedValue(userWithTodos);
    jest.spyOn(todoRepository, "create").mockReturnValue(createdTodo);

    const result = await service.create(userId, createTodoDto);

    expect(userRepository.findOne).toHaveBeenCalledWith({
      where: { id: userId },
      relations: ["todos"],
    });
    expect(todoRepository.create).toHaveBeenCalledWith(createTodoDto);
    expect(todoRepository.save).toHaveBeenCalledWith(createdTodo);
    expect(pushMock).toHaveBeenCalledWith(createdTodo);
    expect(userRepository.save).toHaveBeenCalledWith(userWithTodos);
    expect(result).toEqual("This action adds a new todo");
  });

  it("find all todo of a user", async () => {
    const userId = 1;
    const userWithTodos = {
      id: userId,
      username: "testUser",
      email: "test@example.com",
      password: "password123",
      todos: [
        { id: 1, title: "todo1", user: null },
        { id: 2, title: "todo2", user: null },
      ], // Mock user with todos
    };

    jest.spyOn(userRepository, "find").mockResolvedValue([userWithTodos]);

    const result = await service.findAll(userId);

    expect(userRepository.find).toHaveBeenCalledWith({
      where: { id: userId },
      relations: ["todos"],
    });

    expect(result).toEqual([{ todos: userWithTodos.todos }]);
  });

  it("should remove a todo if it exists and belongs to the user", async () => {
    const todoId = 1;
    const userId = 1;
    const todo = { id: todoId, title: "morning", user: null };
    const user = {
      id: userId,
      username: "hdjdj",
      email: "dkjfldkj",
      password: "password123",
      todos: [],
    };

    jest.spyOn(userRepository, "findOne").mockResolvedValue(user);
    jest.spyOn(todoRepository, "findOne").mockResolvedValue(todo);

    const result = await service.remove(todoId, userId);

    expect(userRepository.findOne).toHaveBeenCalledWith({
      where: { id: userId },
      relations: ["todos"],
    });
    expect(todoRepository.findOne).toHaveBeenCalledWith({
      where: { id: todoId },
    });
    expect(todoRepository.remove).toHaveBeenCalledWith(todo);
    expect(result).toEqual(`This action removes a #${todoId} todo`);
  });

  it("should return a message if user does not exist", async () => {
    const userId = 1;
    const todoId = 1;
    const todo = { id: todoId, title: "morning", user: null };
    jest.spyOn(userRepository, "findOne").mockResolvedValue(undefined);
    jest.spyOn(todoRepository, "findOne").mockResolvedValue(todo);
    // Simulate user not found

    const result = await service.remove(1, userId);

    expect(result).toEqual("user not found");
  });
});
