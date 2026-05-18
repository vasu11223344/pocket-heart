# Green Spark Solar — TanStack Start + PocketBase

This project was migrated from Supabase to **PocketBase** for backend
(database, auth, file storage). The UI and routes are unchanged.

## 1. Run PocketBase locally

Download the binary from <https://pocketbase.io/docs/> for your OS, then:

```bash
./pocketbase serve
# Admin UI:  http://127.0.0.1:8090/_/
# REST API:  http://127.0.0.1:8090/api/
```

On first run, open the admin UI to create your **superuser** (this account
is what `/admin/login` in the app authenticates against).

### Import collections

Import `pocketbase/pb_schema.json` from the PocketBase admin UI:

  Settings → Import collections → paste the JSON from `pocketbase/pb_schema.json`.

This creates: `projects`, `gallery_images`, `testimonials`, `reviews`,
`submissions`, `site_settings`. All have file fields where applicable
(image storage is handled by PocketBase).

## 2. Environment variables

Create `.env` in the project root:

```
VITE_POCKETBASE_URL=http://127.0.0.1:8090

# Optional — for the AI chatbot (Lovable AI Gateway or OpenAI-compatible)
LOVABLE_API_KEY=
# or
OPENAI_API_KEY=
```

In production, set the same `VITE_POCKETBASE_URL` (e.g.
`https://pb.yourdomain.com`) on your hosting provider.

## 3. Develop

```bash
bun install
bun run dev
```

## 4. Build & deploy

```bash
bun run build
```

### Vercel (frontend / SSR)

This is a TanStack Start app. To deploy on Vercel, set the project's
**Build Command** to `bun run build`, **Install Command** to `bun install`,
and configure the environment variable `VITE_POCKETBASE_URL` in the Vercel
dashboard. PocketBase itself runs separately (see below).

### PocketBase hosting

Run the PocketBase binary on any small VPS, Fly.io, Railway, or PikaPods.
Make sure it is reachable at the `VITE_POCKETBASE_URL` you configured, and
that CORS allows your Vercel domain (PocketBase admin → Settings → Application).

## 5. Reusable services

All data access goes through `src/integrations/pocketbase/services.ts`:

- `listGallery / createGallery / updateGallery / deleteGallery`
- `listProjects / createProject / updateProject / deleteProject`
- `listTestimonials / createTestimonial / updateTestimonial / deleteTestimonial`
- `submitContact / listSubmissions / deleteSubmission`
- `getSettings / updateSettings`
- `loginAdmin / logoutAdmin / isAdminAuthed / onAuthChange`

Uploaded images are stored on PocketBase. URLs are built by
`fileUrl(record, filename)` in `src/integrations/pocketbase/client.ts` and
returned as `image_url` on every mapped record, so the existing UI keeps
rendering with no changes.
