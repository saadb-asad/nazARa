-- Promote a user to Super Admin
-- Replace 'user@example.com' with the actual email address of the user you want to promote.

UPDATE public.profiles
SET role = 'super_admin'
WHERE email = 'user@example.com'; -- <== CHANGE THIS EMAIL

-- Verify the change
SELECT * FROM public.profiles WHERE role = 'super_admin';
