import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './CreateCommentDto';
import { AuthGuard } from '@nestjs/passport';
import { UseJwtAuth } from 'src/auth/decorators/use-jwt-auth.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';

@Controller('comment')
export class CommentController {

    constructor(private readonly commentService: CommentService) { }

    @Post('post_comment/:UserId/:TopicId')
    async postComment(@Param('UserId') userID: number, @Param('TopicId') topicId: number, @Body() createCommentDto: CreateCommentDto) {
        return await this.commentService.postComment(userID,topicId, createCommentDto);
    }

    @UseJwtAuth()
    @Get('get_comment/:userId')
    async getComments(@CurrentUser() currentUser: any,@Param('userId') userID: number) {
        //the sub contains the id of the user from user.req
        if (currentUser.sub !== userID) throw new Error('Unauthorized');
        return await this.commentService.getComments(userID);
    }


}
