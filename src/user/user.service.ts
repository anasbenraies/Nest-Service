import { Injectable } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './createUserDto';
import { Repository, UpdateResult } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  //------------------------------//

  /**
   * Creates a new user with the provided CreateUserDto.
   * This method uses the userRepository to create a new user with the provided name.
   * @param createUserDto The CreateUserDto object containing the user's name.
   * @returns The newly created user.
   */
  async createSpecialUser(createUserDto: CreateUserDto): Promise<User> {
    //convert the DTO into a real entity to be stored in the database
    const user = this.userRepository.create(createUserDto);
    return await this.userRepository.save(user);
  }

  //------------------------------//

  async findOne(id: string): Promise<object> {
    //const user = await this.userRepository.findOne({where:{id}});
    return {
      id: +id,
    };
  }


  /**
   * Retrieves a user by their email address.
   *
   * @param email The user's email address.
   * @returns The user if found, otherwise null.
   */
  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { email } });
  }

  //------------------------------//


  /**
   * Creates a new user with the provided CreateUserDto.
   * This method uses the userRepository to create a new user with the provided CreateUserDto.
   * @param createUserDto The CreateUserDto object containing the user's information.
   * @returns The newly created user.
   */
  async create(createUserDto: CreateUserDto): Promise<any> {

    const UserObject = this.userRepository.create(createUserDto) as User;
    const createdUser = await this.userRepository.save(UserObject);
    const { password, ...UserData } = createdUser;
    //returns user data without password
    return UserData
  }

  //------------------------------//

  async update(id: number, updateUserDto: UpdateUserDto): Promise<UpdateResult> {
    const user = this.userRepository.create({
      ...updateUserDto
    } as User);
    return await this.userRepository.update(id, user);

  }
}
