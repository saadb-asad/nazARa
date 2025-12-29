-- 1. Create the 'menu_items' table
create table menu_items (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  description text,
  price numeric,
  model_url text, -- The public URL of the 3D model
  qr_code_url text -- The generated QR code URL
);

-- 2. Enable Row Level Security (RLS)
alter table menu_items enable row level security;

-- 3. Create a policy that allows EVERYONE to READ menu items (so customers can see them)
create policy "Public items are viewable by everyone"
  on menu_items for select
  using ( true );

-- 4. Create a policy that allows LOGGED IN users (Admins) to INSERT/UPDATE/DELETE
create policy "Admins can insert items"
  on menu_items for insert
  with check ( auth.role() = 'authenticated' );

create policy "Admins can update items"
  on menu_items for update
  using ( auth.role() = 'authenticated' );

-- STORAGE POLICIES (You need to create a bucket named 'models' first!)
-- 1. Go to Storage -> New Bucket -> Name it "models" -> Make it Public
-- 2. Then run these policies if you want to be specific, or just leave it public.
