-- 0004: AI usage counters must survive "Delete my data", otherwise deleting
-- practice data would reset the daily AI limit. Re-point the FK from
-- interview.profiles to auth.users (still removed if the account is deleted).
alter table interview.ai_usage drop constraint ai_usage_user_id_fkey;
alter table interview.ai_usage
  add constraint ai_usage_user_id_fkey foreign key (user_id) references auth.users(id) on delete cascade;
