import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { DatabaseModule } from '../database/database.module';
import { PositionsModule } from '../positions/positions.module'; // ✅

@Module({
  imports: [
    DatabaseModule,
    forwardRef(() => PositionsModule), // ✅ prevents circular import
  ],
  // controllers removed because './users.controller' is not a module yet
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
