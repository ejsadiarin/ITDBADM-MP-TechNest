import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from './entities/audit-log.entity';
import { CreateAuditLogDto } from './dto/create-audit-log.dto';
import { UpdateAuditLogDto } from './dto/update-audit-log.dto';

@Injectable()
export class AuditLogsService {
  constructor(
    @InjectRepository(AuditLog)
    private auditLogsRepository: Repository<AuditLog>,
  ) {}

  async create(createAuditLogDto: CreateAuditLogDto): Promise<AuditLog> {
    const auditLog = this.auditLogsRepository.create(createAuditLogDto);
    return this.auditLogsRepository.save(auditLog);
  }

  async findAll(): Promise<AuditLog[]> {
    return this.auditLogsRepository.find();
  }

  async findOne(id: number): Promise<AuditLog> {
    const auditLog = await this.auditLogsRepository.findOne({
      where: { log_id: id },
    });
    if (!auditLog) {
      throw new NotFoundException(`AuditLog with ID ${id} not found`);
    }
    return auditLog;
  }

  async update(
    id: number,
    updateAuditLogDto: UpdateAuditLogDto,
  ): Promise<AuditLog> {
    const auditLog = await this.findOne(id);
    Object.assign(auditLog, updateAuditLogDto);
    return this.auditLogsRepository.save(auditLog);
  }

  async remove(id: number): Promise<void> {
    const result = await this.auditLogsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`AuditLog with ID ${id} not found`);
    }
  }
}
