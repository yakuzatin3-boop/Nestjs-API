import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CartController } from './carts.controller';
import { CartService } from './carts.service';
import { Cart, CartSchema } from './schemas/cart.schema';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Cart.name, schema: CartSchema }]),
    ProductsModule, // Gives Cart access to ProductsService
  ],
  controllers: [CartController],
  providers: [CartService],
  exports: [CartService], 
})
export class CartsModule {}