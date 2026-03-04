-- 028_fix_handle_new_user_profile_sync.sql
-- Harden handle_new_user trigger. After 029/030, profiles has full_name, avatar_url, subscription_plan.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  profile_email TEXT;
  profile_full_name TEXT;
  profile_avatar_url TEXT;
BEGIN
  profile_email := COALESCE(NEW.email, NEW.raw_user_meta_data->>'email', '');
  profile_full_name := COALESCE(
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'name',
    split_part(COALESCE(NEW.email, ''), '@', 1)
  );
  profile_avatar_url := NEW.raw_user_meta_data->>'avatar_url';

  INSERT INTO public.profiles (id, email, full_name, avatar_url, subscription_plan)
  VALUES (
    NEW.id,
    NULLIF(trim(profile_email), ''),
    NULLIF(trim(profile_full_name), ''),
    NULLIF(trim(profile_avatar_url), ''),
    'starter'::subscription_plan
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'handle_new_user failed for user %: %', NEW.id, SQLERRM;
END;
$$;

-- Trigger already exists from 010; ensure it's attached
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
