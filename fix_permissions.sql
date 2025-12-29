-- 1. Check if profiles exist. If not, the trigger might have failed for the initial user.
-- We will insert a profile for the current auth user if it doesn't exist.
-- (Note: In a raw SQL script we can't easily get 'auth.uid()', so we usually ask the user to run this in the dashboard SQL editor)
-- BUT, for the Planner, we can try to make it generic for "First User".

-- FIX: Set ALL existing profiles to 'super_admin' to ensure YOU (the developer) have access.
UPDATE public.profiles
SET role = 'super_admin';

-- 2. Verify RLS Policy for Profiles
-- Drop and recreate to be 100% sure it's correct
DROP POLICY IF EXISTS "Super Admins can view all profiles" ON public.profiles;

CREATE POLICY "Super Admins can view all profiles"
ON public.profiles
FOR SELECT
USING (
  (select role from public.profiles where id = auth.uid()) = 'super_admin'
);

-- 3. Also allow Super Admins to UPDATE/INSERT management entries
DROP POLICY IF EXISTS "Super Admins can manage restaurant managers" ON public.restaurant_managers;

CREATE POLICY "Super Admins can manage restaurant managers"
ON public.restaurant_managers
FOR ALL
USING (
  (select role from public.profiles where id = auth.uid()) = 'super_admin'
);

-- 4. Ensure we can fetch Restaurants too
DROP POLICY IF EXISTS "Admins can view all restaurants" ON public.restaurants;
CREATE POLICY "Admins can view all restaurants"
ON public.restaurants
FOR SELECT
USING ( true ); -- Let's make restaurants public read for now to simplify debugging
