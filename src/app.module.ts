import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AccessModule } from '@Access/access.module';
import { ConfigModule } from '@nestjs/config';
import { moduleLoad } from './config/index.config';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, load: moduleLoad }), AccessModule],
  controllers: [AppController],
})
export class AppModule {}
