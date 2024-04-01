import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { User } from "../user/entities/user.entity";
import { Repository } from "typeorm";
import { getRepositoryToken } from "@nestjs/typeorm";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";

describe("AuthService", () => {
  let service: AuthService;
  let userRepository: Repository<User>;

  const mockUserRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getRepositoryToken(User), useValue: mockUserRepository },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("register", () => {
    it("should hash password, create user, and save user", async () => {
      // Mock bcrypt.hash
      const mockHash = "hashed_password";
      // jest.spyOn(bcrypt, "hash").mockResolvedValue(mockHash);
      jest
        .spyOn(bcrypt, "hash")
        .mockImplementation(async (password: string, saltOrRounds: number) => {
          return mockHash;
        });

      // Mock userRepository.create
      const mockUserData = { username: "test_user", password: "test_password" };
      const mockUser = new User();
      mockUser.username = mockUserData.username;
      mockUser.password = mockHash;
      mockUserRepository.create.mockReturnValue(mockUser);

      // Call the register method
      const result = await service.register(mockUserData);

      // Assertions
      // expect(bcrypt.hash).toHaveBeenCalledWith(mockUserData.password, 10);
      expect(userRepository.create).toHaveBeenCalledWith(mockUserData);
      expect(userRepository.save).toHaveBeenCalledWith(mockUser);
      expect(result).toBe("user registered successfully");
    });
  });

  describe("login", () => {
    it("should return token if login is successful", async () => {
      // Mock bcrypt.compare
      const mockPassword = "test_password";
      const mockUser = new User();
      mockUser.password = await bcrypt.hash(mockPassword, 10);
      mockUserRepository.findOne.mockResolvedValue(mockUser);

      // Call the login method
      const result = await service.login({
        username: "test_user",
        password: mockPassword,
      });

      // Assertions
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { username: "test_user" },
      });
      expect(result).toEqual(expect.any(String));
    });

    it('should return "user not found" if user is not found', async () => {
      // Mock userRepository.findOne to return undefined
      mockUserRepository.findOne.mockResolvedValue(undefined);

      // Call the login method
      const result = await service.login({
        username: "nonexistent_user",
        password: "test_password",
      });

      // Assertions
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { username: "nonexistent_user" },
      });
      expect(result).toBe("user not found");
    });

    it('should return "password incorrect" if password is incorrect', async () => {
      // Mock userRepository.findOne to return a user with a different password
      const mockUser = new User();
      mockUser.password = await bcrypt.hash("different_password", 10);
      mockUserRepository.findOne.mockResolvedValue(mockUser);

      // Call the login method
      const result = await service.login({
        username: "test_user",
        password: "test_password",
      });

      // Assertions
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { username: "test_user" },
      });
      expect(result).toBe("password incorrect");
    });
  });

  describe("generateToken", () => {
    it("should generate a valid JWT token", async () => {
      // Mock jwt.sign
      const mockUser = new User();
      mockUser.username = "test_user";
      const mockPayload = { user: mockUser, exp: expect.any(Number) };
      const mockToken = "mock_token";
      jest.spyOn(jwt, "sign").mockReturnValue(mockToken);

      // Call the generateToken method
      const result = await service.generateToken(mockUser);

      // Assertions
      expect(jwt.sign).toHaveBeenCalledWith(
        mockPayload,
        process.env.SECRET_KEY,
      );
      expect(result).toBe(mockToken);
    });
  });
});
