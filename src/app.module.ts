import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { HealthModule } from './health/health.module';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';
import { ExpenseModule } from './expense/expense.module';


@Module({
  imports: [PrismaModule, HealthModule, AuthModule, CategoryModule, ExpenseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
