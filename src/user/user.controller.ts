import { Body, Controller, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import type { User } from 'src/app.service';
import { CreateUserDto, UpdateUserDto } from './createUserDto';
import { UserService } from './user.service';
import { UseJwtAuth } from 'src/auth/decorators/use-jwt-auth.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';


@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  private users: any[] = [
    { id: 1, name: 'Ravi' },
    { id: 2, name: 'anas' },
    { id: 3, name: 'Ravi' },
    { id: 4, name: 'anas' },
  ];


  /**
   * Retrieves all users.
   *
   * @returns {any[]} All users.
   */
  @UseJwtAuth()
  @Get('all')
  getAllUsers(@Req() req: Request, @CurrentUser() currentUser: any): any[] {
    console.log(`the user that requested this route is ${JSON.stringify(currentUser)}`);
    return this.users;
  }

  /** -----------------------------------------**/

  @Get('/:id')
  /**
   * Retrieves a user by its ID.
   *
   * @param {number} id The user ID.
   * @returns {User | undefined} The user if found, otherwise undefined.
   */
  getUserById(@Param('id') id: string): object | undefined {
    return this.users.find((user) => user.id === parseInt(id));
  }

  /** -----------------------------------------**/

  @Get()
  /**
   * Retrieves a defined user.
   *
   * @returns {User} A defined user.
   */
  getUser(): User {
    return {
      id: 1,
      name: 'John Doe',
    };
  }

  /** -----------------------------------------**/

  @Post()
  /**
   * Creates a new user.
   *
   * @param {User} user The user to be created.
   * @returns {User} The created user.
   */
  createUser(@Body() createUserDto: CreateUserDto) {
    const newUser = {
      id: this.users.length + 1,
      ...createUserDto,
    };
    console.log(createUserDto.email + ' / ' + createUserDto.phone);
    this.users.push(newUser);
    return newUser;
  }

  /** -----------------------------------------**/

  @Get('find/:id')
  /**
   * Finds a user by its id.
   *
   * @param {string} id The user's id.
   * @returns {User} The found user.
   */
  async findUserById(@Param('id') id: string): Promise<object | undefined> {
    return this.userService.findOne(id);
  }

  /** -----------------------------------------**/

  @Post('createU')
  /**
   * Creates a new user.
   *
   * @param {User} user The user to be created.
   * @returns {string} user created.
   */
  // createU(@Body() user: CreateUserDto): string {
  //   return this.userService.create(user);
  // }

  /** -----------------------------------------**/

  @Post('addSpecialUser')
  /**
   * Creates a new special user.
   *
   * @param {SpecialUserDto} specialUserDto The special user to be created.
   * @returns {string} Special user created.
   */
  async addSpecialUser(@Body() specialUserDto: CreateUserDto): Promise<User> {
    return await this.userService.createSpecialUser(specialUserDto);
  }

  /** -----------------------------------------**/

  @Put('update/:id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return await this.userService.update(+id, updateUserDto);
  }
}
