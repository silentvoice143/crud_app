import { Test, TestingModule } from "@nestjs/testing";
import { UserService } from "./user.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { Repository } from "typeorm";

describe("UserService", () => {
  let service: UserService;
  let userRepository: Repository<User>;

  const REPOSITORY_TOKEN = getRepositoryToken(User);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: REPOSITORY_TOKEN,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(REPOSITORY_TOKEN);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("Userrepository should be defined", () => {
    expect(userRepository).toBeDefined();
  });

  it("should find user by id", async () => {
    const userId = 1;
    const user = {
      id: userId,
      username: "TestUser",
      email: "satyamkr",
      password: "djkhfkjddjl",
      todos: [],
    };
    jest.spyOn(userRepository, "findOne").mockResolvedValue(user);

    const result = await service.findOne(userId);

    expect(userRepository.findOne).toHaveBeenCalledWith({
      where: { id: userId },
    });
    expect(result).toEqual(user);
  });

  it("should update user by id", async () => {
    const userId = 1;
    const updateUserDto = { username: "Updated Name" };
    const userToUpdate = {
      id: userId,
      username: "TestUser",
      email: "satyamkr",
      password: "djkhfkjddjl",
      todos: [],
    };

    // Mocking
    jest.spyOn(userRepository, "findOne").mockResolvedValue(userToUpdate);

    // Call the update method
    await service.update(userId, updateUserDto);

    // Check if findOne was called with the correct parameters
    expect(userRepository.findOne).toHaveBeenCalledWith({
      where: { id: userId },
    });

    // Check if save was called with the updated user
    expect(userRepository.save).toHaveBeenCalledWith({
      ...userToUpdate,
      ...updateUserDto,
    });
  });

  it("should throw error if user to update is not found", async () => {
    const userId = 1;
    const updateUserDto = { username: "Updated Name" };

    // Mocking
    jest.spyOn(userRepository, "findOne").mockResolvedValue(null);

    // Expecting update method to throw an error
    await expect(service.update(userId, updateUserDto)).rejects.toThrowError(
      "User not found",
    );
  });

  it("should remove the user by id", async () => {
    const userId = 1;
    const userToRemove = {
      id: userId,
      username: "TestUser",
      email: "satyamkr",
      password: "djkhfkjddjl",
      todos: [],
    };
    jest.spyOn(userRepository, "findOne").mockResolvedValue(userToRemove);
    await service.remove(userId);

    // Check if findOne was called with the correct parameters
    expect(userRepository.findOne).toHaveBeenCalledWith({
      where: { id: userId },
    });

    //check if remove called with user found

    expect(userRepository.remove).toHaveBeenCalledWith(userToRemove);
  });

  it("should throw error if user to update is not found", async () => {
    const userId = 1;
    const userToRemove = {
      id: userId,
      username: "TestUser",
      email: "satyamkr",
      password: "djkhfkjddjl",
      todos: [],
    };

    // Mocking
    jest.spyOn(userRepository, "findOne").mockResolvedValue(null);

    //throw error
    await expect(service.remove(userId)).rejects.toThrowError("User not found");
  });
});
