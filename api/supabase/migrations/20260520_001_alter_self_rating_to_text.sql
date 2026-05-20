-- Change self_rating from INT to TEXT to store label-based ratings
-- ('no_lo_conozco', 'lo_uso', 'lo_domino')

-- Step 1: Drop any CHECK constraints on self_rating (e.g. value between 1-10)
DO $$
DECLARE
  c_name TEXT;
BEGIN
  FOR c_name IN
    SELECT conname
    FROM pg_constraint
    WHERE conrelid = '"Talent_skill"'::regclass
      AND contype = 'c'
      AND pg_get_constraintdef(oid) LIKE '%self_rating%'
  LOOP
    EXECUTE format('ALTER TABLE "Talent_skill" DROP CONSTRAINT IF EXISTS %I', c_name);
  END LOOP;
END $$;

-- Step 2: Change column type
ALTER TABLE "Talent_skill"
  ALTER COLUMN "self_rating" TYPE TEXT
  USING self_rating::TEXT;

NOTIFY pgrst, 'reload schema';
