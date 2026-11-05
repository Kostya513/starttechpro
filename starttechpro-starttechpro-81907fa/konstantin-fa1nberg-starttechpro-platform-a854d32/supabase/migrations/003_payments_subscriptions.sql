-- ============================================
-- StartTechPro Payments & Subscriptions
-- Migration 003: Missing tables for billing flow
-- ============================================

-- 1. Статус платежа
CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');

-- 2. Статус подписки
CREATE TYPE subscription_status AS ENUM ('active', 'cancelled', 'expired', 'past_due');

-- ============================================
-- Таблица: payments (Платежи через YooKassa)
-- ============================================
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  yookassa_id TEXT NOT NULL UNIQUE,
  amount INTEGER NOT NULL CHECK (amount > 0),          -- в копейках
  currency TEXT NOT NULL DEFAULT 'RUB',
  status payment_status NOT NULL DEFAULT 'pending',
  payment_method TEXT,                                   -- card, sbp, etc.
  plan_id TEXT,                                          -- starter/pro/enterprise (для подписок)
  description TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_yookassa_id ON payments(yookassa_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_created_at ON payments(created_at DESC);

-- ============================================
-- Таблица: subscriptions (Подписки пользователей)
-- ============================================
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id TEXT NOT NULL DEFAULT 'starter',               -- starter/pro/enterprise
  status subscription_status NOT NULL DEFAULT 'active',
  current_period_start TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancel_at_period_end BOOLEAN NOT NULL DEFAULT false,
  trial_end TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_plan_id ON subscriptions(plan_id);

-- ============================================
-- RLS Policies
-- ============================================

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- payments: пользователь видит только свои платежи
CREATE POLICY "Users view own payments" ON payments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users insert own payments" ON payments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- subscriptions: пользователь видит только свою подписку
CREATE POLICY "Users view own subscription" ON subscriptions
  FOR SELECT USING (auth.uid() = user_id);

-- Service role: полный доступ
CREATE POLICY "Service role full access payments" ON payments
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Service role full access subscriptions" ON subscriptions
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- ============================================
-- Функция: автосоздание подписки при регистрации
-- ============================================
CREATE OR REPLACE FUNCTION handle_new_user_subscription()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.subscriptions (
    user_id,
    plan_id,
    status,
    current_period_start,
    current_period_end
  ) VALUES (
    NEW.id,
    'starter',
    'active',
    NOW(),
    NOW() + INTERVAL '1 month'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Триггер на создание подписки
DROP TRIGGER IF EXISTS on_auth_user_created_subscription ON auth.users;
CREATE TRIGGER on_auth_user_created_subscription
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user_subscription();

-- ============================================
-- Триггеры updated_at
-- ============================================
CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON payments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();