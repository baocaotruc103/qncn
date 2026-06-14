-- Schema Supabase/PostgreSQL cho form ke khai QNCN.
-- Chay file nay trong Supabase SQL Editor.

create extension if not exists pgcrypto;
create extension if not exists citext;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'user_role' and typnamespace = 'public'::regnamespace) then
    create type public.user_role as enum ('admin', 'user');
  end if;
end $$;

create table if not exists public.tai_khoan (
  id uuid not null default gen_random_uuid(),
  ho_va_ten character varying(255) not null,
  ten_dang_nhap public.citext not null,
  mat_khau text not null,
  vai_tro public.user_role not null default 'user'::public.user_role,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint tai_khoan_pkey primary key (id),
  constraint tai_khoan_ten_dang_nhap_key unique (ten_dang_nhap)
);

create index if not exists idx_tai_khoan_ten_dang_nhap on public.tai_khoan using btree (ten_dang_nhap);
create index if not exists idx_tai_khoan_vai_tro on public.tai_khoan using btree (vai_tro);

insert into public.tai_khoan (ho_va_ten, ten_dang_nhap, mat_khau, vai_tro)
values ('Administrator', 'admin', 'admin123', 'admin'::public.user_role)
on conflict (ten_dang_nhap) do nothing;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'file_qncn',
  'file_qncn',
  false,
  52428800,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf']
)
on conflict (id) do update set
  name = excluded.name,
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop table if exists public.luong_qua_trinh cascade;
drop table if exists public.ky_luat cascade;
drop table if exists public.khen_thuong cascade;
drop table if exists public.gia_dinh cascade;
drop table if exists public.dao_tao_lai cascade;
drop table if exists public.ho_so_qncn cascade;

create table public.ho_so_qncn (
  id uuid primary key default gen_random_uuid(),

  -- I. Thong tin chung
  ho_ten_khai_sinh text not null,
  ngay_sinh date not null,
  gioi_tinh text,
  don_vi text,
  thang_nam_vao_quan_doi char(7),
  so_cmqncn_cmsq text,
  ngay_cap_cmqncn_cmsq date,
  noi_cap_cmqncn_cmsq text,
  que_quan text,
  nhom_mau text,
  so_cccd text,
  ngay_cap_cccd date,
  noi_cap_cccd text,
  han_su_dung_cccd date,
  trinh_do_ngoai_ngu text,
  khoi_quan text default 'Dự toán',
  ho_ten_thuong_dung text,
  tinh_trang_hon_nhan text,
  noi_thuong_tru text,
  noi_thuong_tru_chi_tiet text,
  noi_tam_tru text,
  noi_tam_tru_chi_tiet text,
  noi_o_hien_tai text,
  noi_o_hien_tai_chi_tiet text,
  tn_tuyen_dung char(7),
  tn_nhap_ngu char(7),
  tn_xuat_ngu char(7),
  tn_tai_ngu char(7),
  tn_hsq_bs_sang_qncn char(7),
  tn_hsq_bs_sang_cnvqp char(7),
  tn_cnvqp_sang_qncn char(7),
  ngay_vao_doan date,
  ngay_vao_dang date,
  ngay_chinh_thuc_dang date,

  -- 29. Thong tin dao tao
  trinh_do_van_hoa text default '12/12',
  trinh_do_dao_tao_cao_nhat text,
  nganh_nghe_cao_nhat text,
  nam_tot_nghiep smallint,
  trinh_do_lien_quan_cnqs text,
  nganh_nghe_lien_quan_cnqs text,

  -- 31. Xep loai hoan thanh nhiem vu
  xep_loai_xuat_sac text,
  xep_loai_tot text,
  xep_loai_hoan_thanh text,
  xep_loai_khong_hoan_thanh text,

  -- 33 & 38. Dac diem nhan dang va suc khoe
  chieu_cao_m numeric(4,2),
  song_mui text,
  nep_tai_duoi text,
  dai_tai text,
  dau_vet_rieng text,
  han_dung char(7),
  thong_tin_suc_khoe text,

  -- 34. Thong tin BHXH/luong tong quat
  bat_dau_dong_bhxh char(7),
  so_so_bhxh text,
  theo_che_do text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.dao_tao_lai (
  id uuid primary key default gen_random_uuid(),
  ho_so_id uuid not null references public.ho_so_qncn(id) on delete cascade,
  loai text,
  bat_dau char(7),
  ket_thuc char(7),
  bac_dao_tao text,
  ten_truong text,
  thu_tu integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.gia_dinh (
  id uuid primary key default gen_random_uuid(),
  ho_so_id uuid not null references public.ho_so_qncn(id) on delete cascade,
  moi_quan_he text not null,
  ho_ten text not null,
  so_dien_thoai text,
  nam_sinh smallint,
  nghe_nghiep text,
  trang_thai text,
  nam_chet smallint,
  noi_o_hien_tai text,
  noi_o_chi_tiet text,
  thu_tu integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.khen_thuong (
  id uuid primary key default gen_random_uuid(),
  ho_so_id uuid not null references public.ho_so_qncn(id) on delete cascade,
  ngay date not null,
  danh_gia_xep_loai text,
  ly_do text,
  loai text,
  cap text,
  file_dinh_kem text,
  file_ten_goc text,
  file_mime_type text,
  file_size bigint,
  thu_tu integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.ky_luat (
  id uuid primary key default gen_random_uuid(),
  ho_so_id uuid not null references public.ho_so_qncn(id) on delete cascade,
  ngay date not null,
  danh_gia_xep_loai text,
  ly_do text,
  loai text,
  cap text,
  file_dinh_kem text,
  file_ten_goc text,
  file_mime_type text,
  file_size bigint,
  thu_tu integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.luong_qua_trinh (
  id uuid primary key default gen_random_uuid(),
  ho_so_id uuid not null references public.ho_so_qncn(id) on delete cascade,
  tu_thang char(7) not null,
  den_thang char(7),
  don_vi_cap_truc_thuoc text,
  don_vi_chi_tiet text,
  loai_thay_doi text,
  dien_quan_ly text,
  dien_bo_tri text,
  cap_bac text,
  chuc_vu_cnqs text,
  tn_dam_nhan_cnqs char(7),
  loai_ngach text,
  nhom text,
  bac text,
  he_so numeric(6,2),
  pc_vk numeric(6,2),
  he_so_bl numeric(6,2),
  pc_chuc_vu numeric(6,2),
  pc_tn_nghe numeric(6,2),
  tn_bat_dau_dam_nhan char(7),
  thu_tu integer not null default 0,
  created_at timestamptz not null default now()
);

create index idx_ho_so_qncn_ho_ten on public.ho_so_qncn (ho_ten_khai_sinh);
create index idx_ho_so_qncn_so_cccd on public.ho_so_qncn (so_cccd);
create index idx_ho_so_qncn_so_cmqncn on public.ho_so_qncn (so_cmqncn_cmsq);
create index idx_dao_tao_lai_ho_so on public.dao_tao_lai (ho_so_id);
create index idx_gia_dinh_ho_so on public.gia_dinh (ho_so_id);
create index idx_khen_thuong_ho_so on public.khen_thuong (ho_so_id);
create index idx_ky_luat_ho_so on public.ky_luat (ho_so_id);
create index idx_luong_qua_trinh_ho_so on public.luong_qua_trinh (ho_so_id);
create index idx_luong_qua_trinh_thang on public.luong_qua_trinh (ho_so_id, tu_thang, den_thang);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_ho_so_qncn_updated_at
before update on public.ho_so_qncn
for each row execute function public.set_updated_at();

create or replace function public.update_updated_at_column()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trigger_tai_khoan_updated_at on public.tai_khoan;
create trigger trigger_tai_khoan_updated_at
before update on public.tai_khoan
for each row execute function public.update_updated_at_column();

drop function if exists public.login_user(public.citext, text);
drop function if exists public.login_user(text, text);

create or replace function public.login_user(p_username text, p_password text)
returns table (
  id text,
  full_name character varying(255),
  username text,
  role text
)
language sql
security definer
set search_path = public
as $$
  select
    tk.id::text as id,
    tk.ho_va_ten as full_name,
    tk.ten_dang_nhap::text as username,
    tk.vai_tro::text as role
  from public.tai_khoan tk
  where lower(tk.ten_dang_nhap::text) = lower(p_username)
    and tk.mat_khau = p_password
  limit 1;
$$;

revoke all on function public.login_user(text, text) from public;
grant execute on function public.login_user(text, text) to anon, authenticated;
notify pgrst, 'reload schema';

-- RLS: cho phep frontend dung publishable/anon key toan quyen select/insert/update/delete.
-- Can than: anon full quyen phu hop demo/noi bo. Neu public internet, nen thay bang policy auth.uid().
alter table public.tai_khoan enable row level security;
alter table public.ho_so_qncn enable row level security;
alter table public.dao_tao_lai enable row level security;
alter table public.gia_dinh enable row level security;
alter table public.khen_thuong enable row level security;
alter table public.ky_luat enable row level security;
alter table public.luong_qua_trinh enable row level security;

drop policy if exists "anon_insert_ho_so_qncn" on public.ho_so_qncn;
drop policy if exists "anon_insert_dao_tao_lai" on public.dao_tao_lai;
drop policy if exists "anon_insert_gia_dinh" on public.gia_dinh;
drop policy if exists "anon_insert_khen_thuong" on public.khen_thuong;
drop policy if exists "anon_insert_ky_luat" on public.ky_luat;
drop policy if exists "anon_insert_luong_qua_trinh" on public.luong_qua_trinh;

drop policy if exists "anon_full_ho_so_qncn" on public.ho_so_qncn;
drop policy if exists "anon_full_dao_tao_lai" on public.dao_tao_lai;
drop policy if exists "anon_full_gia_dinh" on public.gia_dinh;
drop policy if exists "anon_full_khen_thuong" on public.khen_thuong;
drop policy if exists "anon_full_ky_luat" on public.ky_luat;
drop policy if exists "anon_full_luong_qua_trinh" on public.luong_qua_trinh;

create policy "anon_full_ho_so_qncn" on public.ho_so_qncn
for all to anon using (true) with check (true);

create policy "anon_full_dao_tao_lai" on public.dao_tao_lai
for all to anon using (true) with check (true);

create policy "anon_full_gia_dinh" on public.gia_dinh
for all to anon using (true) with check (true);

create policy "anon_full_khen_thuong" on public.khen_thuong
for all to anon using (true) with check (true);

create policy "anon_full_ky_luat" on public.ky_luat
for all to anon using (true) with check (true);

create policy "anon_full_luong_qua_trinh" on public.luong_qua_trinh
for all to anon using (true) with check (true);

drop policy if exists "anon_full_file_qncn_objects" on storage.objects;

create policy "anon_full_file_qncn_objects" on storage.objects
for all to anon
using (bucket_id = 'file_qncn')
with check (bucket_id = 'file_qncn');
