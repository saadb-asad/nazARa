-- 1. Create the restaurant_managers table
create table if not exists public.restaurant_managers (
  id uuid default gen_random_uuid() primary key,
  profile_id uuid references public.profiles(id) on delete cascade not null,
  restaurant_id uuid references public.restaurants(id) on delete cascade not null,
  role text default 'owner' check (role in ('owner', 'editor')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(profile_id, restaurant_id)
);

-- 2. Enable RLS
alter table public.restaurant_managers enable row level security;
alter table public.profiles enable row level security; -- Ensure profiles is secured

-- 3. Policies for restaurant_managers
-- Super Admins can do everything
create policy "Super Admins can manage restaurant managers"
  on public.restaurant_managers
  for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'super_admin'
    )
  );

-- Managers can view their own assignments
create policy "Managers can view own assignments"
  on public.restaurant_managers
  for select
  using (
    profile_id = auth.uid()
  );

-- 4. Policies for Profiles (CRITICAL for Admin User List)
create policy "Super Admins can view all profiles"
  on public.profiles
  for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'super_admin'
    )
  );
  
-- Users can view their own profile
create policy "Users can view own profile"
  on public.profiles
  for select
  using ( id = auth.uid() );


-- 5. Update Policies for Restaurants (Allow Managers to view their assigned restaurant)
create policy "Managers can view assigned restaurants"
  on public.restaurants
  for select
  using (
    exists (
      select 1 from public.restaurant_managers
      where restaurant_id = public.restaurants.id
      and profile_id = auth.uid()
    )
  );

-- 6. Re-assert Menu Items Access for Managers (Text Match based)
create policy "Managers can view assigned menu items by name"
  on public.menu_items
  for select
  using (
    exists (
      select 1 from public.restaurant_managers rm
      join public.restaurants r on r.id = rm.restaurant_id
      where r.name = public.menu_items.restaurant_name
      and rm.profile_id = auth.uid()
    )
  );

-- 7. Update Policies for Scans
create policy "Managers can view assigned scans"
  on public.scans
  for select
  using (
    exists (
      select 1 from public.menu_items mi
      join public.restaurants r on r.name = mi.restaurant_name
      join public.restaurant_managers rm on rm.restaurant_id = r.id
      where mi.id = public.scans.menu_item_id
      and rm.profile_id = auth.uid()
    )
  );
