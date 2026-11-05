-- ============================================
-- StartTechPro Support & Contacts
-- Migration 007: Support tickets and contact requests
-- ============================================

-- 1. Статус тикета поддержки
CREATE TYPE ticket_status AS ENUM ('open', 'in_progress', 'resolved', 'closed');

-- 2. Приоритет тикета
CREATE TYPE ticket_priority AS ENUM ('low', 'medium', 'high', 'urgent');

-- ============================================
-- Таблица: support_tickets (Тикеты поддержки)
-- ============================================
CREATE TABLE IF NOT EXISTS support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status ticket_status NOT NULL DEFAULT 'open',
  priority ticket_priority NOT NULL DEFAULT 'medium',
  category TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_support_tickets_user_id ON support_tickets(user_id);
CREATE INDEX idx_support_tickets_status ON support_tickets(status);
CREATE INDEX idx_support_tickets_created_at ON support_tickets(created_at DESC);

-- ============================================
-- Таблица: contact_requests (Запросы с сайта)
-- ============================================
CREATE TABLE IF NOT EXISTS contact_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  source TEXT DEFAULT 'website',
  status TEXT NOT NULL DEFAULT 'new',
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_contact_requests_status ON contact_requests(status);
CREATE INDEX idx_contact_requests_created_at ON contact_requests(created_at DESC);

-- ============================================
-- RLS Policies
-- ============================================

ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_requests ENABLE ROW LEVEL SECURITY;

-- support_tickets: пользователь видит свои тикеты
CREATE POLICY "Users view own tickets" ON support_tickets
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users insert own tickets" ON support_tickets
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- contact_requests: только service_role (публичная форма)
CREATE POLICY "Anyone can insert contact requests" ON contact_requests
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Service role full access contact requests" ON contact_requests
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Service role full access support tickets" ON support_tickets
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- ============================================
-- Триггер updated_at
-- ============================================
CREATE TRIGGER update_support_tickets_updated_at
  BEFORE UPDATE ON support_tickets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();