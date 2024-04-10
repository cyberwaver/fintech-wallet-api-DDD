import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AccessModule } from '@Access/access.module';
import { SharedKernelModule } from './modules/shared-kernel/shared-kernel.module';

@Module({
  imports: [AccessModule, SharedKernelModule],
  controllers: [AppController],
})
export class AppModule {}
