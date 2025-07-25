import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum CurrencyCode {
  PHP = 'PHP',
  USD = 'USD',
  KRW = 'KRW',
}

export enum CurrencySymbol {
  PHP = '₱',
  USD = '$',
  KRW = '₩',
}

@Entity('currencies')
export class Currency {
  @PrimaryGeneratedColumn()
  currency_id: number;

  @Column({ type: 'enum', enum: CurrencyCode, unique: true })
  currency_code: CurrencyCode;

  @Column({ type: 'enum', enum: CurrencySymbol })
  symbol: CurrencySymbol;

  @Column('decimal', { precision: 10, scale: 4 })
  exchange_rate_to_usd: number;
}