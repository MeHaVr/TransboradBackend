import { Module } from '@nestjs/common';
import { BoardService } from './board.service.js';
import { BoardController } from './board.controller.js';

@Module({
  providers: [BoardService],
  controllers: [BoardController]
})
export class BoardModule {}
