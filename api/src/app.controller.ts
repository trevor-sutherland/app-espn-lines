import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {
    console.log('Loaded AppController:', __filename);
    console.log('AppService injected:', !!appService);
  } // ✅ Correct for controllers

  @Get('hello')
  getHello(): string {
    return this.appService.getHello();
  }
}
