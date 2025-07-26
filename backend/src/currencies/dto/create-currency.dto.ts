import { IsNumber, IsEnum } from 'class-validator';
import { CurrencyCode, CurrencySymbol } from '../entities/currency.entity';

export class CreateCurrencyDto {
  @IsEnum(CurrencyCode)
  currency_code: CurrencyCode;

  @IsEnum(CurrencySymbol)
  symbol: CurrencySymbol;

  @IsNumber()
  exchange_rate_to_usd: number;
}
