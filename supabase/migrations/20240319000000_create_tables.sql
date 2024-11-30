-- Create users table
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    telegram_id BIGINT UNIQUE NOT NULL,
    auth_id UUID REFERENCES auth.users(id),
    first_name TEXT NOT NULL,
    last_name TEXT,
    username TEXT,
    phone_number TEXT,
    language_code TEXT,
    photo_url TEXT,
    is_verified BOOLEAN DEFAULT false,
    last_seen TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create verification_codes table
CREATE TABLE IF NOT EXISTS public.verification_codes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    telegram_id BIGINT NOT NULL REFERENCES public.users(telegram_id),
    code TEXT NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    is_used BOOLEAN DEFAULT false,
    CONSTRAINT verification_codes_code_length CHECK (length(code) = 6)
);

-- Create index on telegram_id
CREATE INDEX IF NOT EXISTS idx_users_telegram_id ON public.users(telegram_id);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

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

-- Create policies
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

-- Create function to handle user updates
CREATE OR REPLACE FUNCTION public.handle_user_update()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for user updates
DROP TRIGGER IF EXISTS users_handle_update ON public.users;
CREATE TRIGGER users_handle_update
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_user_update();

-- Create packages table
CREATE TABLE IF NOT EXISTS public.packages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) NOT NULL,
    tracking_number TEXT UNIQUE NOT NULL,
    status TEXT NOT NULL,
    sender_name TEXT NOT NULL,
    sender_phone TEXT NOT NULL,
    recipient_name TEXT NOT NULL,
    recipient_phone TEXT NOT NULL,
    origin_address TEXT NOT NULL,
    destination_address TEXT NOT NULL,
    weight DECIMAL(10,2),
    dimensions TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create package_status_history table
CREATE TABLE IF NOT EXISTS public.package_status_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    package_id UUID REFERENCES public.packages(id) NOT NULL,
    status TEXT NOT NULL,
    location TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.package_status_history ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DO $$ BEGIN
    DROP POLICY IF EXISTS "Users can view their own packages" ON public.packages;
    DROP POLICY IF EXISTS "Users can create their own packages" ON public.packages;
    DROP POLICY IF EXISTS "Users can view their packages status history" ON public.package_status_history;
EXCEPTION
    WHEN undefined_object THEN null;
END $$;

-- Packages policies
CREATE POLICY "Users can view their own packages"
    ON public.packages
    FOR ALL
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own packages"
    ON public.packages
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Package status history policies
CREATE POLICY "Users can view their packages status history"
    ON public.package_status_history
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.packages
            WHERE packages.id = package_status_history.package_id
            AND packages.user_id = auth.uid()
        )
    );

-- Drop existing trigger and function if they exist
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, telegram_id, first_name, last_name, username, language_code, phone_number)
    VALUES (
        NEW.id,
        (NEW.raw_user_meta_data->>'telegram_id')::bigint,
        COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
        NEW.raw_user_meta_data->>'last_name',
        NEW.raw_user_meta_data->>'username',
        NEW.raw_user_meta_data->>'language_code',
        NEW.raw_user_meta_data->>'phone_number'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new users
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Create function to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_packages_updated_at') THEN
        CREATE TRIGGER update_packages_updated_at
            BEFORE UPDATE ON public.packages
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_package_status_history_updated_at') THEN
        CREATE TRIGGER update_package_status_history_updated_at
            BEFORE UPDATE ON public.package_status_history
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_packages_user_id ON public.packages(user_id);
CREATE INDEX IF NOT EXISTS idx_package_status_history_package_id ON public.package_status_history(package_id);

-- Create indexes for verification_codes table
CREATE INDEX IF NOT EXISTS idx_verification_codes_telegram_id ON verification_codes(telegram_id);
CREATE INDEX IF NOT EXISTS idx_verification_codes_code ON verification_codes(code);

-- Enable Row Level Security for verification_codes table
ALTER TABLE public.verification_codes ENABLE ROW LEVEL SECURITY;

-- Create policies for verification_codes table
CREATE POLICY "Service role can manage all verification codes"
ON public.verification_codes
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow public insert for verification"
ON public.verification_codes
FOR INSERT
TO anon
WITH CHECK (true);

CREATE POLICY "Allow public select for verification"
ON public.verification_codes
FOR SELECT
TO anon
USING (true);

-- Create function to handle updates
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
DROP TRIGGER IF EXISTS verification_codes_handle_update ON public.verification_codes;
CREATE TRIGGER verification_codes_handle_update
    BEFORE UPDATE ON public.verification_codes
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();
