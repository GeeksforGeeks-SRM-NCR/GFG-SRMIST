-- Simplify: Just insure bucket is public.
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Try to create policy ONLY if it doesn't conflict. 
-- Note: 'storage.objects' policies can be tricky if you are not the owner.
-- If this fails, please set the policy in the Supabase Dashboard:
-- 1. Go to Storage -> Policies
-- 2. New Policy -> For 'avatars' bucket -> ALLOW insert/select/update -> Target: authenticated users

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_policies
        WHERE schemaname = 'storage'
        AND tablename = 'objects'
        AND policyname = 'Avatar Upload Policy'
    ) THEN
        CREATE POLICY "Avatar Upload Policy"
        ON storage.objects FOR INSERT
        TO authenticated
        WITH CHECK ( bucket_id = 'avatars' );
    END IF;
END
$$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_policies
        WHERE schemaname = 'storage'
        AND tablename = 'Avatar Public Access'
    ) THEN
        CREATE POLICY "Avatar Public Access"
        ON storage.objects FOR SELECT
        USING ( bucket_id = 'avatars' );
    END IF;
END
$$;
