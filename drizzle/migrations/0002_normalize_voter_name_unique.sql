DROP INDEX IF EXISTS public.votes_voter_name_unique;
CREATE UNIQUE INDEX votes_voter_name_unique ON public.votes (
  lower(regexp_replace(
    translate(btrim(voter_name),
      'áàâãäéèêëíìîïóòôõöúùûüçñÁÀÂÃÄÉÈÊËÍÌÎÏÓÒÔÕÖÚÙÛÜÇÑ',
      'aaaaaeeeeiiiiooooouuuucnAAAAAEEEEIIIIOOOOOUUUUCN'),
    '\s+', ' ', 'g'))
);