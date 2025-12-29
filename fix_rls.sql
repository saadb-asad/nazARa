-- Fix RLS for Restaurants Table
-- Run this in Supabase SQL Editor

-- 1. Ensure RLS is enabled
alter table restaurants enable row level security;

-- 2. Drop existing policies to avoid conflicts (optional but safer for clean slate)
drop policy if exists "Public restaurants are viewable by everyone" on restaurants;
drop policy if exists "Admins can manage restaurants" on restaurants;

-- 3. Re-create Policies

-- READ: Everyone can see restaurants (needed for the dashboard list and eventually public views)
create policy "Public restaurants are viewable by everyone"
on restaurants for select
using (true);

-- WRITE (Insert/Update/Delete): Only logged-in users
create policy "Admins can manage restaurants"
on restaurants for all
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

-- 4. Verify Categories Policies (Good measure)
alter table categories enable row level security;
drop policy if exists "Admins can manage categories" on categories;

create policy "Admins can manage categories"
on categories for all
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');
