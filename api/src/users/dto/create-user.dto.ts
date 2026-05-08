import { UserRole } from '../enums/user-role.enum';

export class CreateUserDto {
  first_name!: string;
  last_name!: string;
  email!: string;
  password!: string;
  role!: UserRole;
  active?: boolean;
}
