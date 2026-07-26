import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Customer, CustomerDocument } from './schema/customer.schema';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomersService {
  constructor(
    @InjectModel(Customer.name)
    private readonly customerModel: Model<CustomerDocument>,
  ) {}

  async create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
    const existingEmail = await this.customerModel.findOne({
      email: createCustomerDto.email,
    });
    if (existingEmail) {
      throw new ConflictException('Customer with this email already exists');
    }

    const existingUser = await this.customerModel.findOne({
      userId: new Types.ObjectId(createCustomerDto.userId),
    });
    if (existingUser) {
      throw new ConflictException(
        'Customer profile already exists for this User',
      );
    }

    const customer = new this.customerModel({
      ...createCustomerDto,
      userId: new Types.ObjectId(createCustomerDto.userId),
    });

    return await customer.save();
  }

  async findAll(query?: {
    search?: string;
    isActive?: boolean;
  }): Promise<Customer[]> {
    const filter: Record<string, any> = {};

    if (query?.search) {
      filter.$or = [
        { firstName: { $regex: query.search, $options: 'i' } },
        { lastName: { $regex: query.search, $options: 'i' } },
        { email: { $regex: query.search, $options: 'i' } },
      ];
    }

    if (query?.isActive !== undefined) {
      filter.isActive = query.isActive;
    }

    return await this.customerModel
      .find(filter)
      .populate('userId', 'email role isActive') // Populates user details
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(id: string): Promise<Customer> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid customer ID');
    }

    const customer = await this.customerModel
      .findById(id)
      .populate('userId', 'email role isActive')
      .exec();

    if (!customer) {
      throw new NotFoundException(`Customer with ID "${id}" not found`);
    }

    return customer;
  }

  async findByUserId(userId: string): Promise<Customer> {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Invalid user ID');
    }

    const customer = await this.customerModel
      .findOne({ userId: new Types.ObjectId(userId) })
      .populate('userId', 'email role isActive')
      .exec();

    if (!customer) {
      throw new NotFoundException(
        `Customer record for User ID "${userId}" not found`,
      );
    }

    return customer;
  }

  async update(
    id: string,
    updateCustomerDto: UpdateCustomerDto,
  ): Promise<Customer> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid customer ID');
    }

    const updatedCustomer = await this.customerModel
      .findByIdAndUpdate(
        id,
        {
          ...updateCustomerDto,
          ...(updateCustomerDto.userId && {
            userId: new Types.ObjectId(updateCustomerDto.userId),
          }),
        },
        { new: true },
      )
      .exec();

    if (!updatedCustomer) {
      throw new NotFoundException(`Customer with ID "${id}" not found`);
    }

    return updatedCustomer;
  }

  async remove(id: string): Promise<{ message: string }> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid customer ID');
    }

    const result = await this.customerModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Customer with ID "${id}" not found`);
    }

    return { message: 'Customer profile deleted successfully' };
  }
}
