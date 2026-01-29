import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './CreateCommentDto';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from 'src/entities/comment.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CommentService {

    constructor(
        @InjectRepository(Comment)
        private readonly CommentRepository: Repository<Comment>,
    ) { }


    async postComment(userID: number, topicId: number, createCommentDto: CreateCommentDto) {
        const comment = this.CommentRepository.create({
            text: createCommentDto.text,   // ✅ matches entity
            user: { id: userID },          // ✅ relation object
            topic: { id: topicId },        // ✅ relation object
        });

        return await this.CommentRepository.save(comment);
    }


    async getComments(userID: number) {
        return await this.CommentRepository.find({
            where: {
                user: { id: userID }, // ✅ relation condition
            },
            relations: ['user', 'topic'], // optional but useful
            order: {
                createdAt: 'DESC',
            },
        });
    }


}
