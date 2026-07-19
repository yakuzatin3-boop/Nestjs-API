import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
// 1. Correctly import the official class definitions from the SDK
import { BakongKHQR, MerchantInfo, khqrData } from 'bakong-khqr';
import { Payment, PaymentDocument } from './schemas/payment.schema';

@Injectable()
export class PaymentsService {
  private readonly bakongBaseUrl = 'https://api-bakong.nbc.gov.kh'; 

  constructor(
    @InjectModel(Payment.name) private readonly paymentModel: Model<PaymentDocument>,
    private readonly httpService: HttpService,
  ) {}

  async generateKHQR(orderId: string, amount: number, currency: 'USD' | 'KHR'): Promise<PaymentDocument> {
    // Map standard currency strings to official SDK internal numbers (USD = 840, KHR = 116)
    const activeCurrency = currency === 'KHR' ? khqrData.currency.khr : khqrData.currency.usd;

    // Configure the merchant info layout expected by the SDK
    // Syntax parameters: bankAccountId, merchantName, merchantCity, merchantId, acquiringBank, optionalData
    const merchantInfo = new MerchantInfo(
      process.env.BAKONG_ACCOUNT_ID || 'developer@devb',
      process.env.BAKONG_MERCHANT_NAME || 'VUTHIN SHOP NOW',
      'Phnom Penh',
      undefined, // Optional: Your unique Merchant ID registered at the bank
      undefined, // Optional: Acquiring Bank Identifier
      {
        currency: activeCurrency,
        amount: amount,
      }
    );

    // Run the official generator process
    const khqrResponse = BakongKHQR.generateMerchant(merchantInfo);

    // Check if execution succeeded 
    if (khqrResponse.status && khqrResponse.status.code !== 0) {
      throw new BadRequestException(`Failed to generate secure KHQR payload: ${khqrResponse.status.message}`);
    }

    // Extract the raw string layout and matching tracking MD5 hash provided by the SDK
    const qrRawString = khqrResponse.data?.qr;
    const transactionId = khqrResponse.data?.md5;

    if (!qrRawString || !transactionId) {
      throw new BadRequestException('Failed to extract valid KHQR credentials from response.');
    }

    const newPayment = new this.paymentModel({
      orderId: new Types.ObjectId(orderId),
      transactionId,
      amount,
      currency,
      status: 'PENDING',
      qrRawString,
    });

    return newPayment.save();
  }

  
// Verifies payment state transactions natively with the NBC API
   
  async verifyTransactionStatus(transactionId: string): Promise<PaymentDocument> {
    const payment = await this.paymentModel.findOne({ transactionId });
    if (!payment) {
      throw new NotFoundException('Transaction record not found.');
    }

    if (payment.status === 'COMPLETED') {
      return payment;
    }

    try {
      const response = await firstValueFrom(
        this.httpService.post(
          `${this.bakongBaseUrl}/v1/check_transaction_by_md5`,
          { md5: transactionId },
          {
            headers: {
              Authorization: `Bearer ${process.env.BAKONG_TOKEN}`,
              'Content-Type': 'application/json',
            },
          },
        ),
      );

      // responseCode 0 means successful transaction settlement at NBC
      if (response.data?.responseCode === 0) {
        payment.status = 'COMPLETED';
        await payment.save();
      }
      
      return payment;
    } catch (error) {
      if (error instanceof Error) {
        console.log('Bakong verification log error:', error.message);
      } else {
        console.log('An unexpected error occurred:', error);
      }
      throw new BadRequestException('Failed to clear transaction against the Bakong Gateway.');
    }
  }
}