-- Fix Infinite Recursion in RLS Policies
-- The previous policy queried 'profiles' recursively.
-- We fix this by moving the check into a SECURITY DEFINER function that bypasses RLS.

-- 1. Create Helper Function
create or replace function public.is_super_admin()
returns boolean
language sql
security definer -- <== This is the magic. It runs with owner privileges, bypassing RLS.
set search_path = public -- Best practice for security definers
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid()
    and role = 'super_admin'
  );
$$;

-- 2. Update Profiles Policy
drop policy if exists "Super Admins can view all profiles" on public.profiles;

create policy "Super Admins can view all profiles" 
on public.profiles
for select 
using (
  public.is_super_admin() -- Safe, non-recursive call
);

-- 3. Update Other Admin Policies (To use the new function efficiently)
drop policy if exists "Super Admins can mutate restaurants" on public.restaurants;
create policy "Super Admins can mutate restaurants" 
on public.restaurants
for all 
using ( public.is_super_admin() );

drop policy if exists "Super Admins can manage restaurant managers" on public.restaurant_managers;
create policy "Super Admins can manage restaurant managers" 
on public.restaurant_managers
for all 
using ( public.is_super_admin() );

-- 4. Ensure Permissions (Grant execute to everyone so policies can use it)
grant execute on function public.is_super_admin to authenticated;
grant execute on function public.is_super_admin to anon;
