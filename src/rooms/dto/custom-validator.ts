import {
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
    registerDecorator,
    ValidationOptions,
  } from 'class-validator';
  import { Injectable } from '@nestjs/common';
  import { InjectModel } from '@nestjs/mongoose';
  import { Model } from 'mongoose';
  import { Room } from 'src/entities/room.entity'; // Adjust path
  
  @ValidatorConstraint({ async: true })
  @Injectable()
  export class IsRoomNumberUniqueConstraint implements ValidatorConstraintInterface {
    constructor(@InjectModel(Room.name) private readonly roomModel: Model<Room>) {}
  
    async validate(roomNumber: string, args: ValidationArguments) {
      const existingRoom = await this.roomModel.findOne({ roomNumber }).exec();
      return !existingRoom; // Returns false if the room number already exists
    }
  
    defaultMessage(args: ValidationArguments) {
      return `Room number ${args.value} is already in use.`;
    }
  }
  
  // ✅ Correct way to use it as a decorator function
  export function IsRoomNumberUnique(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
      registerDecorator({
        target: object.constructor,
        propertyName: propertyName,
        options: validationOptions,
        constraints: [],
        validator: IsRoomNumberUniqueConstraint,
      });
    };
  }
  