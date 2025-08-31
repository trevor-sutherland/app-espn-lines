import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OddsModule } from './odds/odds.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { EventsModule } from './events/events.module';
import { PicksModule } from './picks/picks.module';
import { CommonModule } from './common/common.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AppMailerModule } from './mailer/mailer.module';
import { StatusModule } from './status/status.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.MONGO_URI || 'mongodb://localhost:27017/espn-lines',
    ),
    ConfigModule.forRoot({ isGlobal: true }),
    OddsModule,
    AuthModule,
    UsersModule,
    EventsModule,
    PicksModule,
    CommonModule,
    AppMailerModule,
    StatusModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
