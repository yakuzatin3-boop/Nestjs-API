import { Module } from '@nestjs/common';
import { CustomersService } from './customer.service';
import { CustomerController } from './customer.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Customer, CustomerSchema } from './schema/customer.schema';

@Module({

  imports:[
    MongooseModule.forFeature([
      {name:Customer.name, schema: CustomerSchema}
    ]),
  ],
  providers: [CustomersService],
  controllers: [CustomerController],
  exports: [CustomersService],
})
export class CustomerModule {}
