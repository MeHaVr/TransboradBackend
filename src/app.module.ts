import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { TransportModule } from './transport/transport.module.js';
import { VehiclesModule } from './vehicles/vehicles.module.js';
import { BoardModule } from './board/board.module.js';
import { SchedulerModule } from './scheduler/scheduler.module.js';

@Module({
  imports: [TransportModule, VehiclesModule, BoardModule, SchedulerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
