-- NazARa Complete Setup v3 (Unified Fix)
-- Run this ENTIRE script in Supabase SQL Editor to fix missing tables and permissions.

-- 1. Enable UUIDs
create extension if not exists "uuid-ossp";

-- 2. Create Tables (If they don't exist)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  full_name text,
  role text default 'manager' check (role in ('super_admin', 'manager')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.restaurants (
  id uuid default gen_random_uuid() primary key,
  name text not null unique,
  address text,
  logo_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.restaurant_managers (
  id uuid default gen_random_uuid() primary key,
  profile_id uuid references public.profiles(id) on delete cascade not null,
  restaurant_id uuid references public.restaurants(id) on delete cascade not null,
  role text default 'owner' check (role in ('owner', 'editor')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(profile_id, restaurant_id)
);

create table if not exists public.categories (
  id uuid default gen_random_uuid() primary key,
  restaurant_id uuid references public.restaurants(id) on delete cascade,
  name text not null,
  sort_order int default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.menu_items (
  id uuid default gen_random_uuid() primary key,
  restaurant_id uuid references public.restaurants(id) on delete set null,
  category_id uuid references public.categories(id) on delete set null,
  restaurant_name text, -- keeping for legacy support
  name text,
  description text,
  price decimal,
  model_url text,
  is_active boolean default true,
  metadata jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Enable RLS on ALL tables
alter table public.profiles enable row level security;
alter table public.restaurants enable row level security;
alter table public.restaurant_managers enable row level security;
alter table public.menu_items enable row level security;
alter table public.categories enable row level security;

-- 4. CLEANUP: Drop ALL existing policies to ensure clean slate (and avoid "policy already exists" errors)
drop policy if exists "Super Admins can view all profiles" on public.profiles;
drop policy if exists "Users can view own profile" on public.profiles;
drop policy if exists "Public restaurants are viewable by everyone" on public.restaurants;
drop policy if exists "Admins can view all restaurants" on public.restaurants;
drop policy if exists "Managers can view assigned restaurants" on public.restaurants;
drop policy if exists "Super Admins can manage restaurant managers" on public.restaurant_managers;
drop policy if exists "Managers can view own assignments" on public.restaurant_managers;
drop policy if exists "Public items are viewable by everyone" on public.menu_items;
drop policy if exists "Admins can upload items" on public.menu_items;
drop policy if exists "Admins can manage items" on public.menu_items;
drop policy if exists "Managers can view assigned menu items by name" on public.menu_items;

-- 5. RE-CREATE POLICIES (Corrected)

-- PROFILES
create policy "Super Admins can view all profiles" on public.profiles
  for select using ( (select role from public.profiles where id = auth.uid()) = 'super_admin' );

create policy "Users can view own profile" on public.profiles
  for select using ( id = auth.uid() );

-- RESTAURANTS
create policy "Public restaurants are viewable by everyone" on public.restaurants
  for select using ( true );

create policy "Super Admins can mutate restaurants" on public.restaurants
  for all using ( (select role from public.profiles where id = auth.uid()) = 'super_admin' );

-- RESTAURANT MANAGERS
create policy "Super Admins can manage restaurant managers" on public.restaurant_managers
  for all using ( (select role from public.profiles where id = auth.uid()) = 'super_admin' );

create policy "Managers can view own assignments" on public.restaurant_managers
  for select using ( profile_id = auth.uid() );

-- MENU ITEMS
create policy "Public items are viewable by everyone" on public.menu_items
  for select using ( true );

create policy "Admins can manage items" on public.menu_items
  for all using ( auth.role() = 'authenticated' ); -- Simplified for now to allow all logged in users to edit (until Portal locks this down)


-- 6. CRITICAL: Make YOU a Super Admin
-- This updates ALL existing users to super_admin. 
-- In production, you would update only specific emails.
UPDATE public.profiles SET role = 'super_admin';

-- If your user is not in profiles yet, insert it (Trigger usually handles this, but just in case)
insert into public.profiles (id, email, role)
select id, email, 'super_admin' from auth.users
on conflict (id) do update set role = 'super_admin';
