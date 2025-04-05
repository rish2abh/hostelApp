import { UserRole } from '../../entities/user.entity';
import { Types } from 'mongoose';

export interface AuthUser {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  phoneNumber?: string;
  assignedRooms?: string[];
} 