import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsModule } from './products/products.module';
import { BrandsModule } from './brands/brands.module';
import { CategoriesModule } from './categories/categories.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { OrdersModule } from './orders/orders.module';
import { CartsModule } from './carts/carts.module';
import { PaymentsModule } from './payments/payments.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      inject:[ConfigService],
      useFactory:(configService:ConfigService)=>({
        uri: configService.get<string>('MONGODB_URI'),
        onConnectionCreate: (connection)=>{
          console.log('MongoDB connect successfully Ah poy!');
          console.log(`Database : ${connection.name}`);
          console.log('Host     :', connection.host);
          return connection;
        }
      })
    }),

    ProductsModule,

    BrandsModule,

    CategoriesModule,

    UsersModule,
    AuthModule,
    OrdersModule,
    CartsModule,
    PaymentsModule
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {

}
