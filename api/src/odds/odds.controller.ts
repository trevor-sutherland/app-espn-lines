import { Controller, Get } from '@nestjs/common';
import { OddsService } from './odds.service';

@Controller('odds')
export class OddsController {
  constructor(private readonly oddsService: OddsService) {}

  @Get('nfl/current-week')
  async getNflCurrentWeekOdds() {
    const { rows } = await this.oddsService.fetchNflMainlines();
    console.log(rows);
    return rows;
  }
}
