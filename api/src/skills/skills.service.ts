import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import type { Database } from '../types/database.types';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';

type SkillRow = Database['public']['Tables']['Skill']['Row'];

@Injectable()
export class SkillsService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async findAll(): Promise<SkillRow[]> {
    const client = this.supabaseService.getClient();
    const { data, error } = await client
      .from('Skill')
      .select('*')
      .order('title');

    if (error) throw new InternalServerErrorException(error.message);
    return data ?? [];
  }

  async findOne(id: string): Promise<SkillRow> {
    const client = this.supabaseService.getClient();
    const { data, error } = await client
      .from('Skill')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw new InternalServerErrorException(error.message);
    if (!data) throw new NotFoundException(`Skill con id ${id} no encontrada`);
    return data;
  }

  async create(dto: CreateSkillDto): Promise<SkillRow> {
    const client = this.supabaseService.getClient();
    const { data, error } = await client
      .from('Skill')
      .insert({ title: dto.title, type: dto.type })
      .select()
      .single();

    if (error) throw new InternalServerErrorException(error.message);
    return data;
  }

  async update(id: string, dto: UpdateSkillDto): Promise<SkillRow> {
    const client = this.supabaseService.getClient();
    const { data, error } = await client
      .from('Skill')
      .update({ ...dto })
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error) throw new InternalServerErrorException(error.message);
    if (!data) throw new NotFoundException(`Skill con id ${id} no encontrada`);
    return data;
  }

  async remove(id: string): Promise<void> {
    const client = this.supabaseService.getClient();
    const { error, count } = await client
      .from('Skill')
      .delete({ count: 'exact' })
      .eq('id', id);

    if (error) throw new InternalServerErrorException(error.message);
    if (count === 0)
      throw new NotFoundException(`Skill con id ${id} no encontrada`);
  }
}
