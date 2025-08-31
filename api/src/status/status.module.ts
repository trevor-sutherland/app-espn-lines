import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StatusService } from './status.service';
import { StatusController } from './status.controller';
import { Pick, PickSchema } from '../picks/picks.schema';
import { PicksModule } from '../picks/picks.module'; // <-- Import PicksModule

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Pick.name, schema: PickSchema }]),
    PicksModule,
  ],
  controllers: [StatusController],
  providers: [StatusService],
  exports: [StatusService],
})
export class StatusModule {}
