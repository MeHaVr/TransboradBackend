import { Module } from '@nestjs/common';
import { VehiclesService } from './vehicles.service.js';

@Module({
  providers: [VehiclesService]
})
export class VehiclesModule {}
