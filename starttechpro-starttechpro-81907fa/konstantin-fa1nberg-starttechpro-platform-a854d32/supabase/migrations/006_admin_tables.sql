-- ============================================
-- StartTechPro Admin Tables
-- Migration 006: Tasks, Agent Executions, Audit Logs
-- ============================================

-- 1. Статус задачи
CREATE TYPE task_status AS ENUM ('todo', 'in_progress', 'review', 'done', 'cancelled');

-- 2. Приоритет задачи
CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high', 'critical');

-- 3. Статус выполнения агента
CREATE TYPE agent_execution_status AS ENUM ('pending', 'running', 'completed', 'failed', 'cancelled');

-- 4. Тип действия аудита
CREATE TYPE audit_action AS ENUM (
  'create', 'update', 'delete', 'login', 'logout',
  'payment', 'subscription_change', 'project_create',
  'project_delete', 'settings_change', 'api_call'
);

-- ============================================
-- Таблица: tasks (Задачи админ-панели)
-- ============================================
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  assignee_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  status task_status NOT NULL DEFAULT 'todo',
  priority task_priority NOT NULL DEFAULT 'medium',
  due_date TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_tasks_project_id ON tasks(project_id);
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_assignee ON tasks(assignee_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_priority ON tasks(priority);
CREATE INDEX idx_tasks_created_at ON tasks(created_at DESC);

-- ============================================
-- Таблица: agent_executions (Выполнения AI-агентов)
-- ============================================
CREATE TABLE IF NOT EXISTS agent_executions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  agent_name TEXT NOT NULL,
  status agent_execution_status NOT NULL DEFAULT 'pending',
  input JSONB DEFAULT '{}'::jsonb,
  output JSONB DEFAULT '{}'::jsonb,
  error_message TEXT,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  duration_seconds INTEGER,
  tokens_used INTEGER DEFAULT 0,
  cost INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_agent_executions_project ON agent_executions(project_id);
CREATE INDEX idx_agent_executions_user ON agent_executions(user_id);
CREATE INDEX idx_agent_executions_agent ON agent_executions(agent_name);
CREATE INDEX idx_agent_executions_status ON agent_executions(status);
CREATE INDEX idx_agent_executions_created ON agent_executions(created_at DESC);

-- ============================================
-- Таблица: audit_logs (Аудит действий)
-- ============================================
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action audit_action NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT,
  details JSONB DEFAULT '{}'::jsonb,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_resource ON audit_logs(resource_type, resource_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- ============================================
-- RLS Policies
-- ============================================

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Service role: полный доступ (админ-панель)
CREATE POLICY "Service role full access tasks" ON tasks
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Service role full access agent executions" ON agent_executions
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Service role full access audit logs" ON audit_logs
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- ============================================
-- Функция: автоматическая запись аудита
-- ============================================
CREATE OR REPLACE FUNCTION log_audit_event(
  p_user_id UUID,
  p_action audit_action,
  p_resource_type TEXT,
  p_resource_id TEXT DEFAULT NULL,
  p_details JSONB DEFAULT '{}'::jsonb,
  p_ip_address TEXT DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
  v_log_id UUID;
BEGIN
  INSERT INTO audit_logs (user_id, action, resource_type, resource_id, details, ip_address, user_agent)
  VALUES (p_user_id, p_action, p_resource_type, p_resource_id, p_details, p_ip_address, p_user_agent)
  RETURNING id INTO v_log_id;
  RETURN v_log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- Триггеры updated_at
-- ============================================
CREATE TRIGGER update_tasks_updated_at
  BEFORE UPDATE ON tasks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();