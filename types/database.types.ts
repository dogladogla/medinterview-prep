// Types for the `interview` schema, written to match supabase/migrations/0001–0003.
// (The Supabase generator only emits the default schema for this shared project.)
// JSON columns are typed as `Json` here and parsed into app types in lib/content and lib/ai.

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type UserTier = "free" | "pro" | "premium";
export type ApplicantType = "school_leaver" | "graduate" | "international" | "reapplicant";
export type InterviewFormat = "mmi" | "panel" | "group" | "online" | "oxbridge";
export type FrameworkCategory = "ethics" | "reflection" | "communication" | "structure";
export type ReadingSourceType = "gmc" | "nhs" | "book" | "article" | "report" | "guidance" | "law" | "case";
export type ContentStatus = "draft" | "published";
export type PersonaStyle = "warm" | "neutral" | "clinical" | "probing";
export type SessionMode = "mock" | "practice";
export type ReadingStatus = "unread" | "read" | "bookmarked";
export type ChatStatus = "active" | "ended";

/** Helper: a table where Insert/Update are derived loosely from Row. */
type Table<Row, Insert, Update = Partial<Insert>> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: [];
};

export type Database = {
  interview: {
    Tables: {
      profiles: Table<
        {
          id: string;
          display_name: string | null;
          applicant_type: ApplicantType | null;
          tier: UserTier;
          created_at: string;
          updated_at: string;
        },
        { id: string; display_name?: string | null; applicant_type?: ApplicantType | null },
        { display_name?: string | null; applicant_type?: ApplicantType | null }
      >;
      feature_flags: Table<
        {
          key: string;
          description: string;
          free_enabled: boolean;
          pro_enabled: boolean;
          premium_enabled: boolean;
          free_daily_limit: number | null;
          pro_daily_limit: number | null;
          premium_daily_limit: number | null;
        },
        never,
        never
      >;
      categories: Table<
        { id: string; slug: string; name: string; description: string | null; sort_order: number; icon: string | null },
        never,
        never
      >;
      universities: Table<
        {
          id: string;
          slug: string;
          name: string;
          interview_formats: InterviewFormat[];
          overview: string | null;
          interview_format_detail: string | null;
          interview_style_notes: string | null;
          what_they_look_for: Json;
          key_values: Json;
          typical_question_themes: Json;
          preparation_tips: Json;
          external_links: Json;
          last_verified_at: string | null;
          status: ContentStatus;
          created_at: string;
          updated_at: string;
        },
        never,
        never
      >;
      questions: Table<
        {
          id: string;
          slug: string;
          category_id: string;
          formats: InterviewFormat[];
          difficulty: number;
          question_text: string;
          station_brief: string | null;
          what_is_being_tested: string | null;
          follow_ups: Json;
          model_answer_scaffold: Json;
          model_answer_exemplar: string | null;
          exemplar_annotations: Json;
          key_points: Json;
          common_pitfalls: Json;
          tags: string[];
          status: ContentStatus;
          created_at: string;
          updated_at: string;
        },
        never,
        never
      >;
      question_universities: Table<{ question_id: string; university_id: string }, never, never>;
      frameworks: Table<
        {
          id: string;
          slug: string;
          name: string;
          category: FrameworkCategory;
          summary: string;
          when_to_use: string | null;
          steps: Json;
          worked_example: string | null;
          worked_example_question_id: string | null;
          common_mistakes: Json;
          sort_order: number;
          status: ContentStatus;
          created_at: string;
          updated_at: string;
        },
        never,
        never
      >;
      question_frameworks: Table<{ question_id: string; framework_id: string; is_primary: boolean }, never, never>;
      reading_items: Table<
        {
          id: string;
          slug: string;
          title: string;
          source_type: ReadingSourceType;
          author: string | null;
          url: string | null;
          edition_note: string | null;
          summary: string;
          why_it_matters: string | null;
          key_takeaways: Json;
          how_to_use_it: string | null;
          difficulty: number | null;
          last_verified_at: string | null;
          status: ContentStatus;
          created_at: string;
          updated_at: string;
        },
        never,
        never
      >;
      reading_item_categories: Table<{ reading_item_id: string; category_id: string }, never, never>;
      reading_item_questions: Table<{ reading_item_id: string; question_id: string }, never, never>;
      university_reading_items: Table<{ university_id: string; reading_item_id: string }, never, never>;
      interviewer_personas: Table<
        {
          id: string;
          slug: string;
          name: string;
          style: PersonaStyle;
          description: string | null;
          follow_up_style: string | null;
          prompt_key: string;
          affinity_university_id: string | null;
          sort_order: number;
          is_active: boolean;
        },
        never,
        never
      >;
      profile_target_universities: Table<
        { profile_id: string; university_id: string },
        { profile_id: string; university_id: string },
        never
      >;
      mock_sessions: Table<
        {
          id: string;
          user_id: string;
          mode: SessionMode;
          format: InterviewFormat | null;
          university_id: string | null;
          question_ids: string[];
          prep_seconds: number;
          answer_seconds: number;
          started_at: string;
          completed_at: string | null;
          total_score: number | null;
          feedback_json: Json | null;
        },
        {
          mode?: SessionMode;
          format?: InterviewFormat | null;
          university_id?: string | null;
          question_ids: string[];
          prep_seconds?: number;
          answer_seconds?: number;
          completed_at?: string | null;
          total_score?: number | null;
          feedback_json?: Json | null;
        }
      >;
      mock_answers: Table<
        {
          id: string;
          session_id: string;
          question_id: string;
          position: number;
          answer_text: string;
          ai_feedback: Json | null;
          score: Json | null;
          overall_score: number | null;
          prompt_version: string | null;
          model: string | null;
          feedback_error: string | null;
          created_at: string;
        },
        {
          session_id: string;
          question_id: string;
          position: number;
          answer_text: string;
          ai_feedback?: Json | null;
          score?: Json | null;
          overall_score?: number | null;
          prompt_version?: string | null;
          model?: string | null;
          feedback_error?: string | null;
        }
      >;
      interviewer_sessions: Table<
        {
          id: string;
          user_id: string;
          persona_id: string;
          university_id: string | null;
          transcript: Json;
          status: ChatStatus;
          started_at: string;
          ended_at: string | null;
          ai_summary: Json | null;
          prompt_version: string | null;
          model: string | null;
        },
        {
          id?: string;
          persona_id: string;
          university_id?: string | null;
          transcript?: Json;
          status?: ChatStatus;
          ended_at?: string | null;
          ai_summary?: Json | null;
          prompt_version?: string | null;
          model?: string | null;
        }
      >;
      user_progress: Table<
        {
          user_id: string;
          question_id: string;
          confidence: number | null;
          times_attempted: number;
          last_attempted_at: string | null;
          starred: boolean;
          notes: string | null;
          last_score: number | null;
          next_review_at: string | null;
          updated_at: string;
        },
        {
          user_id?: string;
          question_id: string;
          confidence?: number | null;
          times_attempted?: number;
          last_attempted_at?: string | null;
          starred?: boolean;
          notes?: string | null;
          last_score?: number | null;
          next_review_at?: string | null;
        }
      >;
      reading_progress: Table<
        { user_id: string; reading_item_id: string; status: ReadingStatus; notes: string | null; updated_at: string },
        { user_id?: string; reading_item_id: string; status?: ReadingStatus; notes?: string | null }
      >;
      framework_views: Table<
        { user_id: string; framework_id: string; viewed_at: string },
        { user_id?: string; framework_id: string; viewed_at?: string }
      >;
      ai_usage: Table<{ user_id: string; feature_key: string; day: string; count: number }, never, never>;
    };
    Views: { [_ in never]: never };
    Functions: {
      consume_ai_quota: {
        Args: { p_feature: string };
        Returns: { allowed: boolean; used: number; daily_limit: number | null }[];
      };
    };
    Enums: {
      user_tier: UserTier;
      applicant_type: ApplicantType;
      interview_format: InterviewFormat;
      framework_category: FrameworkCategory;
      reading_source_type: ReadingSourceType;
      content_status: ContentStatus;
      persona_style: PersonaStyle;
      session_mode: SessionMode;
      reading_status: ReadingStatus;
      chat_status: ChatStatus;
    };
    CompositeTypes: { [_ in never]: never };
  };
};

type T = Database["interview"]["Tables"];
export type Profile = T["profiles"]["Row"];
export type FeatureFlag = T["feature_flags"]["Row"];
export type MockSessionRow = T["mock_sessions"]["Row"];
export type MockAnswerRow = T["mock_answers"]["Row"];
export type InterviewerSessionRow = T["interviewer_sessions"]["Row"];
export type UserProgressRow = T["user_progress"]["Row"];
export type ReadingProgressRow = T["reading_progress"]["Row"];
