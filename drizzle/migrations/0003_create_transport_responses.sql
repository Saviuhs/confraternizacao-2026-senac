CREATE TABLE public.transport_responses (
 id uuid PRIMARY KEY,
 needs_transport boolean NOT NULL,
 participant_name text,
 created_at timestamptz NOT NULL DEFAULT now(),
 CONSTRAINT transport_name_valid CHECK (
 (needs_transport AND participant_name IS NOT NULL AND length(btrim(participant_name)) BETWEEN 3 AND 100)
 OR (NOT needs_transport AND participant_name IS NULL)
 )
);
GRANT INSERT ON public.transport_responses TO anon;
GRANT ALL ON public.transport_responses TO service_role;
ALTER TABLE public.transport_responses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public transport response submission" ON public.transport_responses FOR INSERT TO anon WITH CHECK (true);
CREATE UNIQUE INDEX transport_participant_unique ON public.transport_responses (lower(regexp_replace(btrim(participant_name), '\s+', ' ', 'g'))) WHERE needs_transport;
COMMENT ON TABLE public.transport_responses IS 'Private transport poll responses; no public reads. Independent of venue voting deadline.';