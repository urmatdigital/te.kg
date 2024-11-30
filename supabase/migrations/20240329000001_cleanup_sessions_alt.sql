-- Альтернативная функция для очистки всех сессий через TRUNCATE
create or replace function public.cleanup_all_sessions()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Отключаем проверку внешних ключей на время очистки
  set session_replication_role = 'replica';
  
  -- Очищаем все таблицы аутентификации
  truncate table auth.mfa_challenges cascade;
  truncate table auth.mfa_amr_claims cascade;
  truncate table auth.mfa_factors cascade;
  truncate table auth.refresh_tokens cascade;
  truncate table auth.sessions cascade;
  
  -- Возвращаем проверку внешних ключей
  set session_replication_role = 'origin';
end;
$$;
