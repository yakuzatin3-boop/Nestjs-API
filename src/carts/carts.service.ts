import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Cart, CartDocument } from "./schemas/cart.schema";
import { AddToCartDto } from "./dto/add-to-cart.dto";

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private readonly cartModel: Model<CartDocument>,
  ) {}

  /**
   * Retrieves a customer's active shopping cart.
   * If no cart exists yet, it creates an empty one automatically.
   */
  async getOrCreateCart(userId: string): Promise<CartDocument> {
    let cart = await this.cartModel
      .findOne({ user: new Types.ObjectId(userId) })
      .populate('items.product');

    if (!cart) {
      cart = new this.cartModel({ 
        user: new Types.ObjectId(userId), 
        items: [] 
      });
      await cart.save();
    }
    return cart;
  }

  /**
   * Adds an item to the cart or increments its quantity if the exact variant exists.
   */
  async addToCart(userId: string, addToCartDto: AddToCartDto): Promise<CartDocument> {
    const { product, quantity, selectedColor, selectedSize } = addToCartDto;
    const cart = await this.getOrCreateCart(userId);

    // Look for an existing item matching the product AND variant options
    const existingItemIndex = cart.items.findIndex((item) => {
      return (
        item.product.toString() === product &&
        item.selectedColor === selectedColor &&
        item.selectedSize === selectedSize
      );
    });

    if (existingItemIndex > -1) {
      // Variant already exists -> increase its quantity count
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // New variant layout -> cast text id to Types.ObjectId and push object literal safely
      cart.items.push({
        product: new Types.ObjectId(product),
        quantity,
        selectedColor,
        selectedSize,
      } as any); // Cast as any allows seamless mapping alongside sub-schema type definitions
    }

    return cart.save();
  }

  /**
   * Directly updates the exact item quantity inside the cart (e.g., from the UI input controls).
   */
  async updateQuantity(
    userId: string,
    productId: string,
    quantity: number,
  ): Promise<CartDocument> {
    if (quantity < 1) {
      throw new BadRequestException('Quantity must be at least 1');
    }

    const cart = await this.cartModel.findOne({ user: new Types.ObjectId(userId) });
    if (!cart) throw new NotFoundException('Cart not found');

    const item = cart.items.find((i) => i.product.toString() === productId);
    if (!item) throw new NotFoundException('Product not found in cart');

    item.quantity = quantity;
    return cart.save();
  }

  /**
   * Removes a specific item variant entirely out of the shopping cart array listing.
   */
  async removeItem(userId: string, productId: string): Promise<CartDocument> {
    const cart = await this.cartModel.findOne({ user: new Types.ObjectId(userId) });
    if (!cart) throw new NotFoundException('Cart not found');

    // Filter items out based on the structural string mismatch
    cart.items = cart.items.filter((item) => item.product.toString() !== productId) as any;
    
    return cart.save();
  }

  
  async clearCart(userId: string): Promise<void> {
    await this.cartModel.updateOne(
      { user: new Types.ObjectId(userId) }, 
      { $set: { items: [] } }
    );
  }
}