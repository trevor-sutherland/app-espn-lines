// status/status.controller.ts
import {
  Controller,
  Get,
  Query,
  Req,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { PicksService } from '../picks/picks.service';

@Controller('status')
@UseGuards(JwtAuthGuard) // returns req.user or null
export class StatusController {
  constructor(private readonly picks: PicksService) {}

  @Get()
  get(
    @Req() req: { user?: { userId: string } },
    @Query('season') season?: string,
    @Query('week') week?: string,
  ) {
    const loggedIn = !!req.user;
    if (!loggedIn) return { loggedIn: false, hasPick: false };
    if (!season || !week)
      throw new BadRequestException('season and week are required');
    // const hasPick = await this.picks.hasPick(req.user!.userId, +season, +week);
    return { loggedIn: true, hasPick: false };
  }
}
