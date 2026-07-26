import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';

import { Order, OrderSchema } from './schemas/order.schema';

import { Customer, CustomerSchema } from '../customer/schema/customer.schema';

import { CartsModule } from '../carts/carts.module';


@Module({
  imports: [

    MongooseModule.forFeature([
      {
        name: Order.name,
        schema: OrderSchema,
      },
      {
        name: Customer.name,
        schema: CustomerSchema,
      },
    ]),

    CartsModule,

  ],

  controllers: [
    OrdersController
  ],

  providers: [
    OrdersService
  ],

  exports: [
    OrdersService
  ],
})
export class OrdersModule {}