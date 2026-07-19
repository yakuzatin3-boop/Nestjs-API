import { Controller, Post, Body, Param, Patch, HttpCode, HttpStatus } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentDocument } from './schemas/payment.schema';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

//   
  @Post('generate')
  @HttpCode(HttpStatus.CREATED)
  async createPaymentQR(
    @Body('orderId') orderId: string,
    @Body('amount') amount: number,
    @Body('currency') currency: 'USD' | 'KHR',
  ): Promise<PaymentDocument> {
    return this.paymentsService.generateKHQR(orderId, amount, currency);
  }

  @Patch('verify/:txId')
  async verifyPayment(@Param('txId') transactionId: string): Promise<PaymentDocument> {
    return this.paymentsService.verifyTransactionStatus(transactionId);
  }
}