import { Controller, Post, Get, HttpCode, Body, HttpStatus  } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrderDocument } from './schemas/order.schema';
import { User } from '../users/schemas/user.schema';


@Controller('orders')
export class OrdersController {
    constructor(private orderService:OrdersService){}

    // the order checkout ah poy
    @Post('checkout')
    @HttpCode(HttpStatus.CREATED)
    async checkout(
        @Body('userId') userId:string,
        @Body('paymentMethod') paymentMethod: string,
    ): Promise<OrderDocument>{
        return this.orderService.createOrderFromCart(userId, paymentMethod);
    }

    // get the order 
    @Get('history')
    async getOrderHistory( @Body('userId') userId:string ): Promise<OrderDocument[]>{
        return this.orderService.getUserOrders(userId);
    }
}
