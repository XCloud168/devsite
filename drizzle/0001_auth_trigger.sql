-- Custom SQL migration file, put your code below! --
create or replace function public.handle_new_user()
returns trigger as $$
declare
  generated_code text;
  code_exists boolean;
begin
  -- 循环直到生成唯一的邀请码
  loop
    -- 生成10位随机字符
    generated_code := substring(md5(random()::text) from 1 for 10);

    -- 检查是否已存在
    select exists(
      select 1
      from public.site_profiles
      where invite_code = generated_code
    ) into code_exists;

    -- 如果不存在，退出循环
    exit when not code_exists;
  end loop;

  insert into public.site_profiles (id, invite_code, username, avatar_url)
  values (
    new.id,
    generated_code,
    new.raw_user_meta_data->>'name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;
-- 绑定到 auth.users 表
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();
