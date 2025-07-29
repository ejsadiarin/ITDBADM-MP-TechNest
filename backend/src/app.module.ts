import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';
import { InventoryModule } from './inventory/inventory.module';
import { CartModule } from './cart/cart.module';
import { CartItemsModule } from './cart-items/cart-items.module';
import { OrdersModule } from './orders/orders.module';
import { OrderItemsModule } from './order-items/order-items.module';
import { TransactionLogsModule } from './transaction-logs/transaction-logs.module';
import { CurrenciesModule } from './currencies/currencies.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Make the config module available globally
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST') || 'localhost',
        port: Number(configService.get<string>('DB_PORT')) || 3306,
        username: configService.get<string>('DB_USERNAME') || 'root',
        password: configService.get<string>('DB_PASSWORD') || 'pass',
        database: configService.get<string>('DB_DATABASE') || 'technest_db',
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: false,
      }),
    }),
    ProductsModule,
    UsersModule,
    CategoriesModule,
    InventoryModule,
    CartModule,
    CartItemsModule,
    OrdersModule,
    OrderItemsModule,
    TransactionLogsModule,
    CurrenciesModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
