import { Controller, Post, Body, HttpCode, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';
import { runTestDto } from './dto/runTest.dto';

@ApiTags("Judger API")
@Controller()
export class AppController {
  private readonly logger = new Logger("App Controller");
  constructor(private readonly appService: AppService) { }

  @ApiOperation({
    summary: "제출한 답을 채점합니다.",
    description: "문제 번호, 유저 코드를 입력받고, 채점합니다."
  })
  @ApiResponse({
    status: 200,
    description: "채점 결과를 반환합니다.",
    schema: {
      properties: {
        result: {
          type: 'String',
          description: "채점 결과",
          example: "정답입니다"
        }
      }
    }
  })
  @HttpCode(200)
  @Post()
  async runTest(@Body() bd: runTestDto) {
    this.logger.log(`Judge Request From ${bd.userid} at ${Date.now().toLocaleString()} on Problem ${bd.problemNumber}`)
    return this.appService.runTest(bd);
  }
}
