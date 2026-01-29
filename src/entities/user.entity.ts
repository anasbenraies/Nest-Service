import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  OneToMany,
  BeforeUpdate
} from 'typeorm';
import { Comment } from './comment.entity';

import * as bcrypt from 'bcrypt';

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ unique: true })
  phone: string;

  @OneToMany((type) => Comment, (comment) => comment.user)
  comments: Comment[]

  @Column({ nullable: false })
  password: string

  @Column({ nullable: true })
  refreshToken: string;

  // @BeforeInsert()
  // @BeforeUpdate()
  // async createHash(): Promise<void> {
  //   try {
  //     console.log("this is a hashing for update or Insert")
  //     const salt: string = await bcrypt.genSalt(10);
  //     this.password = await bcrypt.hash(this.password, salt);
  //   } catch (error) {
  //     throw new Error('Could not create hash for password');
  //   }
  // }

}
