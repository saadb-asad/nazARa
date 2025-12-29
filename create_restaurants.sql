create table if not exists restaurants (
  id uuid default gen_random_uuid() primary key,
  name text not null unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Seed existing from menu_items
insert into restaurants (name)
select distinct restaurant_name from menu_items
where restaurant_name is not null
on conflict (name) do nothing;
