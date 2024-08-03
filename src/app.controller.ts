import { Controller, Get, Param, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { runInSandbox } from './utils/sandbox.util';
import Problems from './interface/problems.interface';
import doTest from './interface/doTest.interface';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  async runTest(@Body() bd: doTest, @Param('lang') lang: String) {
    return this.appService.runTest(bd, lang);
  }
}
