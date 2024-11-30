-- Создаем функцию для очистки всех сессий
create or replace function public.cleanup_all_sessions()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Очищаем таблицу сессий
  delete from auth.sessions
  where id is not null;
  
  -- Очищаем таблицу refresh tokens
  delete from auth.refresh_tokens
  where id is not null;
  
  -- Очищаем факторы аутентификации
  delete from auth.mfa_factors
  where id is not null;
  
  -- Очищаем амулеты
  delete from auth.mfa_amr_claims
  where id is not null;
  
  -- Очищаем challenge factors
  delete from auth.mfa_challenges
  where id is not null;
end;
$$;
