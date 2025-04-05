import { SetMetadata } from '@nestjs/common';
import { managerRole } from 'src/entities/managers.entity';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: managerRole[]) => SetMetadata(ROLES_KEY, roles); 