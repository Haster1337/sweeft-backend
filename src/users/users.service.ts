import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.model';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private userReporository: typeof User) {}

  async createUser(dto: CreateUserDto) {
    const user = await this.userReporository.create(dto);
    return user;
  }

  async getAllUsers() {
    const users = await this.userReporository.findAll();
    return users;
  }

  async getUserById(id: number) {
    const user = await this.userReporository.findOne({
      where: { id },
      include: { all: true },
    });
    return user;
  }

  async getUserByEmail(email: string) {
    const user = await this.userReporository.findOne({
      where: { email },
      include: { all: true },
    });
    return user;
  }


}
