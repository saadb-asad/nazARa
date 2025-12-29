-- NazARa Schema v2 (Robust Fix)
-- Run this in Supabase SQL Editor

-- 1. Enable UUID extension
create extension if not exists "uuid-ossp";

-- 2. Profiles Table
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  full_name text,
  role text default 'manager' check (role in ('super_admin', 'manager')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Trigger logic (idempotent)
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, new.email, 'manager');
  return new;
end;
$$ language plpgsql security definer;

do $$
begin
  if not exists (select 1 from pg_trigger where tgname = 'on_auth_user_created') then
    create trigger on_auth_user_created
      after insert on auth.users
      for each row execute procedure public.handle_new_user();
  end if;
end $$;


-- 3. Restaurants Table
create table if not exists public.restaurants (
  id uuid default gen_random_uuid() primary key,
  name text not null unique,
  address text,
  logo_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Categories Table
create table if not exists public.categories (
  id uuid default gen_random_uuid() primary key,
  restaurant_id uuid references public.restaurants(id) on delete cascade,
  name text not null,
  sort_order int default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Update Menu Items Columns
do $$ 
begin
    if not exists (select 1 from information_schema.columns where table_name = 'menu_items' and column_name = 'restaurant_id') then
        alter table menu_items add column restaurant_id uuid references public.restaurants(id) on delete set null;
    end if;

    if not exists (select 1 from information_schema.columns where table_name = 'menu_items' and column_name = 'category_id') then
        alter table menu_items add column category_id uuid references public.categories(id) on delete set null;
    end if;
    
    if not exists (select 1 from information_schema.columns where table_name = 'menu_items' and column_name = 'is_active') then
        alter table menu_items add column is_active boolean default true;
    end if;
end $$;

-- 6. Scans Table (Smart Creation)
-- This block checks the type of menu_items.id and creates the scans table accordingly.
do $$ 
declare
    item_id_type text;
begin
    -- Check if scans table already exists, if not, create it
    if not exists (select 1 from information_schema.tables where table_name = 'scans') then
        
        -- Get the data type of menu_items.id
        select data_type into item_id_type 
        from information_schema.columns 
        where table_name = 'menu_items' and column_name = 'id';
        
        -- Raise notice for debugging
        raise notice 'Detected menu_items.id type: %', item_id_type;

        if item_id_type = 'uuid' then
            create table public.scans (
                id uuid default gen_random_uuid() primary key,
                menu_item_id uuid references public.menu_items(id) on delete set null,
                scanned_at timestamp with time zone default timezone('utc'::text, now()) not null,
                device_type text,
                user_agent text
            );
        else
            -- Assume bigint or integer
            create table public.scans (
                id uuid default gen_random_uuid() primary key,
                menu_item_id bigint references public.menu_items(id) on delete set null,
                scanned_at timestamp with time zone default timezone('utc'::text, now()) not null,
                device_type text,
                user_agent text
            );
        end if;
        
    end if;
end $$;

-- 7. RLS Policies
alter table profiles enable row level security;
alter table restaurants enable row level security;
alter table categories enable row level security;
alter table menu_items enable row level security;
alter table scans enable row level security;

do $$ 
begin
    if not exists (select 1 from pg_policies where policyname = 'Public items are viewable by everyone' and tablename = 'menu_items') then
        create policy "Public items are viewable by everyone" on menu_items for select using (true);
    end if;
    if not exists (select 1 from pg_policies where policyname = 'Public restaurants are viewable by everyone' and tablename = 'restaurants') then
         create policy "Public restaurants are viewable by everyone" on restaurants for select using (true);
    end if;
    if not exists (select 1 from pg_policies where policyname = 'Admins can manage items' and tablename = 'menu_items') then
        create policy "Admins can manage items" on menu_items for all using (auth.role() = 'authenticated');
    end if;
    if not exists (select 1 from pg_policies where policyname = 'Admins can upload items' and tablename = 'menu_items') then
        create policy "Admins can upload items" on menu_items for insert with check (auth.role() = 'authenticated');
    end if;
end $$;
