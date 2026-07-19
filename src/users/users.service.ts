import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schemas/user.schema';
import { UserDocument } from './schemas/user.schema';
import { PaginationDto } from '../common/dto/pagination.dto'; // Imported PaginationDto

@Injectable()
export class UsersService {

  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}


  // Create new user
  async create(
    createUserDto: CreateUserDto
  ): Promise<User> {

    const user = new this.userModel({
      ...createUserDto,
    });

    return await user.save();
  }


  // 🔴 UPDATED: Get all users with Pagination and Metadata
  async findAll(paginationDto: PaginationDto): Promise<{ data: User[]; meta: any }> {
    const { page = 1, limit = 10 } = paginationDto;
    
    // Calculate how many documents to skip
    const skip = (page - 1) * limit;

    // Run data fetching and count queries simultaneously for optimal speed
    const [data, total] = await Promise.all([
      this.userModel
        .find()
        .skip(skip)
        .limit(limit)
        .select('-password') // 🔒 Security: Exclude passwords
        .exec(),
      this.userModel.countDocuments().exec(),
    ]);

    return {
      data,
      meta: {
        totalItems: total,
        itemCount: data.length,
        itemsPerPage: limit,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
      },
    };
  }


  // Find user by id
  async findOne(
    id: string
  ): Promise<User> {

    const user = await this.userModel
      .findById(id)
      .select('-password')
      .exec();

    if (!user) {
      throw new NotFoundException(
        'User not found'
      );
    }

    return user;
  }


  // Find user by email
  // Used for login
  async findByEmail(
    email: string
  ): Promise<User | null> {

    return await this.userModel
      .findOne({
        email
      })
      .exec();
  }


  // Find Google user
  async findByGoogleId(
    googleId: string
  ): Promise<User | null> {

    return await this.userModel
      .findOne({
        googleId
      })
      .exec();
  }


  // Find Facebook user
  async findByFacebookId(
    facebookId: string
  ): Promise<User | null> {

    return await this.userModel
      .findOne({
        facebookId
      })
      .exec();
  }


  // Update user
  async update(
    id: string,
    updateUserDto: UpdateUserDto
  ): Promise<User> {

    const user = await this.userModel
      .findByIdAndUpdate(
        id,
        updateUserDto,
        {
          new: true
        }
      )
      .select('-password')
      .exec();

    if (!user) {
      throw new NotFoundException(
        'User not found'
      );
    }

    return user;
  }


  // Delete user
  async remove(
    id: string
  ): Promise<User> {

    const user = await this.userModel
      .findByIdAndDelete(id)
      .exec();

    if (!user) {
      throw new NotFoundException(
        'User not found'
      );
    }

    return user;
  }


  // Activate / deactivate user
  async updateStatus(
    id: string,
    isActive: boolean
  ): Promise<User> {

    const user = await this.userModel
      .findByIdAndUpdate(
        id,
        {
          isActive
        },
        {
          new: true
        }
      )
      .exec();

    if (!user) {
      throw new NotFoundException(
        'User not found'
      );
    }

    return user;
  }
}