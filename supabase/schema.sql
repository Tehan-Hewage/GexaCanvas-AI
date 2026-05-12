-- Enable pgcrypto for gen_random_uuid()
create extension if not exists pgcrypto;

-- 1. Profiles Table
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  name text,
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. Chats Table
create table if not exists public.chats (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null default 'New Chat',
  mode text not null default 'chat' check (mode in ('chat', 'image', 'mixed')),
  pinned boolean not null default false,
  last_message_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index chats_user_id_idx on public.chats(user_id);
create index chats_user_pinned_last_message_idx on public.chats(user_id, pinned desc, last_message_at desc);

-- 3. Messages Table
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  chat_id uuid not null references public.chats(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('user', 'assistant', 'system')),
  content text,
  type text not null default 'text' check (type in ('text', 'image')),
  image_url text,
  image_path text,
  prompt text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index messages_chat_id_created_at_idx on public.messages(chat_id, created_at asc);
create index messages_user_id_idx on public.messages(user_id);

-- 4. Generated Images Table
create table if not exists public.generated_images (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  chat_id uuid references public.chats(id) on delete set null,
  prompt text not null,
  image_url text not null,
  image_path text not null,
  model text,
  provider text not null default 'huggingface',
  created_at timestamptz not null default now()
);

create index generated_images_user_id_idx on public.generated_images(user_id);
create index generated_images_chat_id_idx on public.generated_images(chat_id);

-- Updated At Trigger Function
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Apply triggers
create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function update_updated_at_column();

create trigger set_chats_updated_at
before update on public.chats
for each row execute function update_updated_at_column();

-- Profile auto-create trigger from auth.users
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function handle_new_user();

-- Enable Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.chats enable row level security;
alter table public.messages enable row level security;
alter table public.generated_images enable row level security;

-- Profiles Policies
create policy "Users can select their own profile."
  on public.profiles for select
  using ( auth.uid() = id );

create policy "Users can update their own profile."
  on public.profiles for update
  using ( auth.uid() = id );

-- Chats Policies
create policy "Users can select their own chats."
  on public.chats for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own chats."
  on public.chats for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own chats."
  on public.chats for update
  using ( auth.uid() = user_id );

create policy "Users can delete their own chats."
  on public.chats for delete
  using ( auth.uid() = user_id );

-- Messages Policies
create policy "Users can select messages where messages.user_id = auth.uid()."
  on public.messages for select
  using ( auth.uid() = user_id );

create policy "Users can insert messages where messages.user_id = auth.uid()."
  on public.messages for insert
  with check ( auth.uid() = user_id );

create policy "Users can update messages where messages.user_id = auth.uid()."
  on public.messages for update
  using ( auth.uid() = user_id );

create policy "Users can delete messages where messages.user_id = auth.uid()."
  on public.messages for delete
  using ( auth.uid() = user_id );

-- Generated Images Policies
create policy "Users can select their own generated images."
  on public.generated_images for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own generated images."
  on public.generated_images for insert
  with check ( auth.uid() = user_id );

create policy "Users can delete their own generated images."
  on public.generated_images for delete
  using ( auth.uid() = user_id );
