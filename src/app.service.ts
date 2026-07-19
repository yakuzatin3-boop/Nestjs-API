import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Soy, Bong Slanh Soy😊(Pii bong IT smos)';
  }
}
