import { Injectable } from '@nestjs/common';

 export type User = {
    id: number;
    name: string;
  }

@Injectable()
export class AppService {

 
  private users: User[] = [
    {id:1, name:"Ravi"},
    {id:2, name:"anas"},
    {id:3, name:"Ravi"},
  ]


  /**
   * Returns a greeting message.
   *
   * @returns {string} A greeting message.
   */
  getHelloMessage(): string {
    return 'Hello World!';
  }

  /**
   * Returns all users.
   *
   * @returns {User[]} All users.
   */
  getAllUsers(): User[] {
    return this.users;
  }

}
