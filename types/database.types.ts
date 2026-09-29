// Hand-written types for the `interview` schema (M1 tables only).
// Replace with generated types once more tables exist:
//   npx supabase gen types typescript --project-id hdtaalwwedqhlaoujvea --schema interview > types/database.types.ts

export type UserTier = "free" | "pro" | "premium";
export type ApplicantType = "school_leaver" | "graduate" | "international" | "reapplicant";

export type Database = {
  interview: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          display_name: string | null;
          applicant_type: ApplicantType | null;
          tier: UserTier;
          created_at: string;
          updated_at: string;
        };
        // tier / timestamps deliberately absent: the DB grants no insert/update on them.
        Insert: {
          id: string;
          display_name?: string | null;
          applicant_type?: ApplicantType | null;
        };
        Update: {
          display_name?: string | null;
          applicant_type?: ApplicantType | null;
        };
        Relationships: [];
      };
      feature_flags: {
        Row: {
          key: string;
          description: string;
          free_enabled: boolean;
          pro_enabled: boolean;
          premium_enabled: boolean;
          free_daily_limit: number | null;
          pro_daily_limit: number | null;
          premium_daily_limit: number | null;
        };
        Insert: never;
        Update: never;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      user_tier: UserTier;
      applicant_type: ApplicantType;
    };
    CompositeTypes: Record<string, never>;
  };
};

export type Profile = Database["interview"]["Tables"]["profiles"]["Row"];
export type FeatureFlag = Database["interview"]["Tables"]["feature_flags"]["Row"];
