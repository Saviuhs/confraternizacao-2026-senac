<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep the existing vote option identifiers stable when venue content changes, because persisted vote totals depend on them.
- Vote server functions fall back to the public (publishable) backend URL/key when server env vars are missing, so external hosts like Vercel work without extra setup.
- Use the shared voting schedule for vote submission and the closed UI, so both enforce the same deadline.
- Keep the public results server function returning null at all times; internal organizer reports must not disclose totals through the public site.
- Derive the visible countdown from the shared voting schedule after hydration, so its clock matches closing and avoids server/client mismatches.
