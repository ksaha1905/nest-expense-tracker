import {
  Controller, Get, Post, Patch, Delete,
  Body, Param, UseGuards,
} from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('expenses')
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  @Post()
  create(@CurrentUser() user, @Body() dto: CreateExpenseDto) {
    return this.expenseService.create(user.id, dto);
  }

  @Get()
  findAll(@CurrentUser() user) {
    return this.expenseService.findAll(user.id);
  }
  @Get('summary')
getSummary(@CurrentUser() user) {
  return this.expenseService.getSummary(user.id);
}

  @Get(':id')
  findOne(@CurrentUser() user, @Param('id') id: string) {
    return this.expenseService.findOne(user.id, id);
  }

  @Patch(':id')
  update(@CurrentUser() user, @Param('id') id: string, @Body() dto: UpdateExpenseDto) {
    return this.expenseService.update(user.id, id, dto);
  }

  @Delete(':id')
  remove(@CurrentUser() user, @Param('id') id: string) {
    return this.expenseService.remove(user.id, id);
  }
}