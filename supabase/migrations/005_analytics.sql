-- ============================================
-- StartTechPro Analytics
-- Migration 005: Real analytics data
-- ============================================

-- 1. Тип события аналитики
CREATE TYPE analytics_event_type AS ENUM (
  'page_view',
  'conversion',
  'error',
  'api_call',
  'ai_request',
  'deployment',
  'login',
  'signup',
  'payment'
);

-- ============================================
-- Таблица: analytics_events (События аналитики)
-- ============================================
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  event_type analytics_event_type NOT NULL,
  event_name TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  ip_address TEXT,
  user_agent TEXT,
  session_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_analytics_events_project_id ON analytics_events(project_id);
CREATE INDEX idx_analytics_events_user_id ON analytics_events(user_id);
CREATE INDEX idx_analytics_events_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_events_created_at ON analytics_events(created_at DESC);
CREATE INDEX idx_analytics_events_session ON analytics_events(session_id);

-- ============================================
-- Таблица: analytics_snapshots (Ежедневные снимки метрик)
-- ============================================
CREATE TABLE IF NOT EXISTS analytics_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  
  -- Метрики
  page_views INTEGER NOT NULL DEFAULT 0,
  unique_visitors INTEGER NOT NULL DEFAULT 0,
  conversions INTEGER NOT NULL DEFAULT 0,
  errors INTEGER NOT NULL DEFAULT 0,
  api_calls INTEGER NOT NULL DEFAULT 0,
  ai_requests INTEGER NOT NULL DEFAULT 0,
  avg_session_duration_seconds INTEGER NOT NULL DEFAULT 0,
  bounce_rate DECIMAL(5,2) NOT NULL DEFAULT 0,
  
  -- Детализация
  top_pages JSONB DEFAULT '[]'::jsonb,
  traffic_sources JSONB DEFAULT '[]'::jsonb,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE(project_id, date)
);

CREATE INDEX idx_analytics_snapshots_project_date ON analytics_snapshots(project_id, date DESC);

-- ============================================
-- RLS Policies
-- ============================================

ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_snapshots ENABLE ROW LEVEL SECURITY;

-- analytics_events: пользователь видит события своих проектов
CREATE POLICY "Users view own analytics events" ON analytics_events
  FOR SELECT USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM projects WHERE projects.id = analytics_events.project_id AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users insert own analytics events" ON analytics_events
  FOR INSERT WITH CHECK (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM projects WHERE projects.id = analytics_events.project_id AND projects.user_id = auth.uid()
    )
  );

-- analytics_snapshots: пользователь видит снимки своих проектов
CREATE POLICY "Users view own analytics snapshots" ON analytics_snapshots
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM projects WHERE projects.id = analytics_snapshots.project_id AND projects.user_id = auth.uid()
    )
  );

-- Service role: полный доступ
CREATE POLICY "Service role full access analytics events" ON analytics_events
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Service role full access analytics snapshots" ON analytics_snapshots
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- ============================================
-- Функция: трекинг события
-- ============================================
CREATE OR REPLACE FUNCTION track_event(
  p_project_id UUID,
  p_user_id UUID,
  p_event_type analytics_event_type,
  p_event_name TEXT,
  p_metadata JSONB DEFAULT '{}'::jsonb,
  p_ip_address TEXT DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL,
  p_session_id TEXT DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
  v_event_id UUID;
BEGIN
  INSERT INTO analytics_events (
    project_id, user_id, event_type, event_name,
    metadata, ip_address, user_agent, session_id
  ) VALUES (
    p_project_id, p_user_id, p_event_type, p_event_name,
    p_metadata, p_ip_address, p_user_agent, p_session_id
  ) RETURNING id INTO v_event_id;
  
  RETURN v_event_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;