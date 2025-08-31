import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Pick, PickDocument } from '../picks/picks.schema';

@Injectable()
export class StatusService {
  constructor(
    @InjectModel(Pick.name) private readonly PickModel: Model<PickDocument>,
  ) {}

  async hasPick(
    userId: string,
    season: number,
    week: number,
  ): Promise<boolean> {
    return !!(await this.PickModel.exists({ userId, season, week }));
  }
}
