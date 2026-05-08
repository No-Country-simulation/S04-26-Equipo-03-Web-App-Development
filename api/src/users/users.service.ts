import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

// TODO: reemplazar con cliente de Supabase cuando se integre
@Injectable()
export class UsersService {
  create(createUserDto: CreateUserDto) {
    // TODO: insertar usuario en Supabase
    // const { data, error } = await supabase.from('User').insert(createUserDto).select().single();
    throw new Error('Not implemented: pendiente integración con Supabase');
  }

  findAll() {
    // TODO: obtener todos los usuarios de Supabase
    // const { data, error } = await supabase.from('User').select('*');
    throw new Error('Not implemented: pendiente integración con Supabase');
  }

  findOne(id: string) {
    // TODO: obtener usuario por id de Supabase
    // const { data, error } = await supabase.from('User').select('*').eq('id', id).single();
    throw new Error('Not implemented: pendiente integración con Supabase');
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    // TODO: actualizar usuario en Supabase
    // const { data, error } = await supabase.from('User').update(updateUserDto).eq('id', id).select().single();
    throw new Error('Not implemented: pendiente integración con Supabase');
  }

  remove(id: string) {
    // TODO: desactivar usuario en Supabase (soft delete usando active = false)
    // const { data, error } = await supabase.from('User').update({ active: false }).eq('id', id).select().single();
    throw new Error('Not implemented: pendiente integración con Supabase');
  }
}
