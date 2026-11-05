-- ============================================
-- StartTechPro Financial Architecture
-- Migration 001: Wallets, Transactions, Partners, Investments
-- ============================================

-- 1. Тип транзакции
CREATE TYPE transaction_type AS ENUM (
  'topup',
  'subscription_deduction',
  'infrastructure_purchase',
  'ai_usage',
  'payout',
  'refund',
  'partner_commission',
  'royalty_deduction',
  'investment_dividend'
);

-- 2. Тип подписки
CREATE TYPE subscription_tier AS ENUM ('starter', 'pro', 'enterprise');

-- 3. Статус реферала
CREATE TYPE referral_status AS ENUM ('active', 'paused', 'banned');

-- 4. Статус инвестиции
CREATE TYPE investment_status AS ENUM ('pending', 'active', 'completed', 'refunded');

-- 5. Уровень SLA для White-Label
CREATE TYPE sla_tier AS ENUM ('standard', 'premium', 'enterprise');

-- 6. Тип проекта
CREATE TYPE project_type AS ENUM ('website', 'platform', 'ai-agent', 'telegram-bot', 'mobile', 'other');

-- 7. Статус проекта
CREATE TYPE project_status AS ENUM ('provisioning', 'active', 'suspended', 'archived');

-- ============================================
-- Таблица: user_wallets (Кошельки пользователей)
-- ============================================
CREATE TABLE IF NOT EXISTS user_wallets (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  balance INTEGER NOT NULL DEFAULT 0 CHECK (balance >= 0),
  subscription_tier subscription_tier NOT NULL DEFAULT 'starter',
  subscription_next_billing_date TIMESTAMP WITH TIME ZONE,
  is_blocked BOOLEAN NOT NULL DEFAULT false,
  blocked_at TIMESTAMP WITH TIME ZONE,
  block_reason TEXT,
  read_only_since TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- ============================================
-- Таблица: wallet_transactions (История транзакций)
-- ============================================
CREATE TABLE IF NOT EXISTS wallet_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type transaction_type NOT NULL,
  amount INTEGER NOT NULL, -- в копейках
  currency TEXT NOT NULL DEFAULT 'RUB',
  balance_after INTEGER NOT NULL,
  description TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  invoice_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_wallet_transactions_user_id ON wallet_transactions(user_id);
CREATE INDEX idx_wallet_transactions_created_at ON wallet_transactions(created_at DESC);
CREATE INDEX idx_wallet_transactions_type ON wallet_transactions(type);

-- ============================================
-- Таблица: projects (Проекты пользователей)
-- ============================================
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type project_type NOT NULL,
  description TEXT,
  status project_status NOT NULL DEFAULT 'provisioning',
  subdomain TEXT,
  custom_domain TEXT,
  vercel_project_id TEXT,
  deployment_url TEXT,
  branch_name TEXT,
  tenant_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_projects_status ON projects(status);

-- ============================================
-- Таблица: partner_referrals (Партнёрская программа)
-- ============================================
CREATE TABLE IF NOT EXISTS partner_referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  referred_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  commission_rate DECIMAL(5,2) NOT NULL DEFAULT 20.00, -- % от подписки
  lifetime_earnings INTEGER NOT NULL DEFAULT 0, -- в копейках
  status referral_status NOT NULL DEFAULT 'active',
  referral_code TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE(partner_id, referred_user_id)
);

CREATE INDEX idx_partner_referrals_partner_id ON partner_referrals(partner_id);
CREATE INDEX idx_partner_referrals_referral_code ON partner_referrals(referral_code);

-- ============================================
-- Таблица: project_investments (Краудфандинг проектов)
-- ============================================
CREATE TABLE IF NOT EXISTS project_investments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  investor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL, -- в копейках
  equity_share DECIMAL(5,2), -- % доли (nullable для donation-модели)
  status investment_status NOT NULL DEFAULT 'pending',
  investment_agreement_url TEXT,
  expected_roi DECIMAL(5,2),
  paid_dividends INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_project_investments_project_id ON project_investments(project_id);
CREATE INDEX idx_project_investments_investor_id ON project_investments(investor_id);

-- ============================================
-- Таблица: platform_investors (Инвесторы платформы)
-- ============================================
CREATE TABLE IF NOT EXISTS platform_investors (
  investor_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  investment_amount INTEGER NOT NULL, -- в копейках
  revenue_share_rate DECIMAL(5,2) NOT NULL, -- % от MRR
  multiplication_target DECIMAL(4,2) NOT NULL DEFAULT 3.00, -- цель X3
  current_multiplication DECIMAL(5,2) NOT NULL DEFAULT 0,
  total_paid INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  last_payout_at TIMESTAMP WITH TIME ZONE
);

-- ============================================
-- Таблица: white_label_licenses (White-Label лицензии)
-- ============================================
CREATE TABLE IF NOT EXISTS white_label_licenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  licensee_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  brand_name TEXT NOT NULL,
  custom_domain TEXT,
  license_fee INTEGER NOT NULL, -- единовременный платёж в копейках
  royalty_rate DECIMAL(5,2) NOT NULL DEFAULT 20.00, -- % от выручки их клиентов
  sla_tier sla_tier NOT NULL DEFAULT 'standard',
  dedicated_servers BOOLEAN NOT NULL DEFAULT false,
  audit_security BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  activated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_white_label_licenses_licensee ON white_label_licenses(licensee_id);

-- ============================================
-- Таблица: subscription_history (История подписок)
-- ============================================
CREATE TABLE IF NOT EXISTS subscription_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tier subscription_tier NOT NULL,
  amount INTEGER NOT NULL, -- в копейках
  period_start TIMESTAMP WITH TIME ZONE NOT NULL,
  period_end TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  transaction_id UUID REFERENCES wallet_transactions(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_subscription_history_user_id ON subscription_history(user_id);

-- ============================================
-- RLS Policies (Безопасность)
-- ============================================

-- Включаем RLS на всех таблицах
ALTER TABLE user_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_investments ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_investors ENABLE ROW LEVEL SECURITY;
ALTER TABLE white_label_licenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_history ENABLE ROW LEVEL SECURITY;

-- user_wallets: пользователь видит только свой кошелёк
CREATE POLICY "Users view own wallet" ON user_wallets
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users update own wallet" ON user_wallets
  FOR UPDATE USING (auth.uid() = user_id);

-- wallet_transactions: пользователь видит только свои транзакции
CREATE POLICY "Users view own transactions" ON wallet_transactions
  FOR SELECT USING (auth.uid() = user_id);

-- projects: пользователь видит только свои проекты
CREATE POLICY "Users view own projects" ON projects
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users insert own projects" ON projects
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own projects" ON projects
  FOR UPDATE USING (auth.uid() = user_id);

-- partner_referrals: партнёр видит свои рефералы
CREATE POLICY "Partners view own referrals" ON partner_referrals
  FOR SELECT USING (auth.uid() = partner_id);

-- project_investments: инвестор видит свои инвестиции
CREATE POLICY "Investors view own investments" ON project_investments
  FOR SELECT USING (auth.uid() = investor_id);

-- platform_investors: инвестор видит свой профиль
CREATE POLICY "Investors view own profile" ON platform_investors
  FOR SELECT USING (auth.uid() = investor_id);

-- white_label_licenses: лицензиат видит свою лицензию
CREATE POLICY "Licensees view own license" ON white_label_licenses
  FOR SELECT USING (auth.uid() = licensee_id);

-- subscription_history: пользователь видит свою историю
CREATE POLICY "Users view own subscriptions" ON subscription_history
  FOR SELECT USING (auth.uid() = user_id);

-- ============================================
-- Admin policies (доступ для service_role)
-- ============================================
CREATE POLICY "Service role full access wallets" ON user_wallets
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Service role full access transactions" ON wallet_transactions
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Service role full access projects" ON projects
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Service role full access referrals" ON partner_referrals
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Service role full access investments" ON project_investments
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Service role full access investors" ON platform_investors
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Service role full access licenses" ON white_label_licenses
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Service role full access subscriptions" ON subscription_history
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- ============================================
-- Функция: автоматическое создание кошелька при регистрации
-- ============================================
CREATE OR REPLACE FUNCTION handle_new_user_wallet()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_wallets (user_id, balance, subscription_tier)
  VALUES (NEW.id, 0, 'starter');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Триггер на создание кошелька
DROP TRIGGER IF EXISTS on_auth_user_created_wallet ON auth.users;
CREATE TRIGGER on_auth_user_created_wallet
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user_wallet();

-- ============================================
-- Функция: обновление updated_at
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_wallets_updated_at
  BEFORE UPDATE ON user_wallets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();