create extension if not exists pgcrypto;
create extension if not exists unaccent;

create type public.user_role as enum ('admin', 'editor', 'viewer');
create type public.content_status as enum ('draft', 'scheduled', 'published', 'archived');
create type public.content_kind as enum ('article', 'fatwa', 'ahlu_sunnah', 'book', 'course', 'class', 'biography');
create type public.media_kind as enum ('image', 'pdf', 'audio', 'document', 'video');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  role public.user_role not null default 'viewer',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  kind public.content_kind not null,
  name text not null,
  slug text not null,
  description text,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  unique (kind, slug)
);

create table public.tags (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  created_at timestamptz not null default now()
);

create table public.media_folders (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid references public.media_folders(id) on delete set null,
  name text not null,
  created_at timestamptz not null default now()
);

create table public.media_assets (
  id uuid primary key default gen_random_uuid(),
  folder_id uuid references public.media_folders(id) on delete set null,
  kind public.media_kind not null,
  bucket text not null,
  path text not null,
  alt_text text,
  title text,
  mime_type text not null,
  size_bytes bigint not null default 0,
  width int,
  height int,
  uploaded_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  deleted_at timestamptz,
  unique (bucket, path)
);

create table public.content_entries (
  id uuid primary key default gen_random_uuid(),
  kind public.content_kind not null,
  status public.content_status not null default 'draft',
  title text not null,
  slug text not null,
  excerpt text,
  body_markdown text,
  body_json jsonb,
  cover_media_id uuid references public.media_assets(id) on delete set null,
  category_id uuid references public.categories(id) on delete set null,
  author_id uuid references public.profiles(id) on delete set null,
  published_at timestamptz,
  scheduled_at timestamptz,
  read_time_minutes int not null default 1,
  views_count bigint not null default 0,
  seo_title text,
  seo_description text,
  seo_score int,
  canonical_url text,
  created_by uuid references public.profiles(id),
  updated_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  unique (kind, slug)
);

create table public.content_tags (
  content_id uuid not null references public.content_entries(id) on delete cascade,
  tag_id uuid not null references public.tags(id) on delete cascade,
  primary key (content_id, tag_id)
);

create table public.fatwas (
  content_id uuid primary key references public.content_entries(id) on delete cascade,
  fatwa_number text not null unique,
  question text not null,
  answer text not null,
  scholar_name text not null default 'Muheenudheen Baqavi'
);

create table public.books (
  content_id uuid primary key references public.content_entries(id) on delete cascade,
  preview_media_id uuid references public.media_assets(id) on delete set null,
  download_media_id uuid references public.media_assets(id) on delete set null,
  purchase_url text
);

create table public.courses (
  content_id uuid primary key references public.content_entries(id) on delete cascade,
  duration text,
  topics text[] not null default '{}',
  instructor text,
  eligibility text,
  whatsapp_message text
);

create table public.class_subjects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table public.youtube_playlists (
  id uuid primary key default gen_random_uuid(),
  subject_id uuid not null references public.class_subjects(id) on delete cascade,
  title text not null,
  youtube_playlist_id text not null,
  classes_count int not null default 0,
  progress_percent int not null default 0 check (progress_percent between 0 and 100),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.revisions (
  id uuid primary key default gen_random_uuid(),
  content_id uuid not null references public.content_entries(id) on delete cascade,
  version int not null,
  snapshot jsonb not null,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  unique (content_id, version)
);

create table public.bookmarks (
  user_id uuid not null references auth.users(id) on delete cascade,
  content_id uuid not null references public.content_entries(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, content_id)
);

create table public.site_settings (
  key text primary key,
  value jsonb not null,
  updated_by uuid references public.profiles(id),
  updated_at timestamptz not null default now()
);

create table public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles(id),
  action text not null,
  entity_table text not null,
  entity_id uuid,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create index idx_content_entries_public on public.content_entries(kind, status, published_at desc) where deleted_at is null;
create index idx_content_entries_search on public.content_entries using gin (to_tsvector('simple', coalesce(title, '') || ' ' || coalesce(excerpt, '') || ' ' || coalesce(body_markdown, '')));
create index idx_fatwas_number on public.fatwas(fatwa_number);
create index idx_media_assets_folder on public.media_assets(folder_id) where deleted_at is null;

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.increment_content_views(entry_id uuid)
returns void language sql security definer set search_path = public as $$
  update public.content_entries set views_count = views_count + 1 where id = entry_id and deleted_at is null;
$$;

create trigger touch_profiles before update on public.profiles for each row execute function public.touch_updated_at();
create trigger touch_categories before update on public.categories for each row execute function public.touch_updated_at();
create trigger touch_content before update on public.content_entries for each row execute function public.touch_updated_at();
create trigger touch_subjects before update on public.class_subjects for each row execute function public.touch_updated_at();
create trigger touch_playlists before update on public.youtube_playlists for each row execute function public.touch_updated_at();

create view public.published_content as
select *
from public.content_entries
where status = 'published' and deleted_at is null and (published_at is null or published_at <= now());

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.tags enable row level security;
alter table public.media_folders enable row level security;
alter table public.media_assets enable row level security;
alter table public.content_entries enable row level security;
alter table public.content_tags enable row level security;
alter table public.fatwas enable row level security;
alter table public.books enable row level security;
alter table public.courses enable row level security;
alter table public.class_subjects enable row level security;
alter table public.youtube_playlists enable row level security;
alter table public.revisions enable row level security;
alter table public.bookmarks enable row level security;
alter table public.site_settings enable row level security;
alter table public.activity_logs enable row level security;

create or replace function public.current_role()
returns public.user_role language sql stable security definer set search_path = public as $$
  select role from public.profiles where id = auth.uid()
$$;

create policy "Public can read published content" on public.content_entries for select using (status = 'published' and deleted_at is null);
create policy "Editors can manage content" on public.content_entries for all using (public.current_role() in ('admin', 'editor')) with check (public.current_role() in ('admin', 'editor'));
create policy "Users can read own profile" on public.profiles for select using (auth.uid() = id);
create policy "Admins can manage profiles" on public.profiles for all using (public.current_role() = 'admin') with check (public.current_role() = 'admin');
create policy "Public can read taxonomy" on public.categories for select using (deleted_at is null);
create policy "Editors can manage taxonomy" on public.categories for all using (public.current_role() in ('admin', 'editor')) with check (public.current_role() in ('admin', 'editor'));
create policy "Public can read tags" on public.tags for select using (true);
create policy "Editors can manage tags" on public.tags for all using (public.current_role() in ('admin', 'editor')) with check (public.current_role() in ('admin', 'editor'));
create policy "Public can read media folders" on public.media_folders for select using (true);
create policy "Editors can manage media folders" on public.media_folders for all using (public.current_role() in ('admin', 'editor')) with check (public.current_role() in ('admin', 'editor'));
create policy "Public can read public media metadata" on public.media_assets for select using (deleted_at is null);
create policy "Editors can manage media" on public.media_assets for all using (public.current_role() in ('admin', 'editor')) with check (public.current_role() in ('admin', 'editor'));
create policy "Public can read published content tags" on public.content_tags for select using (
  exists (
    select 1 from public.content_entries
    where content_entries.id = content_tags.content_id
      and content_entries.status = 'published'
      and content_entries.deleted_at is null
  )
);
create policy "Editors can manage content tags" on public.content_tags for all using (public.current_role() in ('admin', 'editor')) with check (public.current_role() in ('admin', 'editor'));
create policy "Public can read published fatwas" on public.fatwas for select using (
  exists (
    select 1 from public.content_entries
    where content_entries.id = fatwas.content_id
      and content_entries.status = 'published'
      and content_entries.deleted_at is null
  )
);
create policy "Editors can manage fatwas" on public.fatwas for all using (public.current_role() in ('admin', 'editor')) with check (public.current_role() in ('admin', 'editor'));
create policy "Public can read published books" on public.books for select using (
  exists (
    select 1 from public.content_entries
    where content_entries.id = books.content_id
      and content_entries.status = 'published'
      and content_entries.deleted_at is null
  )
);
create policy "Editors can manage books" on public.books for all using (public.current_role() in ('admin', 'editor')) with check (public.current_role() in ('admin', 'editor'));
create policy "Public can read published courses" on public.courses for select using (
  exists (
    select 1 from public.content_entries
    where content_entries.id = courses.content_id
      and content_entries.status = 'published'
      and content_entries.deleted_at is null
  )
);
create policy "Editors can manage courses" on public.courses for all using (public.current_role() in ('admin', 'editor')) with check (public.current_role() in ('admin', 'editor'));
create policy "Public can read class subjects" on public.class_subjects for select using (deleted_at is null);
create policy "Editors can manage class subjects" on public.class_subjects for all using (public.current_role() in ('admin', 'editor')) with check (public.current_role() in ('admin', 'editor'));
create policy "Public can read playlists" on public.youtube_playlists for select using (true);
create policy "Editors can manage playlists" on public.youtube_playlists for all using (public.current_role() in ('admin', 'editor')) with check (public.current_role() in ('admin', 'editor'));
create policy "Editors can read revisions" on public.revisions for select using (public.current_role() in ('admin', 'editor'));
create policy "Editors can insert revisions" on public.revisions for insert with check (public.current_role() in ('admin', 'editor'));
create policy "Users manage own bookmarks" on public.bookmarks for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Admins manage settings" on public.site_settings for all using (public.current_role() = 'admin') with check (public.current_role() = 'admin');
create policy "Admins read activity logs" on public.activity_logs for select using (public.current_role() = 'admin');
create policy "Editors can insert activity logs" on public.activity_logs for insert with check (public.current_role() in ('admin', 'editor'));

insert into storage.buckets (id, name, public) values
  ('images', 'images', true),
  ('downloads', 'downloads', true),
  ('documents', 'documents', false),
  ('gallery', 'gallery', true)
on conflict (id) do nothing;
