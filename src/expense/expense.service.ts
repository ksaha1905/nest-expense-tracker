import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';

@Injectable()
export class ExpenseService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateExpenseDto) {
    return this.prisma.expense.create({
      data: {
        title: dto.title,
        amount: dto.amount,
        categoryId: dto.categoryId,
        date: dto.date ? new Date(dto.date) : new Date(),
        userId,
      },
      include: { category: true },
    });
  }

  async findAll(userId: string) {
    return this.prisma.expense.findMany({
      where: { userId },
      include: { category: true },
      orderBy: { date: 'desc' },
    });
  }

  async findOne(userId: string, id: string) {
    const expense = await this.prisma.expense.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!expense) throw new NotFoundException('Expense not found');
    if (expense.userId !== userId) throw new ForbiddenException('Access denied');

    return expense;
  }

  async getSummary(userId: string) {
  const expenses = await this.prisma.expense.findMany({
    where: { userId },
    include: { category: true },
  });

  // total
  const total = expenses.reduce((sum, e) => sum + Number(e.amount), 0);

  // by category
  const byCategory = expenses.reduce((acc, e) => {
    const name = e.category.name;
    acc[name] = (acc[name] || 0) + Number(e.amount);
    return acc;
  }, {} as Record<string, number>);

  // by month
  const byMonth = expenses.reduce((acc, e) => {
    const month = e.date.toISOString().slice(0, 7); // "2024-01"
    acc[month] = (acc[month] || 0) + Number(e.amount);
    return acc;
  }, {} as Record<string, number>);

  return {
    total,
    byCategory,
    byMonth,
  };
}

  async update(userId: string, id: string, dto: UpdateExpenseDto) {
    await this.findOne(userId, id); // ownership check

    return this.prisma.expense.update({
      where: { id },
      data: {
        ...dto,
        date: dto.date ? new Date(dto.date) : undefined,
      },
      include: { category: true },
    });
  }

  async remove(userId: string, id: string) {
    await this.findOne(userId, id); // ownership check
    return this.prisma.expense.delete({ where: { id } });
  }
}