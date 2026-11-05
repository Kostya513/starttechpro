-- ============================================
-- StartTechPro Legal Compliance
-- Migration 002: Consent fields for 152-ФЗ
-- ============================================

-- Добавляем поля согласий в таблицу profiles
-- (создаём таблицу profiles, если её нет)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  
  -- Поля согласий (152-ФЗ)
  accepted_offer_at TIMESTAMP WITH TIME ZONE,       -- дата принятия оферты
  accepted_privacy_at TIMESTAMP WITH TIME ZONE,      -- дата согласия на обработку ПДн
  accepted_newsletter_at TIMESTAMP WITH TIME ZONE,   -- дата согласия на рассылку
  
  -- Метаданные
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- RLS для profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Service role full access profiles" ON profiles
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Функция: автоматическое создание профиля при регистрации
CREATE OR REPLACE FUNCTION handle_new_user_profile()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'full_name',
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Триггер на создание профиля
DROP TRIGGER IF EXISTS on_auth_user_created_profile ON auth.users;
CREATE TRIGGER on_auth_user_created_profile
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user_profile();

-- Обновляем триггер updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();