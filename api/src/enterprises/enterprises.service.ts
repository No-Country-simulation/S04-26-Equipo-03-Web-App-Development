import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { Database } from '../types/database.types';
import { UpdateEnterpriseDto } from './dto/update-enterprise.dto';

type EnterpriseRow = Database['public']['Tables']['Account_Enterprise']['Row'];

@Injectable()
export class EnterprisesService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async findAll(): Promise<EnterpriseRow[]> {
    const client = this.supabaseService.getClient();
    const { data, error } = (await client
      .from('Account_Enterprise')
      .select('*')
      .eq('active', true)) as { data: EnterpriseRow[] | null; error: any };

    if (error) throw new InternalServerErrorException(error.message);
    return data ?? [];
  }

  async findMyEnterprise(userId: string): Promise<EnterpriseRow> {
    const client = this.supabaseService.getClient();

    // Buscar en paralelo: como owner o como recruiter miembro
    const [ownerResult, memberResult] = await Promise.all([
      (async () =>
        (await client
          .from('Account_Enterprise')
          .select('*')
          .eq('owner_id', userId)
          .eq('active', true)
          .maybeSingle()) as { data: EnterpriseRow | null; error: any })(),
      (async () =>
        (await client
          .from('Recruiter_enterprise')
          .select('enterprise_id, Account_Enterprise(*)')
          .eq('user_id', userId)
          .eq('active', true)
          .maybeSingle()) as {
          data: {
            enterprise_id: string;
            Account_Enterprise: EnterpriseRow;
          } | null;
          error: any;
        })(),
    ]);

    if (ownerResult.data) return ownerResult.data;

    if (memberResult.data?.Account_Enterprise) {
      return memberResult.data.Account_Enterprise;
    }

    throw new NotFoundException(
      'No se encontró una empresa asociada a este usuario',
    );
  }

  async findOne(id: string): Promise<EnterpriseRow> {
    const client = this.supabaseService.getClient();
    const { data, error } = (await client
      .from('Account_Enterprise')
      .select('*')
      .eq('id', id)
      .eq('active', true)
      .single()) as { data: EnterpriseRow | null; error: any };

    if (error || !data)
      throw new NotFoundException(`Empresa con id ${id} no encontrada`);
    return data;
  }

  async findMembers(enterpriseId: string): Promise<any[]> {
    await this.findOne(enterpriseId);
    const client = this.supabaseService.getClient();
    const { data, error } = (await client
      .from('Recruiter_enterprise')
      .select('id, fav_talents, active, User(*)')
      .eq('enterprise_id', enterpriseId)
      .eq('active', true)) as { data: any[] | null; error: any };

    if (error) throw new InternalServerErrorException(error.message);
    return data ?? [];
  }

  async update(id: string, dto: UpdateEnterpriseDto): Promise<EnterpriseRow> {
    await this.findOne(id);
    const client = this.supabaseService.getClient();
    const { data, error } = (await client
      .from('Account_Enterprise')
      .update(dto)
      .eq('id', id)
      .select()
      .single()) as { data: EnterpriseRow | null; error: any };

    if (error) throw new InternalServerErrorException(error.message);
    return data!;
  }

  async deactivate(id: string): Promise<EnterpriseRow> {
    await this.findOne(id);
    const client = this.supabaseService.getClient();
    const { data, error } = (await client
      .from('Account_Enterprise')
      .update({ active: false })
      .eq('id', id)
      .select()
      .single()) as { data: EnterpriseRow | null; error: any };

    if (error) throw new InternalServerErrorException(error.message);
    return data!;
  }

  async remove(id: string): Promise<{ message: string }> {
    await this.findOne(id);
    const client = this.supabaseService.getClient();
    const { error } = await client
      .from('Account_Enterprise')
      .delete()
      .eq('id', id);

    if (error) throw new InternalServerErrorException(error.message);
    return { message: 'Empresa eliminada exitosamente' };
  }
}
