import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Order, OrderDocument } from './schemas/order.schema';
import { CartService } from '../carts/carts.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private readonly order: Model<OrderDocument>,
    private readonly cartService: CartService, // Inject the CartService directly
  ) {}

 
  async createOrderFromCart(userId: string, paymentMethod: string): Promise<OrderDocument> {
    // 1. Fetch the user's active cart records
    const cart = await this.cartService.getOrCreateCart(userId);
    if (!cart || cart.items.length === 0) {
      throw new BadRequestException('Cannot create an order from an empty cart.');
    }

    let totalAmount = 0;
   const orderItems: any[] = [];

    // Map cart contents out into frozen order records
    for (const item of cart.items) {
      const populatedProduct = item.product as any; // Loaded via cart population
      
      if (!populatedProduct) {
        throw new NotFoundException(`Product database link missing for item.`);
      }

      const itemPrice = populatedProduct.price || 0; 
      const itemTotal = itemPrice * item.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        product: populatedProduct._id,
        quantity: item.quantity,
        selectedColor: item.selectedColor,
        selectedSize: item.selectedSize,
        priceAtPurchase: itemPrice, 
      } as any);
    }
    const newOrder = new this.order({
      user: new Types.ObjectId(userId),
      items: orderItems,
      totalAmount,
      paymentMethod,
      status: 'PENDING',
    });

    const savedOrder = await newOrder.save();
    await this.cartService.clearCart(userId);

    return savedOrder;
  }

  
  async getUserOrders(userId: string): Promise<OrderDocument[]> {
    return this.order
      .find({ user: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .exec();
  }
}