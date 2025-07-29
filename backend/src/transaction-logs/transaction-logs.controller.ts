import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { TransactionLogsService } from './transaction-logs.service';
import { CreateTransactionLogDto } from './dto/create-transaction-log.dto';
import { UpdateTransactionLogDto } from './dto/update-transaction-log.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('transaction-logs')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class TransactionLogsController {
  constructor(
    private readonly transactionLogsService: TransactionLogsService,
  ) {}

  @Post()
  create(@Body() createTransactionLogDto: CreateTransactionLogDto) {
    return this.transactionLogsService.create(createTransactionLogDto);
  }

  @Get()
  findAll() {
    return this.transactionLogsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transactionLogsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTransactionLogDto: UpdateTransactionLogDto,
  ) {
    return this.transactionLogsService.update(+id, updateTransactionLogDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.transactionLogsService.remove(+id);
  }
}
