import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../users/user.schema';
import * as argon2 from 'argon2';
import * as crypto from 'crypto';
import { MailerService } from '@nestjs-modules/mailer';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    private mailerService: MailerService,
    private jwtService: JwtService,
  ) {}

  async createUser(email: string, password: string, displayName?: string) {
    // Check if user already exists
    const existing = await this.userModel.findOne({ email });
    if (existing) throw new ConflictException('Email already in use');

    // Hash the password
    const passwordHash = await argon2.hash(password);

    // Create and save the user
    const user = new this.userModel({ email, passwordHash, displayName });
    await user.save();
    return { email: user.email, displayName: user.displayName, id: user._id };
  }

  // Example: Find a user by email
  async findByEmail(email: string) {
    return this.userModel.findOne({ email }).exec();
  }

  // Example: Update a user's display name
  async updateDisplayName(userId: string, displayName: string) {
    return this.userModel
      .findByIdAndUpdate(userId, { displayName }, { new: true })
      .exec();
  }

  async login(email: string, password: string): Promise<{ jwtToken: string }> {
    const user = await this.userModel.findOne({ email });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    // Compare password using argon2.verify
    const validPass = await argon2.verify(user.passwordHash, password);
    if (!validPass) throw new UnauthorizedException('Invalid credentials');
    const payload = { email: user.email, sub: user._id };
    return {
      jwtToken: await this.jwtService.signAsync(payload),
    };
  }

  async sendPasswordResetEmail(email: string) {
    const user = await this.userModel.findOne({ email });
    if (!user) return;

    // Generate token and expiry
    const token = crypto.randomBytes(32).toString('hex');
    user.resetToken = token;
    user.resetTokenExpires = new Date(Date.now() + 1000 * 60 * 60); // 1 hour
    this.mailerService
      .sendMail({
        to: email,
        from: 'no-reply@app-espn-lines.com',
        subject: 'Password Reset ESPN Lines App',
        template: 'password-reset',
        context: {
          url: `http://localhost:3000/auth/reset-password?token=${token}`,
        },
      })
      .then(() => {})
      .catch(() => {});
  }

  async resetPassword(email: string, token: string, password: string) {
    const user = await this.userModel.findOne({ email, resetToken: token });
    if (
      !user ||
      !user.resetTokenExpires ||
      user.resetTokenExpires < new Date()
    ) {
      throw new UnauthorizedException('Invalid or expired reset token');
    }
    user.passwordHash = await argon2.hash(password);
    user.resetToken = undefined;
    user.resetTokenExpires = undefined;
    await user.save();
  }
}
