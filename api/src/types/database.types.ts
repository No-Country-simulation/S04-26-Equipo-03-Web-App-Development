export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '14.5';
  };
  public: {
    Tables: {
      Account_Enterprise: {
        Row: {
          active: boolean | null;
          description: string | null;
          id: string;
          name: string | null;
          owner_id: string | null;
          website_url: string | null;
        };
        Insert: {
          active?: boolean | null;
          description?: string | null;
          id?: string;
          name?: string | null;
          owner_id?: string | null;
          website_url?: string | null;
        };
        Update: {
          active?: boolean | null;
          description?: string | null;
          id?: string;
          name?: string | null;
          owner_id?: string | null;
          website_url?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'FK_Account_Enterprise_owner_id';
            columns: ['owner_id'];
            isOneToOne: false;
            referencedRelation: 'User';
            referencedColumns: ['id'];
          },
        ];
      };
      Diagnostic: {
        Row: {
          ai_generated_questions: Json | null;
          completed_at: string | null;
          gap_analysis: Json | null;
          id: string;
          skill_id: string | null;
          status: Database['public']['Enums']['diag_status'] | null;
          talent_profile_id: string | null;
          talent_role_id: string | null;
          type: Database['public']['Enums']['diag_type'] | null;
          user_responses: Json | null;
        };
        Insert: {
          ai_generated_questions?: Json | null;
          completed_at?: string | null;
          gap_analysis?: Json | null;
          id?: string;
          skill_id?: string | null;
          status?: Database['public']['Enums']['diag_status'] | null;
          talent_profile_id?: string | null;
          talent_role_id?: string | null;
          type?: Database['public']['Enums']['diag_type'] | null;
          user_responses?: Json | null;
        };
        Update: {
          ai_generated_questions?: Json | null;
          completed_at?: string | null;
          gap_analysis?: Json | null;
          id?: string;
          skill_id?: string | null;
          status?: Database['public']['Enums']['diag_status'] | null;
          talent_profile_id?: string | null;
          talent_role_id?: string | null;
          type?: Database['public']['Enums']['diag_type'] | null;
          user_responses?: Json | null;
        };
        Relationships: [
          {
            foreignKeyName: 'Diagnostic_talent_profile_id_fkey';
            columns: ['talent_profile_id'];
            isOneToOne: false;
            referencedRelation: 'Talent_profile';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'Diagnostic_talent_role_id_fkey';
            columns: ['talent_role_id'];
            isOneToOne: false;
            referencedRelation: 'Talent_Role';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'Diagnostic_skill_id_fkey';
            columns: ['skill_id'];
            isOneToOne: false;
            referencedRelation: 'Skill';
            referencedColumns: ['id'];
          },
        ];
      };
      Enterprise_black_list: {
        Row: {
          enterprise_id: string | null;
          id: string;
          talent_id: string | null;
        };
        Insert: {
          enterprise_id?: string | null;
          id?: string;
          talent_id?: string | null;
        };
        Update: {
          enterprise_id?: string | null;
          id?: string;
          talent_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'Enterprise_black_list_enterprise_id_fkey';
            columns: ['enterprise_id'];
            isOneToOne: false;
            referencedRelation: 'Account_Enterprise';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'Enterprise_black_list_talent_id_fkey';
            columns: ['talent_id'];
            isOneToOne: false;
            referencedRelation: 'Talent_profile';
            referencedColumns: ['id'];
          },
        ];
      };
      Learning_Path: {
        Row: {
          completed_at: string | null;
          created_at: string | null;
          diagnostic_id: string | null;
          id: string;
          status: Database['public']['Enums']['path_status'] | null;
          talent_profile_id: string | null;
          updated_at: string | null;
        };
        Insert: {
          completed_at?: string | null;
          created_at?: string | null;
          diagnostic_id?: string | null;
          id?: string;
          status?: Database['public']['Enums']['path_status'] | null;
          talent_profile_id?: string | null;
          updated_at?: string | null;
        };
        Update: {
          completed_at?: string | null;
          created_at?: string | null;
          diagnostic_id?: string | null;
          id?: string;
          status?: Database['public']['Enums']['path_status'] | null;
          talent_profile_id?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'Learning_Path_diagnostic_id_fkey';
            columns: ['diagnostic_id'];
            isOneToOne: false;
            referencedRelation: 'Diagnostic';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'Learning_Path_talent_profile_id_fkey';
            columns: ['talent_profile_id'];
            isOneToOne: false;
            referencedRelation: 'Talent_profile';
            referencedColumns: ['id'];
          },
        ];
      };
      Path_Step: {
        Row: {
          description: string | null;
          id: string;
          is_completed: boolean | null;
          learning_path_id: string | null;
          order: number | null;
          resource_url: string | null;
          title: string | null;
          type: Database['public']['Enums']['step_type'] | null;
        };
        Insert: {
          description?: string | null;
          id?: string;
          is_completed?: boolean | null;
          learning_path_id?: string | null;
          order?: number | null;
          resource_url?: string | null;
          title?: string | null;
          type?: Database['public']['Enums']['step_type'] | null;
        };
        Update: {
          description?: string | null;
          id?: string;
          is_completed?: boolean | null;
          learning_path_id?: string | null;
          order?: number | null;
          resource_url?: string | null;
          title?: string | null;
          type?: Database['public']['Enums']['step_type'] | null;
        };
        Relationships: [
          {
            foreignKeyName: 'Path_Step_learning_path_id_fkey';
            columns: ['learning_path_id'];
            isOneToOne: false;
            referencedRelation: 'Learning_Path';
            referencedColumns: ['id'];
          },
        ];
      };
      Recruiter_enterprise: {
        Row: {
          active: boolean | null;
          enterprise_id: string | null;
          fav_talents: string[] | null;
          id: string;
          user_id: string | null;
        };
        Insert: {
          active?: boolean | null;
          enterprise_id?: string | null;
          fav_talents?: string[] | null;
          id?: string;
          user_id?: string | null;
        };
        Update: {
          active?: boolean | null;
          enterprise_id?: string | null;
          fav_talents?: string[] | null;
          id?: string;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'FK_Recruiter_enterprise_user_id';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'User';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'Recruiter_enterprise_enterprise_id_fkey';
            columns: ['enterprise_id'];
            isOneToOne: false;
            referencedRelation: 'Account_Enterprise';
            referencedColumns: ['id'];
          },
        ];
      };
      Skill: {
        Row: {
          id: string;
          title: string | null;
          type: Database['public']['Enums']['skill_category'] | null;
        };
        Insert: {
          id?: string;
          title?: string | null;
          type?: Database['public']['Enums']['skill_category'] | null;
        };
        Update: {
          id?: string;
          title?: string | null;
          type?: Database['public']['Enums']['skill_category'] | null;
        };
        Relationships: [];
      };
      Talent_profile: {
        Row: {
          age: number | null;
          availability:
            | Database['public']['Enums']['talent_availability']
            | null;
          avatar_url: string | null;
          bio: string | null;
          education: Json | null;
          experience_years: string | null;
          id: string;
          last_position: string | null;
          location: string | null;
          portfolio_public_id: string | null;
          portfolio_url: string | null;
          user_id: string | null;
          work_experience: Json | null;
        };
        Insert: {
          age?: number | null;
          availability?:
            | Database['public']['Enums']['talent_availability']
            | null;
          avatar_url?: string | null;
          bio?: string | null;
          education?: Json | null;
          experience_years?: string | null;
          id?: string;
          last_position?: string | null;
          location?: string | null;
          portfolio_public_id?: string | null;
          portfolio_url?: string | null;
          user_id?: string | null;
          work_experience?: Json | null;
        };
        Update: {
          age?: number | null;
          availability?:
            | Database['public']['Enums']['talent_availability']
            | null;
          avatar_url?: string | null;
          bio?: string | null;
          education?: Json | null;
          experience_years?: string | null;
          id?: string;
          last_position?: string | null;
          location?: string | null;
          portfolio_public_id?: string | null;
          portfolio_url?: string | null;
          user_id?: string | null;
          work_experience?: Json | null;
        };
        Relationships: [
          {
            foreignKeyName: 'FK_Talent_profile_user_id';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'User';
            referencedColumns: ['id'];
          },
        ];
      };
      Talent_Role: {
        Row: {
          cv_url: string | null;
          id: string;
          profile_id: string | null;
          role_name: string | null;
          visible: boolean | null;
        };
        Insert: {
          cv_url?: string | null;
          id?: string;
          profile_id?: string | null;
          role_name?: string | null;
          visible?: boolean | null;
        };
        Update: {
          cv_url?: string | null;
          id?: string;
          profile_id?: string | null;
          role_name?: string | null;
          visible?: boolean | null;
        };
        Relationships: [
          {
            foreignKeyName: 'Talent_Role_profile_id_fkey';
            columns: ['profile_id'];
            isOneToOne: false;
            referencedRelation: 'Talent_profile';
            referencedColumns: ['id'];
          },
        ];
      };
      Talent_skill: {
        Row: {
          id: string;
          last_diagnostic_id: string | null;
          profile_id: string | null;
          score: number | null;
          self_rating: number | null;
          skill_id: string | null;
          validated: boolean | null;
          validated_at: string | null;
        };
        Insert: {
          id?: string;
          last_diagnostic_id?: string | null;
          profile_id?: string | null;
          score?: number | null;
          self_rating?: number | null;
          skill_id?: string | null;
          validated?: boolean | null;
          validated_at?: string | null;
        };
        Update: {
          id?: string;
          last_diagnostic_id?: string | null;
          profile_id?: string | null;
          score?: number | null;
          self_rating?: number | null;
          skill_id?: string | null;
          validated?: boolean | null;
          validated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'Talent_skill_last_diagnostic_id_fkey';
            columns: ['last_diagnostic_id'];
            isOneToOne: false;
            referencedRelation: 'Diagnostic';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'Talent_skill_profile_id_fkey';
            columns: ['profile_id'];
            isOneToOne: false;
            referencedRelation: 'Talent_profile';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'Talent_skill_skill_id_fkey';
            columns: ['skill_id'];
            isOneToOne: false;
            referencedRelation: 'Skill';
            referencedColumns: ['id'];
          },
        ];
      };
      User: {
        Row: {
          active: boolean | null;
          created_at: string | null;
          email: string | null;
          first_name: string | null;
          id: string;
          last_name: string | null;
          role: Database['public']['Enums']['user_role'] | null;
        };
        Insert: {
          active?: boolean | null;
          created_at?: string | null;
          email?: string | null;
          first_name?: string | null;
          id: string;
          last_name?: string | null;
          role?: Database['public']['Enums']['user_role'] | null;
        };
        Update: {
          active?: boolean | null;
          created_at?: string | null;
          email?: string | null;
          first_name?: string | null;
          id?: string;
          last_name?: string | null;
          role?: Database['public']['Enums']['user_role'] | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      diag_status: 'PENDING' | 'FAILED' | 'COMPLETED';
      diag_type: 'INITIAL_ONBOARDING' | 'SKILL_VALIDATION';
      path_status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
      skill_category: 'TECH' | 'SOFT' | 'COGNITIVE';
      step_type: 'VIDEO' | 'ARTICLE' | 'EXERCISE' | 'QUIZ';
      talent_availability:
        | 'ACTIVE_JOB_SEARCH'
        | 'OPEN_TO_OFFERS'
        | 'NOT_LOOKING_ASSESSMENT_ONLY';
      user_role: 'ADMIN' | 'RECRUITER' | 'TALENT';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  'public'
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] &
        DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] &
        DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      diag_status: ['PENDING', 'FAILED', 'COMPLETED'],
      diag_type: ['INITIAL_ONBOARDING', 'SKILL_VALIDATION'],
      path_status: ['PENDING', 'IN_PROGRESS', 'COMPLETED'],
      skill_category: ['TECH', 'SOFT', 'COGNITIVE'],
      step_type: ['VIDEO', 'ARTICLE', 'EXERCISE', 'QUIZ'],
      talent_availability: [
        'ACTIVE_JOB_SEARCH',
        'OPEN_TO_OFFERS',
        'NOT_LOOKING_ASSESSMENT_ONLY',
      ],
      user_role: ['ADMIN', 'RECRUITER', 'TALENT'],
    },
  },
} as const;
