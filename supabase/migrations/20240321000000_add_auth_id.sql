-- Update users table to ensure auth_id column exists
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'users' 
        AND column_name = 'auth_id'
    ) THEN
        ALTER TABLE public.users 
        ADD COLUMN auth_id UUID REFERENCES auth.users(id);
    END IF;
END $$;

-- Create index for auth_id if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_indexes
        WHERE schemaname = 'public'
        AND tablename = 'users'
        AND indexname = 'idx_users_auth_id'
    ) THEN
        CREATE INDEX idx_users_auth_id ON public.users(auth_id);
    END IF;
END $$;

-- Drop existing policies
DO $$ BEGIN
    DROP POLICY IF EXISTS "Service role can manage all users" ON public.users;
    DROP POLICY IF EXISTS "Allow public read for registration" ON public.users;
    DROP POLICY IF EXISTS "Allow public insert for bot" ON public.users;
    DROP POLICY IF EXISTS "Allow public update for registration" ON public.users;
    DROP POLICY IF EXISTS "Authenticated users can view their own data" ON public.users;
    DROP POLICY IF EXISTS "Authenticated users can update their own data" ON public.users;
    DROP POLICY IF EXISTS "Users can view their own data" ON public.users;
    DROP POLICY IF EXISTS "Allow insert from service role" ON public.users;
    DROP POLICY IF EXISTS "Allow update from service role" ON public.users;
EXCEPTION
    WHEN undefined_object THEN null;
END $$;

-- Recreate policies
CREATE POLICY "Service role can manage all users"
ON public.users
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow public read for registration"
ON public.users
FOR SELECT
TO anon
USING (true);

CREATE POLICY "Allow public insert for bot"
ON public.users
FOR INSERT
TO anon
WITH CHECK (true);

CREATE POLICY "Allow public update for registration"
ON public.users
FOR UPDATE
TO anon
USING (true)
WITH CHECK (true);

CREATE POLICY "Authenticated users can view their own data"
ON public.users
FOR SELECT
TO authenticated
USING (auth.uid() = auth_id);

CREATE POLICY "Authenticated users can update their own data"
ON public.users
FOR UPDATE
TO authenticated
USING (auth.uid() = auth_id)
WITH CHECK (auth.uid() = auth_id);
