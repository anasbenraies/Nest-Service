import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Comment } from "./comment.entity";
@Entity()
export class Topic {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  title: string;

  @Column()
  description: string;

  // the comment.topic is a way to access the topic from a comment in the other side .
  @OneToMany((type)=>Comment , (comment)=>comment.topic)
  comments:Comment[]
}
