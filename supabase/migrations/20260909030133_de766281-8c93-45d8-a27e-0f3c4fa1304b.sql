-- Roles
create type public.app_role as enum ('admin');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create policy "Users can read own roles" on public.user_roles
  for select to authenticated using (user_id = auth.uid());

-- First registered user becomes admin
create or replace function public.handle_new_user_admin()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if not exists (select 1 from public.user_roles where role = 'admin') then
    insert into public.user_roles (user_id, role) values (new.id, 'admin');
  end if;
  return new;
end;
$$;
create trigger on_auth_user_created_admin
  after insert on auth.users
  for each row execute function public.handle_new_user_admin();

-- updated_at helper
create or replace function public.set_updated_at()
returns trigger language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end; $$;

-- Site profile (singleton: about content + stats)
create table public.profiles (
  id int primary key default 1 check (id = 1),
  name text not null default 'Wisnu Akbar Aridho',
  headline text not null default 'Creative digital professional crafting meaningful digital experiences through design, technology, and ideas.',
  bio text not null default '',
  location text not null default 'Indonesia',
  email text not null default '',
  years_experience int not null default 5,
  projects_completed int not null default 20,
  technologies_count int not null default 10,
  profile_image_url text,
  resume_url text,
  availability_status text not null default 'Available for selected projects',
  updated_at timestamptz not null default now()
);
grant select on public.profiles to anon, authenticated;
grant insert, update on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;
create policy "Public read profile" on public.profiles for select using (true);
create policy "Admin upsert profile" on public.profiles for insert to authenticated with check (public.has_role(auth.uid(), 'admin'));
create policy "Admin update profile" on public.profiles for update to authenticated using (public.has_role(auth.uid(), 'admin'));
create trigger profiles_updated_at before update on public.profiles for each row execute function public.set_updated_at();

insert into public.profiles (id, bio, email) values (1,
 'I am a creative digital professional based in Indonesia. I work at the intersection of design, code, and ideas — building interfaces and experiences that feel considered, fast, and human. Over the past years I have explored web development, product design, and motion, shipping work for clients and personal projects alike.',
 'hello@wisnuakbar.dev');

-- Projects
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text not null default '',
  category text not null default 'Web',
  year int not null default extract(year from now()),
  client text,
  role text,
  technologies text[] not null default '{}',
  thumbnail_url text,
  hero_image_url text,
  project_url text,
  github_url text,
  overview text,
  challenge text,
  solution text,
  process text,
  result text,
  featured boolean not null default false,
  published boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.projects to anon, authenticated;
grant insert, update, delete on public.projects to authenticated;
grant all on public.projects to service_role;
alter table public.projects enable row level security;
create policy "Public read published projects" on public.projects for select using (published = true or public.has_role(auth.uid(), 'admin'));
create policy "Admin insert projects" on public.projects for insert to authenticated with check (public.has_role(auth.uid(), 'admin'));
create policy "Admin update projects" on public.projects for update to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "Admin delete projects" on public.projects for delete to authenticated using (public.has_role(auth.uid(), 'admin'));
create trigger projects_updated_at before update on public.projects for each row execute function public.set_updated_at();

create table public.project_images (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  image_url text not null,
  caption text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
grant select on public.project_images to anon, authenticated;
grant insert, update, delete on public.project_images to authenticated;
grant all on public.project_images to service_role;
alter table public.project_images enable row level security;
create policy "Public read project images" on public.project_images for select using (
  exists (select 1 from public.projects p where p.id = project_id and (p.published = true or public.has_role(auth.uid(), 'admin')))
);
create policy "Admin insert project images" on public.project_images for insert to authenticated with check (public.has_role(auth.uid(), 'admin'));
create policy "Admin update project images" on public.project_images for update to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "Admin delete project images" on public.project_images for delete to authenticated using (public.has_role(auth.uid(), 'admin'));

-- Skills
create table public.skills (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null default 'Frontend',
  icon text,
  description text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
grant select on public.skills to anon, authenticated;
grant insert, update, delete on public.skills to authenticated;
grant all on public.skills to service_role;
alter table public.skills enable row level security;
create policy "Public read skills" on public.skills for select using (true);
create policy "Admin insert skills" on public.skills for insert to authenticated with check (public.has_role(auth.uid(), 'admin'));
create policy "Admin update skills" on public.skills for update to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "Admin delete skills" on public.skills for delete to authenticated using (public.has_role(auth.uid(), 'admin'));

insert into public.skills (name, category, sort_order) values
 ('React','Frontend',1),('Next.js','Frontend',2),('TypeScript','Frontend',3),('JavaScript','Frontend',4),('Tailwind CSS','Frontend',5),
 ('Node.js','Backend',6),('Supabase','Backend',7),('PostgreSQL','Backend',8),
 ('Figma','Design',9),('UI/UX','Design',10),('Motion Design','Design',11),
 ('Git','Tools',12),('GitHub','Tools',13),('VS Code','Tools',14);

-- Experiences
create table public.experiences (
  id uuid primary key default gen_random_uuid(),
  company text not null,
  role text not null,
  start_date date not null,
  end_date date,
  description text not null default '',
  technologies text[] not null default '{}',
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
grant select on public.experiences to anon, authenticated;
grant insert, update, delete on public.experiences to authenticated;
grant all on public.experiences to service_role;
alter table public.experiences enable row level security;
create policy "Public read experiences" on public.experiences for select using (true);
create policy "Admin insert experiences" on public.experiences for insert to authenticated with check (public.has_role(auth.uid(), 'admin'));
create policy "Admin update experiences" on public.experiences for update to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "Admin delete experiences" on public.experiences for delete to authenticated using (public.has_role(auth.uid(), 'admin'));

insert into public.experiences (company, role, start_date, end_date, description, technologies, sort_order) values
 ('Freelance','Creative Developer','2023-01-01',null,'Designing and building websites, landing pages, and digital experiences for clients and personal ventures.', '{React,TypeScript,Tailwind CSS,Supabase}',1),
 ('Personal Projects','Designer & Developer','2021-01-01','2022-12-31','Explored UI/UX design, motion, and front-end engineering through self-initiated projects.', '{Figma,JavaScript,Motion Design}',2);

-- Services
create table public.services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
grant select on public.services to anon, authenticated;
grant insert, update, delete on public.services to authenticated;
grant all on public.services to service_role;
alter table public.services enable row level security;
create policy "Public read services" on public.services for select using (true);
create policy "Admin insert services" on public.services for insert to authenticated with check (public.has_role(auth.uid(), 'admin'));
create policy "Admin update services" on public.services for update to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "Admin delete services" on public.services for delete to authenticated using (public.has_role(auth.uid(), 'admin'));

insert into public.services (title, description, sort_order) values
 ('Web Development','Fast, accessible, production-ready websites and web apps.',1),
 ('UI/UX Design','Interfaces that are clear, considered, and a pleasure to use.',2),
 ('Creative Development','Motion, interaction, and visual experiments that make brands memorable.',3),
 ('Digital Experiences','Immersive, story-driven experiences across the web.',4),
 ('Landing Pages','High-converting pages with premium visual craft.',5),
 ('Portfolio & Personal Branding','Personal sites and brand systems that stand out.',6);

-- Social links
create table public.social_links (
  id uuid primary key default gen_random_uuid(),
  platform text not null,
  url text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
grant select on public.social_links to anon, authenticated;
grant insert, update, delete on public.social_links to authenticated;
grant all on public.social_links to service_role;
alter table public.social_links enable row level security;
create policy "Public read social links" on public.social_links for select using (true);
create policy "Admin insert social links" on public.social_links for insert to authenticated with check (public.has_role(auth.uid(), 'admin'));
create policy "Admin update social links" on public.social_links for update to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "Admin delete social links" on public.social_links for delete to authenticated using (public.has_role(auth.uid(), 'admin'));

insert into public.social_links (platform, url, sort_order) values
 ('GitHub','https://github.com',1),('LinkedIn','https://linkedin.com',2),('Instagram','https://instagram.com',3);

-- Media library
create table public.media (
  id uuid primary key default gen_random_uuid(),
  path text not null unique,
  url text not null,
  name text not null,
  mime_type text,
  size int,
  created_at timestamptz not null default now()
);
grant select on public.media to anon, authenticated;
grant insert, update, delete on public.media to authenticated;
grant all on public.media to service_role;
alter table public.media enable row level security;
create policy "Public read media" on public.media for select using (true);
create policy "Admin insert media" on public.media for insert to authenticated with check (public.has_role(auth.uid(), 'admin'));
create policy "Admin delete media" on public.media for delete to authenticated using (public.has_role(auth.uid(), 'admin'));