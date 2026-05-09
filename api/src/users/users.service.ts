import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { Database } from '../types/database.types';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

type UserRow = Database['public']['Tables']['User']['Row'];

@Injectable()
export class UsersService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async create(createUserDto: CreateUserDto) {
    const client = this.supabaseService.getClient();
    const { first_name, last_name, email, password, role } = createUserDto;

    const { data, error } = await client.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name,
          last_name,
          role,
          active: true,
        },
      },
    });

    if (error) throw new InternalServerErrorException(error.message);

    return {
      message: 'Usuario creado exitosamente',
      userId: data.user?.id,
    };
  }

  async findAll(): Promise<UserRow[]> {
    const client = this.supabaseService.getClient();
    const { data, error } = (await client
      .from('User')
      .select('*')
      .eq('active', true)) as {
      data: UserRow[] | null;
      error: any;
    };

    if (error) throw new InternalServerErrorException(error.message);
    return data ?? [];
  }

  async findOne(id: string): Promise<UserRow | null> {
    const client = this.supabaseService.getClient();
    const { data, error } = (await client
      .from('User')
      .select('*')
      .eq('id', id)
      .eq('active', true)
      .single()) as { data: UserRow | null; error: any };

    if (error)
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    return data;
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserRow | null> {
    await this.findOne(id);
    const client = this.supabaseService.getClient();
    const { password, ...rest } = updateUserDto;

    if (password) {
      const { error: authError } = await client.auth.admin.updateUserById(id, {
        password,
      });
      if (authError) throw new InternalServerErrorException(authError.message);
    }

    const { data, error } = (await client
      .from('User')
      .update(rest)
      .eq('id', id)
      .select()
      .single()) as { data: UserRow | null; error: any };

    if (error) throw new InternalServerErrorException(error.message);
    return data;
  }

  async deactivate(id: string): Promise<UserRow | null> {
    await this.findOne(id);
    const client = this.supabaseService.getClient();
    const { data, error } = (await client
      .from('User')
      .update({ active: false })
      .eq('id', id)
      .select()
      .single()) as { data: UserRow | null; error: any };

    if (error) throw new InternalServerErrorException(error.message);
    return data;
  }

  async remove(id: string): Promise<{ message: string }> {
    const client = this.supabaseService.getClient();
    const { error } = await client.auth.admin.deleteUser(id);
    if (error) throw new InternalServerErrorException(error.message);
    return { message: 'Usuario eliminado exitosamente' };
  }
}
