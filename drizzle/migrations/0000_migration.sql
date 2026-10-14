create type public.app_role as enum ('admin','staff');
create type public.appointment_status as enum ('pending','confirmed','completed','cancelled');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;
create or replace function public.is_staff(_user_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id)
$$;
create policy "own roles readable" on public.user_roles for select to authenticated using (user_id = auth.uid() or public.has_role(auth.uid(),'admin'));

-- first user becomes admin
create or replace function public.handle_new_user_role()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if not exists (select 1 from public.user_roles) then
    insert into public.user_roles (user_id, role) values (new.id, 'admin');
  end if;
  return new;
end $$;
create trigger on_auth_user_created_role after insert on auth.users for each row execute function public.handle_new_user_role();

create table public.services (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null default 'Styling',
  description text not null default '',
  price numeric(10,2) not null default 0,
  duration_minutes int not null default 60,
  is_sample_price boolean not null default true,
  active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
grant select on public.services to anon, authenticated;
grant insert, update, delete on public.services to authenticated;
grant all on public.services to service_role;
alter table public.services enable row level security;
create policy "public reads active services" on public.services for select to anon, authenticated using (active or public.is_staff(auth.uid()));
create policy "staff manage services" on public.services for all to authenticated using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));

insert into public.services (name, category, description, price, duration_minutes, sort_order) values
('Knotless Box Braids','Braiding','Lightweight, tension-free braids in your chosen length and size.',650,240,1),
('Haircut & Style','Cutting','Consultation, precision cut and finish tailored to your face shape.',280,60,2),
('Full Colour','Colouring','Rich, even all-over colour with professional-grade products.',550,120,3),
('Deep Conditioning Treatment','Treatments','Intensive moisture treatment to nourish dry or damaged hair.',300,45,4),
('Wash & Blow-Dry','Styling','Cleanse, condition and a smooth, voluminous blow-dry finish.',200,45,5),
('Wig Installation & Styling','Wigs','Secure, natural-looking installation with custom styling.',500,90,6),
('Special Occasion Hairstyle','Occasions','Elegant updos and styles for weddings, matric dances and events.',450,90,7);

create table public.appointments (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique default ('LM-' || upper(substr(md5(random()::text),1,6))),
  service_id uuid references public.services(id) on delete set null,
  service_name text not null,
  duration_minutes int not null,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  customer_name text not null,
  customer_phone text not null,
  customer_email text not null,
  special_requests text,
  status public.appointment_status not null default 'pending',
  created_at timestamptz not null default now()
);
grant select, update, delete on public.appointments to authenticated;
grant all on public.appointments to service_role;
alter table public.appointments enable row level security;
create policy "staff manage appointments" on public.appointments for all to authenticated using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));

create or replace function public.get_booked_slots(_day date)
returns table (starts_at timestamptz, ends_at timestamptz)
language sql stable security definer set search_path = public as $$
  select a.starts_at, a.ends_at from public.appointments a
  where a.status in ('pending','confirmed')
    and a.starts_at < (_day + 1)::timestamp at time zone 'Africa/Johannesburg'
    and a.ends_at > _day::timestamp at time zone 'Africa/Johannesburg'
$$;
grant execute on function public.get_booked_slots(date) to anon, authenticated;

create or replace function public.book_appointment(_service_id uuid, _starts_at timestamptz, _name text, _phone text, _email text, _requests text)
returns text language plpgsql security definer set search_path = public as $$
declare s record; _end timestamptz; _ref text;
begin
  if length(trim(coalesce(_name,''))) < 2 or length(_name) > 100 then raise exception 'Please enter your full name.'; end if;
  if length(trim(coalesce(_phone,''))) < 7 or length(_phone) > 30 then raise exception 'Please enter a valid phone number.'; end if;
  if _email !~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' or length(_email) > 255 then raise exception 'Please enter a valid email address.'; end if;
  if length(coalesce(_requests,'')) > 1000 then raise exception 'Special requests are too long.'; end if;
  if _starts_at < now() then raise exception 'Please choose a time in the future.'; end if;
  select * into s from public.services where id = _service_id and active;
  if not found then raise exception 'That service is not available.'; end if;
  _end := _starts_at + make_interval(mins => s.duration_minutes);
  perform pg_advisory_xact_lock(hashtext('booking'));
  if exists (select 1 from public.appointments where status in ('pending','confirmed') and starts_at < _end and ends_at > _starts_at) then
    raise exception 'Sorry, that time has just been booked. Please choose another slot.';
  end if;
  insert into public.appointments (service_id, service_name, duration_minutes, starts_at, ends_at, customer_name, customer_phone, customer_email, special_requests)
  values (s.id, s.name, s.duration_minutes, _starts_at, _end, trim(_name), trim(_phone), lower(trim(_email)), nullif(trim(_requests),''))
  returning reference into _ref;
  return _ref;
end $$;
grant execute on function public.book_appointment(uuid, timestamptz, text, text, text, text) to anon, authenticated;

create table public.enquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(name) between 1 and 100),
  email text not null check (length(email) between 3 and 255),
  phone text check (length(phone) <= 30),
  message text not null check (length(message) between 1 and 2000),
  status text not null default 'new',
  created_at timestamptz not null default now()
);
grant insert on public.enquiries to anon, authenticated;
grant select, update, delete on public.enquiries to authenticated;
grant all on public.enquiries to service_role;
alter table public.enquiries enable row level security;
create policy "anyone can send enquiry" on public.enquiries for insert to anon, authenticated with check (status = 'new');
create policy "staff read enquiries" on public.enquiries for select to authenticated using (public.is_staff(auth.uid()));
create policy "staff update enquiries" on public.enquiries for update to authenticated using (public.is_staff(auth.uid()));
create policy "staff delete enquiries" on public.enquiries for delete to authenticated using (public.is_staff(auth.uid()));

create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  notes text,
  priority text not null default 'medium',
  due_date date,
  time_slot text,
  done boolean not null default false,
  created_by uuid,
  created_at timestamptz not null default now()
);
create table public.saved_messages (
  id uuid primary key default gen_random_uuid(),
  purpose text not null,
  tone text not null,
  content text not null,
  created_by uuid,
  created_at timestamptz not null default now()
);
create table public.meeting_notes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  original_notes text not null,
  summary jsonb not null,
  created_by uuid,
  created_at timestamptz not null default now()
);
grant select, insert, update, delete on public.tasks, public.saved_messages, public.meeting_notes to authenticated;
grant all on public.tasks, public.saved_messages, public.meeting_notes to service_role;
alter table public.tasks enable row level security;
alter table public.saved_messages enable row level security;
alter table public.meeting_notes enable row level security;
create policy "staff tasks" on public.tasks for all to authenticated using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));
create policy "staff messages" on public.saved_messages for all to authenticated using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));
create policy "staff notes" on public.meeting_notes for all to authenticated using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));
