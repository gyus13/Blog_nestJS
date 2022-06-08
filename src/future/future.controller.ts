import { Controller, Delete, Get, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('future')
@ApiTags('future')
export class FutureController {
  @ApiOperation({ summary: '미래의 나 조회' })
  @Get()
  async getFuture() {
    return 'this is ticket return';
  }

  @ApiOperation({ summary: '미래의 나 등록' })
  @Post()
  async createFuture() {
    return 'create Ticket';
  }

  @ApiOperation({ summary: '미래의 나 수정' })
  @Patch()
  async updateFuture() {
    return 'create Ticket';
  }

  @ApiOperation({ summary: '미래의 나 삭제' })
  @Delete()
  async deleteFuture() {
    return 'create Ticket';
  }

  @ApiOperation({ summary: '상상 조회' })
  @Get('/dream')
  async getDreaming() {
    return 'this is ticket return';
  }

  @ApiOperation({ summary: '상상 등록' })
  @Post('/dream')
  async createDreaming() {
    return 'create Ticket';
  }
}
