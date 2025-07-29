import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const queryRunner =
      this.usersRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

      const newUser = queryRunner.manager.create(User, {
        ...createUserDto,
        password_hash: hashedPassword,
        role: createUserDto.role,
      });

      const savedUser = await queryRunner.manager.save(newUser);
      await queryRunner.commitTransaction();
      return savedUser;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { user_id: id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findOneByUsernameOrEmail(usernameOrEmail: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
    });
    if (!user) {
      throw new NotFoundException(
        `User with username or email ${usernameOrEmail} not found`,
      );
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const queryRunner =
      this.usersRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const user = await this.findOne(id);
      const updatedUser = this.usersRepository.create({
        ...user,
        ...updateUserDto,
      });
      const savedUser = await queryRunner.manager.save(updatedUser);
      await queryRunner.commitTransaction();
      return savedUser;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: number): Promise<void> {
    const queryRunner =
      this.usersRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const user = await this.findOne(id);
      await queryRunner.manager.remove(user);
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}

