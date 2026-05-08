import { UserRole } from '../enums/user-role.enum';

export class UpdateUserDto {
  first_name?: string;
  last_name?: string;
  email?: string;
  password?: string;
  role?: UserRole;
  active?: boolean;
}
