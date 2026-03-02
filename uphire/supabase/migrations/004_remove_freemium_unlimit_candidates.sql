-- 004_remove_freemium_unlimit_candidates.sql - Wrap all in DO blocks
DO $$
BEGIN
  -- Add starter to subscription_plan enum if missing
  IF NOT EXISTS (
    SELECT 1 FROM pg_enum
    WHERE enumlabel = 'starter'
    AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'subscription_plan')
  ) THEN
    ALTER TYPE subscription_plan ADD VALUE IF NOT EXISTS 'starter';
  END IF;
EXCEPTION
  WHEN undefined_object THEN NULL; -- subscription_plan enum may not exist yet
END $$;

DO $$
BEGIN
  -- Migrate freemium/growth to starter only if subscription_plan column exists
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'profiles'
      AND column_name = 'subscription_plan'
  ) THEN
    UPDATE profiles
    SET subscription_plan = 'starter'::subscription_plan
    WHERE subscription_plan::TEXT IN ('freemium', 'growth');
  END IF;
END $$;

DO $$
BEGIN
  -- Update usage_limits only if column exists
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'profiles'
      AND column_name = 'usage_limits'
  ) THEN
    UPDATE profiles
    SET usage_limits = jsonb_set(
      COALESCE(usage_limits, '{}'::jsonb),
      '{candidates}',
      '0'::jsonb
    )
    WHERE subscription_plan::TEXT = 'starter';
  END IF;
END $$;

DO $$
BEGIN
  -- ALTER subscription_plan default only if column exists
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'profiles'
      AND column_name = 'subscription_plan'
  ) THEN
    ALTER TABLE profiles
    ALTER COLUMN subscription_plan SET DEFAULT 'starter'::subscription_plan;
  END IF;
END $$;
