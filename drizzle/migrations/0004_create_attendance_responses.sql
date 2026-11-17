CREATE EXTENSION IF NOT EXISTS unaccent WITH SCHEMA extensions;
CREATE OR REPLACE FUNCTION public.normalize_person_name(n text) RETURNS text LANGUAGE sql IMMUTABLE SET search_path = public, extensions AS $$ SELECT lower(regexp_replace(btrim(extensions.unaccent('extensions.unaccent'::regdictionary, n)), '\s+', ' ', 'g')) $$;
CREATE TABLE public.attendance_responses (
  id uuid PRIMARY KEY,
  will_attend boolean NOT NULL,
  participant_name text NOT NULL CHECK (char_length(btrim(participant_name)) BETWEEN 3 AND 100),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.attendance_responses TO anon;
GRANT ALL ON public.attendance_responses TO service_role;
ALTER TABLE public.attendance_responses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon insert before deadline" ON public.attendance_responses FOR INSERT TO anon WITH CHECK (now() < '2026-11-28T03:00:00Z'::timestamptz);
CREATE UNIQUE INDEX attendance_name_unique ON public.attendance_responses (public.normalize_person_name(participant_name));