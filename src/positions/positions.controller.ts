import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { PositionsService } from './positions.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';

@Controller('positions')
export class PositionsController {
  constructor(private readonly positionsService: PositionsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Req() req: Request,
    @Body() body: { position_code: string; position_name: string },
  ) {
    const user = req.user as any; // comes from JwtStrategy
    console.log('Decoded JWT user:', user);

    const userId = user?.userId; // ✅ instead of user?.sub
    if (!userId) throw new Error('User ID not found in token');

    return this.positionsService.create(body.position_code, body.position_name, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll() {
    return this.positionsService.getAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getOne(@Param('id') id: number) {
    return this.positionsService.getOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: number, @Body() body: any) {
    return this.positionsService.update(id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: number) {
    return this.positionsService.delete(id);
  }
}