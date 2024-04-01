import { Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User } from "./entities/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const user = this.userRepository.create(createUserDto);
    await this.userRepository.save(user);
    return "user added successfully";
  }

  async findAll() {
    const users = await this.userRepository.find();
    const userData = users.filter((item) => delete item.password);
    return userData;
  }

  async findOne(id: number) {
    // console.log(id);
    const user = await this.userRepository.findOne({ where: { id } });
    delete user.password;
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const userToUpdate = await this.userRepository.findOne({ where: { id } });
    if (!userToUpdate) {
      throw new Error("User not found");
    }

    const updatedUser = Object.assign(userToUpdate, updateUserDto);
    await this.userRepository.save(updatedUser);
    return `This action updates a #${id} user`;
  }

  async remove(id: number) {
    const userToRemove = await this.userRepository.findOne({ where: { id } });
    if (!userToRemove) {
      throw new Error("User not found");
    }

    await this.userRepository.remove(userToRemove);

    return `This action removes a #${id} user`;
  }
}
