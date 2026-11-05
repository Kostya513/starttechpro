-- ============================================
-- StartTechPro Project Versions
-- Migration 004: Versioning for Live Editor
-- ============================================

-- 1. Тип автора изменения
CREATE TYPE commit_author AS ENUM ('user', 'ai-agent', 'system');

-- 2. Статус коммита
CREATE TYPE commit_status AS ENUM ('draft', 'preview', 'approved', 'merged', 'rolled_back', 'rejected');

-- ============================================
-- Таблица: project_versions (Версии проектов)
-- ============================================
CREATE TABLE IF NOT EXISTS project_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  parent_version_id UUID REFERENCES project_versions(id),
  branch TEXT NOT NULL DEFAULT 'main',
  
  -- Метаданные
  title TEXT NOT NULL,
  description TEXT,
  author commit_author NOT NULL DEFAULT 'user',
  agent_name TEXT,
  status commit_status NOT NULL DEFAULT 'draft',
  
  -- Содержимое изменения
  files JSONB NOT NULL DEFAULT '[]'::jsonb, -- массив {path, type, diff, content}
  
  -- RAG-контекст
  rag_context JSONB DEFAULT '{}'::jsonb, -- {userRequest, aiRationale, relevantHistory}
  
  -- A/B тестирование
  ab_test JSONB DEFAULT NULL, -- {variant, metrics: {impressions, conversions, conversionRate}}
  
  -- Производительность
  performance JSONB DEFAULT NULL, -- {beforeLoadTime, afterLoadTime, beforeLighthouse, afterLighthouse}
  
  -- Временные метки
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  
  -- Уникальность: один номер версии на проект
  UNIQUE(project_id, version_number)
);

CREATE INDEX idx_project_versions_project_id ON project_versions(project_id);
CREATE INDEX idx_project_versions_parent ON project_versions(parent_version_id);
CREATE INDEX idx_project_versions_status ON project_versions(status);
CREATE INDEX idx_project_versions_created_at ON project_versions(created_at DESC);

-- ============================================
-- RLS Policies
-- ============================================

ALTER TABLE project_versions ENABLE ROW LEVEL SECURITY;

-- project_versions: пользователь видит версии своих проектов
CREATE POLICY "Users view own project versions" ON project_versions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM projects WHERE projects.id = project_versions.project_id AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users insert own project versions" ON project_versions
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects WHERE projects.id = project_versions.project_id AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users update own project versions" ON project_versions
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM projects WHERE projects.id = project_versions.project_id AND projects.user_id = auth.uid()
    )
  );

-- Service role: полный доступ
CREATE POLICY "Service role full access project versions" ON project_versions
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- ============================================
-- Функция: автоинкремент version_number
-- ============================================
CREATE OR REPLACE FUNCTION get_next_version_number(p_project_id UUID)
RETURNS INTEGER AS $$
DECLARE
  next_version INTEGER;
BEGIN
  SELECT COALESCE(MAX(version_number), 0) + 1 INTO next_version
  FROM project_versions
  WHERE project_id = p_project_id;
  RETURN next_version;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- Триггер updated_at
-- ============================================
CREATE TRIGGER update_project_versions_updated_at
  BEFORE UPDATE ON project_versions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();