import { Controller, Post, Param, Body, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiProperty, ApiParam } from '@nestjs/swagger';
import { AppService } from './app.service';
import { runInSandbox } from './utils/sandbox.util';
import Problems from './interface/problems.interface';
import { runTestDto } from './dto/runTest.dto';
import doTest from './interface/doTest.interface';

@ApiTags("Judger API")
@Controller()
export class AppController {
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
    return this.appService.runTest(bd);
  }
}
