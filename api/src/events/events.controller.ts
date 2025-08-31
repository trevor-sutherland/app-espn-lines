import { Controller, Get } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventDto } from './dto/event.dto';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get('nfl')
  async getNflEvents(): Promise<EventDto[]> {
    return this.eventsService.getNflEvents();
  }
}
