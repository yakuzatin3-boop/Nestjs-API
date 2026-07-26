import { 
  Controller, 
  Get, 
  Post, 
  Patch, 
  Delete, 
  Body, 
  Put,
  Param, 
  UseGuards, 
  HttpCode, 
  HttpStatus 
} from '@nestjs/common';
import { CartService } from './carts.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { CartDocument } from './schemas/cart.schema';
import { UpdateCartDto } from './dto/update-cart.dto';
// Import your custom global authentication guards and decorators here
// import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
// import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('carts')
// @UseGuards(JwtAuthGuard) 
// // Protects all cart endpoints; requires user to be logged in
export class CartController {
  constructor(private readonly cartService: CartService) {}

  /**
   * GET /api/v1/carts
   * Retrieves or initializes the logged-in user's shopping cart.
   */
  @Get()
  async getCart(
    // @CurrentUser('id') userId: string // 💡 Dynamic injection from your custom decorator
    @Body('userId') userId: string // 🧪 Temporary fallback for raw local testing
  ): Promise<CartDocument> {
    return this.cartService.getOrCreateCart(userId);
  }

  /**
   * POST /api/v1/carts/add
   * Adds an item variant or increments an existing listing payload.
   */
  @Post('add')
  @HttpCode(HttpStatus.OK) 
  async addToCart(
    @Body('userId') userId: string, 
    @Body() addToCartDto: AddToCartDto,
  ): Promise<CartDocument> {
    return this.cartService.addToCart(userId, addToCartDto);
  }

  /**
   * PATCH /api/v1/carts/update-quantity/:productId
   * Directly updates the counter total of a product matching criteria.
   */
  @Patch('update-quantity/:productId')
  async updateQuantity(
    @Body('userId') userId: string,
    @Param('productId') productId: string,
    @Body('quantity') quantity: number,
  ): Promise<CartDocument> {
    return this.cartService.updateQuantity(userId, productId, quantity);
  }

  /**
   * DELETE /api/v1/carts/remove/:productId
   * Strips an entire product listing item out of the active schema array block.
   */
  @Delete('remove/:productId')
  async removeItem(
    @Body('userId') userId: string,
    @Param('productId') productId: string,
  ): Promise<CartDocument> {
    return this.cartService.removeItem(userId, productId);
  }


@Put(':id')
async updateCart(
  @Param('id') cartId: string,
  @Body() updateCartDto: UpdateCartDto,
): Promise<CartDocument> {
  return this.cartService.updateCart(cartId, updateCartDto);
}
  /**
   * DELETE /api/v1/carts/clear
   * Wipes the entire inventory item list clean (used post-checkout).
   */
  @Delete('clear')
  @HttpCode(HttpStatus.NO_CONTENT) // Returns 204 No Content for successful empty actions
  async clearCart(@Body('userId') userId: string): Promise<void> {
    return this.cartService.clearCart(userId);
  }
}