import {
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBody,
  ApiHeader,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { GetTicketResponse } from '../ticket/dto/get-ticket.response';
import { GetFutureResponse } from './dto/get-future-response';
import { FutureService } from './future.service';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';
import { AddTicketRequest } from '../ticket/dto/add-ticket.request';
import { AddFutureTitleRequest } from './dto/add-future-title-request';
import { AddFutureTitleResponse } from './dto/add-future-title-response';
import { AddDream, AddTitle } from '../common/decorators/user.decorator';
import { GetDreamResponse } from './dto/get-dream.response';
import { AddDreamRequest } from './dto/add-dream.request';
import { TouchTicketResponse } from '../ticket/dto/touch-ticket.response';
import { TouchDreamResponse } from './dto/touch-dream.response';
import {DeleteDreamResponse} from "./dto/delete-dream.response";

@Controller('future')
@ApiTags('future')
export class FutureController {
  constructor(private readonly futureService: FutureService) {}

  @ApiResponse({
    status: 1000,
    description: '성공',
    type: GetFutureResponse,
  })
  @ApiResponse({
    status: 4000,
    description: '서버 에러',
  })
  @UseGuards(JwtAuthGuard)
  @ApiHeader({
    description: 'jwt token',
    name: 'x-access-token',
    example: 'JWT TOKEN',
  })
  @ApiOperation({ summary: '미래의 나 조회' })
  @Get()
  async getFuture(@Request() req, @Headers('x-access-token') accessToken) {
    return await this.futureService.retrieveFuture(req, accessToken);
  }

  @ApiResponse({
    status: 1000,
    description: '성공',
    type: AddFutureTitleResponse,
  })
  @ApiResponse({
    status: 4000,
    description: '서버 에러',
  })
  @UseGuards(JwtAuthGuard)
  @ApiHeader({
    description: 'jwt token',
    name: 'x-access-token',
    example: 'JWT TOKEN',
  })
  @ApiOperation({ summary: '미래의 나 제목 등록' })
  @ApiBody({ description: 'Future ', type: AddFutureTitleRequest })
  @Patch()
  async createFutureTitle(
    @Request() req,
    @Headers('x-access-token') accessToken,
    @AddTitle() addFutureTitleRequest: AddFutureTitleRequest,
  ) {
    return await this.futureService.createFutureTitle(
      req,
      accessToken,
      addFutureTitleRequest,
    );
  }

  @ApiResponse({
    status: 1000,
    description: '성공',
    type: GetDreamResponse,
  })
  @ApiResponse({
    status: 4000,
    description: '서버 에러',
  })
  @UseGuards(JwtAuthGuard)
  @ApiHeader({
    description: 'jwt token',
    name: 'x-access-token',
    example: 'JWT TOKEN',
  })
  @ApiOperation({ summary: '상상해보기 조회' })
  @Get('/dream')
  async getDreaming(@Request() req, @Headers('x-access-token') accessToken) {
    return await this.futureService.retrieveDream(req, accessToken);
  }

  @ApiResponse({
    status: 1000,
    description: '성공',
    type: GetDreamResponse,
  })
  @ApiResponse({
    status: 4000,
    description: '서버 에러',
  })
  @UseGuards(JwtAuthGuard)
  @ApiHeader({
    description: 'jwt token',
    name: 'x-access-token',
    example: 'JWT TOKEN',
  })
  @ApiOperation({ summary: '상상해보기 등록' })
  @ApiBody({ description: 'Dream ', type: AddDreamRequest })
  @Post('/dream')
  async createDreaming(
    @Request() req,
    @Headers('x-access-token') accessToken,
    @AddDream() addDreamRequest: AddDreamRequest,
  ) {
    return await this.futureService.createDream(
      req,
      accessToken,
      addDreamRequest,
    );
  }

  @ApiResponse({
    status: 1000,
    description: '성공',
    type: TouchDreamResponse,
  })
  @ApiResponse({
    status: 4000,
    description: '서버 에러',
  })
  @UseGuards(JwtAuthGuard)
  @ApiHeader({
    description: 'jwt token',
    name: 'x-access-token',
    example: 'JWT TOKEN',
  })
  @ApiOperation({ summary: '상상해보기 터치' })
  @UseGuards(JwtAuthGuard)
  @Post('/dream/:dreamId')
  touchDream(
    @Param('dreamId') id: number,
    @Headers('x-access-token') accessToken,
  ) {
    return this.futureService.touchDream(accessToken, id);
  }

  @ApiResponse({
    status: 1000,
    description: '성공',
    type: GetDreamResponse,
  })
  @ApiResponse({
    status: 4000,
    description: '서버 에러',
  })
  @UseGuards(JwtAuthGuard)
  @ApiHeader({
    description: 'jwt token',
    name: 'x-access-token',
    example: 'JWT TOKEN',
  })
  @ApiOperation({ summary: '상상해보기 수정' })
  @ApiBody({ description: 'Dream ', type: AddDreamRequest })
  @UseGuards(JwtAuthGuard)
  @Patch('/dream/:dreamId')
  editDream(
    @Param('dreamId') id: number,
    @Headers('x-access-token') accessToken,
    @AddDream() addDreamRequest: AddDreamRequest,
  ) {
    return this.futureService.editDream(accessToken, id, addDreamRequest);
  }

  @ApiResponse({
    status: 1000,
    description: '성공',
    type: DeleteDreamResponse,
  })
  @ApiResponse({
    status: 4000,
    description: '서버 에러',
  })
  @UseGuards(JwtAuthGuard)
  @ApiHeader({
    description: 'jwt token',
    name: 'x-access-token',
    example: 'JWT TOKEN',
  })
  @ApiOperation({ summary: '상상해보기 삭제' })
  @UseGuards(JwtAuthGuard)
  @Delete('/dream/:dreamId')
  deleteDream(
    @Param('dreamId') id: number,
    @Headers('x-access-token') accessToken,
  ) {
    return this.futureService.deleteDream(accessToken, id);
  }
}
